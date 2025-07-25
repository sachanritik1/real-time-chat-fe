'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import Cookies from 'js-cookie';
import { User } from '@/store/store';

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  ws: WebSocket | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected' | 'error'
  >('disconnected');
  const wsRef = useRef<WebSocket | null>(null);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken =
          Cookies.get('auth-token') || localStorage.getItem('auth-token');

        if (storedToken) {
          // Verify token with backend
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/me`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${storedToken}`,
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            },
          );

          if (response.ok) {
            const data = await response.json();
            setUser({
              userId: data.user.userId,
              email: data.user.email,
              name: data.user.name,
            });
            setToken(storedToken);
          } else {
            // Token is invalid, clear it
            Cookies.remove('auth-token');
            localStorage.removeItem('auth-token');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid tokens
        Cookies.remove('auth-token');
        localStorage.removeItem('auth-token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User, userToken: string) => {
    setUser({
      userId: userData.id,
      email: userData.email,
      name: userData.name,
    });
    setToken(userToken);

    // Store token in both cookie and localStorage for flexibility
    Cookies.set('auth-token', userToken, {
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    localStorage.setItem('auth-token', userToken);
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear server-side session
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear client-side state regardless of API call result
      setUser(null);
      setToken(null);
      Cookies.remove('auth-token');
      localStorage.removeItem('auth-token');
    }
  };

  // WebSocket management
  useEffect(() => {
    if (!user || !token) {
      // Clean up WebSocket if user is not authenticated
      if (wsRef.current) {
        wsRef.current.close(1000, 'User logged out');
        wsRef.current = null;
        setWs(null);
      }
      setConnectionStatus('disconnected');
      return;
    }

    // Only create WebSocket if we don't have one or it's closed
    if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
      const connectWebSocket = () => {
        try {
          setConnectionStatus('connecting');

          const wsUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}?token=${encodeURIComponent(token)}`;
          const socket = new WebSocket(wsUrl);
          wsRef.current = socket;

          socket.onopen = () => {
            console.log('Authenticated WebSocket connected');
            setConnectionStatus('connected');
            setWs(socket);
          };

          socket.onclose = (event) => {
            console.log('WebSocket disconnected:', event.code, event.reason);
            setConnectionStatus('disconnected');
            setWs(null);
            wsRef.current = null;

            // Reconnect after 3 seconds if it wasn't a manual close and user is still authenticated
            if (event.code !== 1000 && user && token) {
              setTimeout(connectWebSocket, 3000);
            }
          };

          socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setConnectionStatus('error');
          };
        } catch (error) {
          console.error('Failed to create WebSocket connection:', error);
          setConnectionStatus('error');
        }
      };

      connectWebSocket();
    }

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
      }
    };
  }, [user, token]);

  const value: AuthContextType = {
    user,
    token,
    ws,
    connectionStatus,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
