'use client';

import ChatInput from './ChatInput';
import Chat from './Chat';
import { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../store/store';
import DefaultChatPage from './DefaultChatPage';
import { ChatType } from '@/constants';

const Chats = ({ chats }: { chats: ChatType[] | null }) => {
  const user = useRecoilValue(userAtom);

  const scrollContainerRef = useRef(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      // @ts-expect-error scrollTop might not exist on current
      scrollContainerRef.current.scrollTop =
        // @ts-expect-error: scrollHeight might not exist on current
        scrollContainerRef.current.scrollHeight;
    }
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  if (!user?.roomId) {
    return <DefaultChatPage />;
  }

  return (
    <div className="flex h-[calc(100%-5rem)] flex-auto flex-col rounded-2xl bg-gray-100 p-6 sm:h-full">
      <div className="flex h-full flex-auto shrink-0 flex-col">
        {(chats?.length ?? 0) > 0 ? (
          <div className="mb-4 flex h-full flex-col overflow-x-auto">
            <div
              ref={scrollContainerRef}
              className="flex flex-col-reverse overflow-y-auto p-4"
            >
              {chats?.map((chat) => (
                <Chat
                  key={chat.chatId}
                  left={chat?.userId !== user?.id}
                  chat={chat}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="my-auto flex items-center justify-center font-semibold italic">
            No Chats Yet
          </div>
        )}
        <ChatInput />
      </div>
    </div>
  );
};

export default Chats;
