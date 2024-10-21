"use client";

import { useEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userAtom, wsAtom } from "../store/store";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { fetchData } from "@/apiHandlers/fetch";

const SignIn = () => {
  const userIdRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const setUser = useSetRecoilState(userAtom);
  const [ws, setWs] = useRecoilState(wsAtom);

  const router = useRouter();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: async (user: { email: string; name: string }) => {
      const data = await fetchData("/login", "POST", user);
      return data;
    },
    onSuccess: (data) => {
      setUser({ ...data?.user, roomId: null });
      if (data?.user?.id) router.push("/home");
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
      const socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "");
      setWs(socket);
    }
    connect();
    return () => {
      if (!ws) return;
      ws.close();
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mx-auto h-screen">
      <h1 className="my-4 text-3xl font-bol -mt-20">Welcome!</h1>
      <div className="bg-slate-300 p-4 rounded-lg">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            ref={userIdRef}
            className="px-4 py-1 rounded-md bg-neutral-200"
            type="email"
            placeholder="Email Id"
            required
          />
          <input
            ref={nameRef}
            className="px-4 py-1 rounded-md bg-neutral-200"
            type="text"
            placeholder="Name"
            required
          />
          <button
            className="px-4 py-1 rounded-md text-white bg-blue-500 hover:bg-blue-600"
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
