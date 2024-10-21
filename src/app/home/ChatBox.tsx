'use client';

import SideBar from '@/components/SideBar';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userAtom, wsAtom } from '@/store/store';
import Chats from '@/components/Chats';
import { useRouter } from 'next/navigation';
import { ChatType, SupportedIncomingMessage } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '@/apiHandlers/fetch';

const ChatBox = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const router = useRouter();

  const [chats, setChats] = useState<ChatType[]>([]);

  const ws = useRecoilValue(wsAtom);

  useQuery({
    queryKey: ['chats', user?.roomId],
    queryFn: async () => {
      const data = await fetchData(`/chat/${user?.roomId}`);
      return data;
    },
    onSuccess: (data) => {
      setChats(data?.chats);
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!ws) return;
    ws.onmessage = (message) => {
      console.log('incoming message from chats component:', message.data);
      const incomingMessage = JSON.parse(message.data);
      if (incomingMessage.type === SupportedIncomingMessage.JoinedRoom) {
        // @ts-expect-error: id might not exist on payload
        setUser((prev) => ({
          ...prev,
          roomId: incomingMessage.payload.id,
        }));
        console.log('joined room', incomingMessage.payload.id);
      } else if (incomingMessage.type === SupportedIncomingMessage.AddChat) {
        setChats((prevChats) => [incomingMessage.payload, ...prevChats]);
        console.log('Added Chat', incomingMessage.payload);
      } else {
        console.log('Unsupported Message Types');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user?.id) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="flex h-dvh w-dvw flex-col gap-4 text-gray-800 antialiased sm:flex-row sm:gap-0">
      <SideBar />
      <Chats chats={chats} />
    </div>
  );
};

export default ChatBox;
