import ChatProfileButton from "./ChatProfileButton";
import { useRecoilValue } from "recoil";
import { roomsAtom } from "../store/store";

const ProfileBox = () => {
  const rooms = useRecoilValue(roomsAtom);
  return (
    <div>
      <div className="flex flex-col mt-8">
        <div className="flex flex-row items-center justify-between text-xs">
          <span className="font-bold">Active Rooms</span>
          <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
            {rooms.length}
          </span>
        </div>
        <div className="flex flex-col space-y-1 mt-4 -mx-2 h-80 overflow-y-scroll">
          {rooms.length === 0 && (
            <div className="flex flex-row items-center text-sm p-2">
              No Rooms Active
            </div>
          )}
          {rooms.map((room) => (
            <ChatProfileButton key={room?.id} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileBox;
