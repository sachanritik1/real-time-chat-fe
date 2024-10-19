import { useRecoilValue, useRecoilState } from "recoil";
import { Room, SupportedOutgoingMessage } from "../constants";
import { currentRoomAtom, userAtom, wsAtom } from "../store/store";

const ChatProfileButton = ({ room }: { room: Room }) => {
  const user = useRecoilValue(userAtom);
  console.log("user", user);

  const ws = useRecoilValue(wsAtom);
  const [currentRoom, setCurrentRoom] = useRecoilState(currentRoomAtom);

  const handleJoinRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.disabled = true;
    console.log(`Joining room ${room?.id}`);
    const data = {
      type: SupportedOutgoingMessage.JoinRoom,
      payload: {
        roomId: room?.id,
        name: user?.name,
        userId: user?.id,
      },
    };
    if (!ws) return;
    ws.send(JSON.stringify(data));
    setCurrentRoom(room);
    e.currentTarget.disabled = false;
  };

  return (
    <button
      onClick={(e) => handleJoinRoom(e)}
      className={
        "flex flex-row items-center hover:bg-gray-100 rounded-xl p-2" +
        (currentRoom?.id === room?.id ? " bg-gray-100" : "")
      }
    >
      <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
        {room?.id?.charAt(0)?.toUpperCase()}
      </div>
      <div className="ml-2 text-sm font-semibold">{room?.name}</div>
    </button>
  );
};

export default ChatProfileButton;
