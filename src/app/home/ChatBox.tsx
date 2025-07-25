'use client';

import SideBar from '@/components/SideBar';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userAtom } from '@/store/store';
import Chats from '@/components/Chats';
import { ChatType, SupportedIncomingMessage } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '@/apiHandlers/fetch';
import { useAuth } from '@/context/AuthContext';

const ChatBox = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const { user: authUser } = useAuth();

  const [chats, setChats] = useState<ChatType[]>([]);

  const { ws, connectionStatus } = useAuth();

  useQuery({
    queryKey: ['chats', user?.roomId],
    queryFn: async () => {
      if (!user?.roomId) return null;
      const data = await fetchData(`/chat/${user.roomId}`);
      return data;
    },
    enabled: !!user?.roomId,
    onSuccess: (data) => {
      if (data?.chats) {
        setChats(data.chats);
      }
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!ws || connectionStatus !== 'connected') return;

    const handleMessage = (message: MessageEvent) => {
      console.log('incoming message from chats component:', message.data);
      try {
        const incomingMessage = JSON.parse(message.data);
        if (incomingMessage.type === SupportedIncomingMessage.JoinedRoom) {
          setUser((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              roomId: incomingMessage.payload.id,
            };
          });
          console.log('joined room', incomingMessage.payload.id);
        } else if (incomingMessage.type === SupportedIncomingMessage.AddChat) {
          setChats((prevChats) => [incomingMessage.payload, ...prevChats]);
          console.log('Added Chat', incomingMessage.payload);
        } else {
          console.log('Unsupported Message Types');
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onmessage = handleMessage;

    return () => {
      if (ws.onmessage === handleMessage) {
        ws.onmessage = null;
      }
    };
  }, [ws, connectionStatus, setUser]);

  // Sync auth user with recoil user state
  useEffect(() => {
    if (authUser && (!user || user.id !== authUser.userId)) {
      setUser({
        id: authUser.userId,
        name: authUser.name,
        email: authUser.email,
        roomId: user?.roomId || null,
        password: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }, [authUser, user, setUser]);

  // Show connection status if not connected
  if (connectionStatus === 'connecting') {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="text-lg">Connecting to chat...</div>
      </div>
    );
  }

  if (connectionStatus === 'error') {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="text-lg text-red-500">
          Connection error. Please refresh the page.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-dvw flex-col gap-4 text-gray-800 antialiased sm:flex-row sm:gap-0">
      <SideBar />
      <Chats chats={chats} />
    </div>
  );
};

export default ChatBox;
