import ChatProfileButton from './ChatProfileButton';
import { useRecoilValue } from 'recoil';
import { roomsAtom } from '../store/store';

const ProfileBox = () => {
  const rooms = useRecoilValue(roomsAtom);
  return (
    <div className="flex h-[calc(100%-26rem)] flex-col gap-4">
      <div className="flex flex-row items-center justify-between text-xs">
        <span className="font-bold">Active Rooms</span>
        <span className="flex size-4 items-center justify-center rounded-full bg-gray-300">
          {rooms?.length}
        </span>
      </div>
      <div className="-mx-2 flex flex-col space-y-1 overflow-y-auto">
        {rooms?.length === 0 && (
          <div className="flex flex-row items-center p-2 text-sm">
            No Rooms Active
          </div>
        )}
        {rooms?.map((room) => <ChatProfileButton key={room?.id} room={room} />)}
      </div>
    </div>
  );
};

export default ProfileBox;
