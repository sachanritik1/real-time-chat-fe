import { Room } from "@/constants";
import { atom } from "recoil";

export type User = {
  name: string;
  roomId: string | null;
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export const userAtom = atom({
  key: "user",
  default: null as User | null,
});

export const roomsAtom = atom({
  key: "rooms",
  default: [] as Room[],
});

export const wsAtom = atom({
  key: "ws",
  default: null as WebSocket | null,
});
