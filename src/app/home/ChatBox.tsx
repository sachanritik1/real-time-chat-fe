"use client";

import SideBar from "@/components/SideBar";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom, wsAtom, currentRoomAtom } from "@/store/store";
import DefaultChatPage from "@/components/DefaultChatPage";
import Chats from "@/components/Chats";
import { useRouter } from "next/navigation";

const ChatBox = () => {
  const user = useRecoilValue(userAtom);
  const currentRoom = useRecoilValue(currentRoomAtom);
  const [ws, setWs] = useRecoilState(wsAtom);

  const router = useRouter();

  console.log("websocket URL", process.env.NEXT_PUBLIC_WEBSOCKET_URL);

  useEffect(() => {
    async function connect() {
      const socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "");
      setWs(socket);
      if (!ws) return;
      ws.onopen = () => {
        console.log("Connected to server");
      };
    }
    connect();

    return () => {
      if (!ws) return;
      ws.onclose = () => {
        console.log("Disconnected from server");
      };
    };
  }, []);

  console.log("user", user);

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <div className="flex-col sm:flex-row flex h-[100dvh] gap-4 sm:gap-0 w-[100dvw] antialiased text-gray-800">
      <SideBar />
      {currentRoom?.id ? <Chats /> : <DefaultChatPage />}
    </div>
  );
};

export default ChatBox;
