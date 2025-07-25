import { useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../store/store';
import { SupportedOutgoingMessage } from '../constants';
import { useAuth } from '@/context/AuthContext';

const ChatInput = () => {
  const user = useRecoilValue(userAtom);
  const { ws, connectionStatus } = useAuth();

  const addChat = (message: string) => {
    if (message && ws && connectionStatus === 'connected' && user?.roomId) {
      // Server now uses authenticated user data, so we only need to send the message and roomId
      const data = {
        type: SupportedOutgoingMessage.SendMessage,
        payload: {
          roomId: user.roomId,
          message,
        },
      };
      ws.send(JSON.stringify(data));
    }
  };

  const chatRef = useRef<HTMLInputElement>(null);
  const handleAddChat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const chat = chatRef.current?.value;
    if (!chat) return;
    addChat(chat);
    chatRef.current.value = '';
    console.log(`Chat added: ${chat} at ${new Date().toLocaleTimeString()}`);
  };

  return (
    <form
      onSubmit={(e) => handleAddChat(e)}
      className="flex h-16 w-full flex-row items-center rounded-xl bg-white px-4"
    >
      <div className="ml-4 grow">
        <div className="relative w-full">
          <input
            ref={chatRef}
            type="text"
            className="flex h-10 w-full rounded-xl border pl-4 focus:border-indigo-300 focus:outline-none"
          />
        </div>
      </div>
      <div className="ml-4">
        <button
          type="submit"
          className="flex shrink-0 items-center justify-center rounded-xl bg-indigo-500 px-4 py-1 text-white hover:bg-indigo-600"
        >
          <span>Send</span>
          <span className="ml-2">
            <svg
              className="-mt-px size-4 rotate-45"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              ></path>
            </svg>
          </span>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
