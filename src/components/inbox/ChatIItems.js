import ChatItem from "./ChatItem";
import { useGetConversationsQuery } from "../../features/conversation/conversationApi";
import { useSelector } from "react-redux";
import moment from "moment";
import gravatarUrl from "gravatar-url";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function ChatItems() {
  const authData = useSelector((state) => state.auth);
  const { data, error, isLoading, isError } = useGetConversationsQuery(
    authData.user.email
  );
  const { data: conversations, totalCount } = data || {};

  let content = null;
  if (isLoading) {
    content = <h1>Data is Loading</h1>;
  } else if (isError) {
    content = error?.data;
  } else if (
    isLoading === false &&
    isError === false &&
    conversations.length === 0
  ) {
    content = <h1>No Data Found</h1>;
  } else if (
    conversations.length > 0 &&
    isLoading === false &&
    isError === false
  ) {
    content = conversations.map((item) => {
      const { id, timestamp, message } = item;
      const email = authData?.user.email;
      const { name: participateName, email: participateEmail } =
        item.users.find((user) => user.email !== email);

      return (
        <li key={uuidv4()}>
          <Link to={`/inbox/${id}`}>
            <ChatItem
              avatar={gravatarUrl(participateEmail, 80)}
              name={participateName}
              lastMessage={message}
              lastTime={moment(timestamp).fromNow()}
            />
          </Link>
        </li>
      );
    });
  }

  return content;
}
