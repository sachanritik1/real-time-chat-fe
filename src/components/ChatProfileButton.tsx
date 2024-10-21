'use client';

import { useRecoilValue } from 'recoil';
import { Room, SupportedOutgoingMessage } from '../constants';
import { userAtom, wsAtom } from '../store/store';

const ChatProfileButton = ({ room }: { room: Room }) => {
  const user = useRecoilValue(userAtom);

  const ws = useRecoilValue(wsAtom);

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
    e.currentTarget.disabled = false;
  };

  return (
    <button
      onClick={(e) => handleJoinRoom(e)}
      className={
        'flex flex-row items-center rounded-xl p-2 hover:bg-gray-100' +
        (user?.roomId === room?.id ? ' bg-gray-100' : '')
      }
    >
      <div className="flex size-8 items-center justify-center rounded-full bg-indigo-200">
        {room?.id?.charAt(0)?.toUpperCase()}
      </div>
      <div className="ml-2 text-sm font-semibold">{room?.name}</div>
    </button>
  );
};

export default ChatProfileButton;
