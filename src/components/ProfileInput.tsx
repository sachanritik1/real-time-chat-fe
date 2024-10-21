'use client';

import { useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { roomsAtom } from '../store/store';
import { Room } from '@/constants';
import { useMutation } from '@tanstack/react-query';
import { fetchData } from '@/apiHandlers/fetch';

const ProfileInput = () => {
  const roomIdRef = useRef<HTMLInputElement>(null);
  const setRooms = useSetRecoilState(roomsAtom);

  const { mutate: createRoom, isLoading } = useMutation({
    mutationFn: async (room: { name: string }) => {
      const data = await fetchData('/create/room', 'POST', room);
      return data;
    },
    onSuccess: (data) => {
      setRooms((prev: Room[]) => [...prev, data.room]);
      roomIdRef.current!.value = '';
    },
  });

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = roomIdRef.current?.value;
    if (!name) return;
    createRoom({ name });
  };

  return (
    <form className="py-4" onSubmit={(e) => handleCreateRoom(e)}>
      <input
        ref={roomIdRef}
        type="text"
        className="flex h-10 w-full rounded-xl border pl-4 focus:border-indigo-300 focus:outline-none"
        placeholder="Type room id here..."
      />
      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 h-10 w-full rounded-lg bg-indigo-500 text-white hover:bg-indigo-800"
      >
        Create Room
      </button>
    </form>
  );
};

export default ProfileInput;
