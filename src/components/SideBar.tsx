'use client';

import { LOGO_SVG } from '../constants';
import UserBox from './UserBox';
import ProfileBox from './ProfileBox';
import ProfileInput from './ProfileInput';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { roomsAtom } from '../store/store';
import SidePane from './SidePane';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '@/apiHandlers/fetch';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const SideBar = () => {
  const setRooms = useSetRecoilState(roomsAtom);
  const { logout, user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const data = await fetchData('/rooms');
      return data;
    },
    onSuccess: (data) => {
      setRooms(data?.rooms);
    },
  });

  return (
    <div className="flex h-16 w-full items-center bg-blue-200 p-4 sm:h-full sm:w-16 sm:flex-col">
      <GiHamburgerMenu
        className="size-6"
        role="button"
        onClick={() => setOpen(true)}
      />
      <SidePane
        isOpen={open}
        closeSidePane={() => setOpen(false)}
        position="left"
      >
        <div className="flex h-12 w-full flex-row items-center justify-center">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
            {LOGO_SVG}
          </div>
          <div className="ml-2 text-2xl font-bold">QuickChat</div>
        </div>
        <UserBox />
        <ProfileBox />
        <ProfileInput />
        <div className="mt-auto p-4">
          <div className="mb-2 text-sm text-gray-600">
            Welcome, {user?.name}
          </div>
          <button
            onClick={async () => {
              await logout();
              router.push('/');
            }}
            className="w-full rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </SidePane>
    </div>
  );
};

export default SideBar;
