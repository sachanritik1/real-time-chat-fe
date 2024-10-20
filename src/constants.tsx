export const LOGO_SVG = (
  <svg
    className="size-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeWidth="2"
      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
    ></path>
  </svg>
);

export type ChatType = {
  id?: string;
  chatId: string;
  roomId: string;
  userId: string;
  name: string;
  message: string;
  upvotes: number;
};

export enum SupportedOutgoingMessage {
  JoinRoom = 'JOIN_ROOM',
  SendMessage = 'SEND_MESSAGE',
  UpvoteMessage = 'UPVOTE_MESSAGE',
}

export enum SupportedIncomingMessage {
  AddChat = 'ADD_CHAT',
  UpdateChat = 'UPDATE_CHAT',
  JoinedRoom = 'JOINED_ROOM',
}

export type Room = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
