import { useRecoilValue } from 'recoil';
import { userAtom } from '../store/store';
import Image from 'next/image';

const UserBox = () => {
  const user = useRecoilValue(userAtom);
  return (
    <div className="mt-4 flex h-48 w-full flex-col items-center rounded-lg border border-gray-200 bg-indigo-100 px-4 py-6">
      <Image
        width={100}
        height={100}
        src="https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
        alt="Avatar"
        className="size-12 rounded-full sm:size-24"
      />
      <div className="mt-2 text-sm font-semibold">{user?.name}</div>
      <div className="text-xs text-gray-500">@{user?.id}</div>
    </div>
  );
};

export default UserBox;
