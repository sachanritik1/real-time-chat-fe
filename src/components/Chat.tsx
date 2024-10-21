import { ChatType } from '../constants';

const Chat = ({ left, chat }: { left: boolean; chat: ChatType }) => {
  const { message, name } = chat;
  if (left)
    return (
      <div className="col-start-1 col-end-8 rounded-lg p-3">
        <div className="flex flex-row items-center">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-500">
            {name?.[0]}
          </div>
          <div className="relative ml-3 rounded-xl bg-white px-4 py-2 text-sm shadow">
            <div>{message}</div>
          </div>
        </div>
      </div>
    );
  return (
    <div className="col-start-6 col-end-13 rounded-lg p-3">
      <div className="flex flex-row-reverse items-center justify-start">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-500">
          {name?.[0]}
        </div>
        <div className="relative mr-3 rounded-xl bg-indigo-100 px-4 py-2 text-sm shadow">
          <div>{message}</div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
