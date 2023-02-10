import Message from "./Message";
import { useSelector } from "react-redux";

export default function Messages({ messages = [] }) {
  const userEmail = useSelector((state) => state.auth.user.email);
  return (
    <div className="relative w-full h-[calc(100vh_-_197px)] p-6 overflow-y-auto flex flex-col-reverse">
      <ul className="space-y-2">
        {messages
          .slice()
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((message) => {
            const { message: lastMessage, id, sender } = message;
            const justify = sender?.email === userEmail ? "end" : "start";
            return <Message key={id} justify={justify} message={lastMessage} />;
          })}
      </ul>
    </div>
  );
}

// send api request after user keystoke
