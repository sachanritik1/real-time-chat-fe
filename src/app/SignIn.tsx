'use client';

import { useEffect, useRef } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userAtom, wsAtom } from '../store/store';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { fetchData } from '@/apiHandlers/fetch';

const SignIn = () => {
  const userIdRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const setUser = useSetRecoilState(userAtom);
  const [ws, setWs] = useRecoilState(wsAtom);

  const router = useRouter();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: async (user: { email: string; name: string }) => {
      const data = await fetchData('/login', 'POST', user);
      return data;
    },
    onSuccess: (data) => {
      setUser({ ...data?.user, roomId: null });
      if (data?.user?.id) router.push('/home');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = userIdRef.current?.value;
    const name = nameRef.current?.value;
    if (!email || !name) return;
    login({ name, email });
  };

  useEffect(() => {
    function connect() {
      const socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL || '');
      setWs(socket);
    }
    connect();
    return () => {
      if (!ws) return;
      ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto flex h-screen flex-col items-center justify-center">
      <h1 className="my-4 -mt-20 text-3xl font-bold">Welcome!</h1>
      <div className="rounded-lg bg-slate-300 p-4">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            ref={userIdRef}
            className="rounded-md bg-neutral-200 px-4 py-1"
            type="email"
            placeholder="Email Id"
            required
          />
          <input
            ref={nameRef}
            className="rounded-md bg-neutral-200 px-4 py-1"
            type="text"
            placeholder="Name"
            required
          />
          <button
            className="rounded-md bg-blue-500 px-4 py-1 text-white hover:bg-blue-600"
            type="submit"
            disabled={isLoading}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
