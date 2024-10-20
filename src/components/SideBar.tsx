import { LOGO_SVG } from "../constants";
import UserBox from "./UserBox";
import ProfileBox from "./ProfileBox";
import ProfileInput from "./ProfileInput";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { roomsAtom } from "../store/store";
import SidePane from "./SidePane";
import { GiHamburgerMenu } from "react-icons/gi";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/apiHandlers/fetch";

const SideBar = () => {
  const setRooms = useSetRecoilState(roomsAtom);

  const [open, setOpen] = useState(true);

  useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const data = await fetchData("/rooms");
      return data;
    },
    onSuccess: (data) => {
      setRooms(data?.rooms);
    },
  });

  return (
    <div className="sm:w-16 w-full h-16 sm:h-full bg-blue-200 flex sm:flex-col items-center p-4">
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
        <div className="flex flex-row items-center justify-center h-12 w-full">
          <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
            {LOGO_SVG}
          </div>
          <div className="ml-2 font-bold text-2xl">QuickChat</div>
        </div>
        <UserBox />
        <ProfileBox />
        <ProfileInput />
      </SidePane>
    </div>
  );
};

export default SideBar;
