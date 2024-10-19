import { useRecoilValue } from "recoil";
import { userAtom } from "../store/store";
import Image from "next/image";

const UserBox = () => {
  const user = useRecoilValue(userAtom);
  return (
    <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg h-48">
      <Image
        width={100}
        height={100}
        src="https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
        alt="Avatar"
        className="size-12 sm:size-24 rounded-full"
      />
      <div className="text-sm font-semibold mt-2">{user?.name}</div>
      <div className="text-xs text-gray-500">@{user?.id}</div>
    </div>
  );
};

export default UserBox;
