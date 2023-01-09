// import Blank from "./Blank";
import { useGetMessagesQuery } from "../../../features/message/messageApi";
import ChatHead from "./ChatHead";
import Messages from "./Messages";
import Options from "./Options";
import { useParams } from "react-router-dom";

export default function ChatBody() {
  const { id } = useParams();
  const { data: messages, isLoading, isError } = useGetMessagesQuery(id);
  let content = null;
  if (isLoading) {
    content = <h1>Data is loading</h1>;
  } else if (isError) {
    content = <h1>Error</h1>;
  } else if (!isLoading && !isError && messages.length === 0) {
    content = <h1>No Content found </h1>;
  } else {
    content = (
      <div className="w-full grid conversation-row-grid">
        <ChatHead message={messages[0]} />
        <Messages messages={messages} />
        <Options />
        {/* <Blank /> */}
      </div>
    );
  }
  return <div className="w-full lg:col-span-2 lg:block">{content}</div>;
}
