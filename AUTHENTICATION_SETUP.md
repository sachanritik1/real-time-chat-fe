# Authentication Setup Guide

This guide explains how to set up and use the authentication system in the real-time chat application.

## Environment Variables

Create a `.env.local` file in the frontend root directory with the following variables:

```env
# Backend API URL - where your Node.js server is running
NEXT_PUBLIC_BASE_URL=http://localhost:8080

# WebSocket URL for real-time communication
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8080

# Environment
NODE_ENV=development
```

## Backend Environment Variables

Ensure your backend `.env` file includes:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## How Authentication Works

### 1. User Login

- Users log in with email and name
- Backend generates JWT token and sets httpOnly cookie
- Frontend stores token in both cookie and localStorage
- AuthContext manages authentication state

### 2. API Requests

- All protected API endpoints require authentication
- `fetchData` function automatically includes JWT token in requests
- Tokens are sent via Authorization header: `Bearer <token>`
- Invalid tokens trigger automatic logout

### 3. WebSocket Authentication

- WebSocket connections require JWT token
- Token passed as query parameter: `ws://localhost:8080?token=<jwt>`
- Connection rejected if token is invalid
- Server uses authenticated user data for all operations

### 4. Protected Routes

- `/home` and other protected routes use `ProtectedRoute` wrapper
- Automatically redirects to login if not authenticated
- Shows loading state during authentication check

## Key Components

### AuthContext (`src/context/AuthContext.tsx`)

- Manages global authentication state
- Provides login/logout functions
- Handles token validation and refresh

### useAuthenticatedWebSocket (`src/hooks/useAuthenticatedWebSocket.ts`)

- Custom hook for authenticated WebSocket connections
- Automatically reconnects with valid token
- Provides connection status monitoring

### ProtectedRoute (`src/components/ProtectedRoute.tsx`)

- Wrapper component for protected pages
- Redirects unauthenticated users to login
- Shows loading states

## Usage Examples

### Login

```javascript
const { login } = useAuth();
// After successful API login
login(userData, token);
```

### Logout

```javascript
const { logout } = useAuth();
await logout(); // Clears tokens and redirects
```

### Protected API Call

```javascript
const data = await fetchData('/create/room', 'POST', { name: 'Room Name' });
// Automatically includes authentication headers
```

### WebSocket Usage

```javascript
const { ws, connectionStatus } = useAuthenticatedWebSocket();
// WebSocket automatically authenticated with JWT token
```

## Security Features

1. **HttpOnly Cookies**: Tokens stored in secure httpOnly cookies
2. **Automatic Token Validation**: Tokens verified on app startup
3. **Secure WebSocket**: Authentication required for WebSocket connections
4. **Server-side Validation**: All user operations validated server-side
5. **Automatic Logout**: Invalid tokens trigger immediate logout
6. **CORS Protection**: Proper CORS configuration with credentials

## Troubleshooting

### "Authentication failed" errors

- Check if JWT_SECRET matches between frontend and backend
- Verify token isn't expired (24-hour expiry)
- Ensure cookies are enabled in browser

### WebSocket connection issues

- Verify NEXT_PUBLIC_WEBSOCKET_URL is correct
- Check if backend WebSocket server is running
- Confirm token is valid and not expired

### Redirect loops

- Clear browser cookies and localStorage
- Check if environment variables are set correctly
- Verify backend /me endpoint is working
