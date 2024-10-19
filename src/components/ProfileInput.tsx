import { useRef } from "react";
import { useSetRecoilState } from "recoil";
import { roomsAtom } from "../store/store";
import { Room } from "@/constants";

const ProfileInput = () => {
  const roomIdRef = useRef<HTMLInputElement>(null);
  const setRooms = useSetRecoilState(roomsAtom);

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const button = e.currentTarget[1] as HTMLButtonElement;
    try {
      button.disabled = true;
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/create/room",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomId: roomIdRef.current?.value }),
        }
      );
      const json = await res.json();
      console.log(json.room);
      setRooms((prev: Room[]) => [...prev, json.room]);
      roomIdRef.current!.value = "";
    } catch (error) {
      console.error(error);
    } finally {
      button.disabled = false;
    }
  };

  return (
    <form className="py-4" onSubmit={(e) => handleCreateRoom(e)}>
      <input
        ref={roomIdRef}
        type="text"
        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
        placeholder="Type room id here..."
      />
      <button
        type="submit"
        className="w-full h-10 mt-2 bg-indigo-500 hover:bg-indigo-800 text-white rounded-lg"
      >
        Create Room
      </button>
    </form>
  );
};

export default ProfileInput;
