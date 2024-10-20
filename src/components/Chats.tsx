"use client";

import ChatInput from "./ChatInput";
import Chat from "./Chat";
import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/store";
import DefaultChatPage from "./DefaultChatPage";
import { ChatType } from "@/constants";

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
    <DefaultChatPage />;
  }

  return (
    <div className="flex flex-col flex-auto h-[calc(100%-5rem)] sm:h-full bg-gray-100 p-6 rounded-2xl">
      <div className="flex flex-col flex-auto flex-shrink-0 h-full">
        {(chats?.length ?? 0) > 0 ? (
          <div className="flex flex-col h-full overflow-x-auto mb-4">
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
          <div className="flex items-center justify-center my-auto italic font-semibold">
            No Chats Yet
          </div>
        )}
        <ChatInput />
      </div>
    </div>
  );
};

export default Chats;
