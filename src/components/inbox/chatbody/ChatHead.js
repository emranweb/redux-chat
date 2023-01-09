import { useSelector } from "react-redux";
import gravatarUrl from "gravatar-url";

export default function ChatHead({ message }) {
  const userEmail = useSelector((state) => state.auth?.user.email);
  const { sender, receiver } = message;
  const participantEmail =
    sender.email === userEmail ? receiver.email : sender.email;
  const participantName =
    sender.email === userEmail ? receiver.name : sender.name;

  return (
    <div className="relative flex items-center p-3 border-b border-gray-300">
      <img
        className="object-cover w-10 h-10 rounded-full"
        src={gravatarUrl(participantEmail, { size: "50px" })}
        alt="person"
      />
      <span className="block ml-2 font-bold text-gray-600">
        {participantName}
      </span>
    </div>
  );
}
