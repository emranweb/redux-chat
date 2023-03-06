import ChatItem from "./ChatItem";
import { useGetConversationsQuery } from "../../features/conversation/conversationApi";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import gravatarUrl from "gravatar-url";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { conversationApiSlice } from "./../../features/conversation/conversationApi";

export default function ChatItems() {
  const authData = useSelector((state) => state.auth);
  const [hasmore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isError } = useGetConversationsQuery(
    authData.user.email
  );
  const { data: conversations, totalCount } = data || {};

  const dispatch = useDispatch();

  useEffect(() => {
    if (page > 1) {
      dispatch(
        conversationApiSlice.endpoints.getMoreConversations.initiate({
          email: authData?.user.email,
          page: page,
        })
      );
    }
  }, [dispatch, page, authData]);

  useEffect(() => {
    if (totalCount > 0) {
      const more =
        Math.ceil(
          totalCount / Number(process.env.REACT_APP_CONVERSATIONS_PER_PAGE)
        ) > page;

      setHasMore(more);
    }
  }, [page, totalCount]);

  const fetchData = () => {
    setPage((prev) => prev + 1);
  };

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
    content = (
      <InfiniteScroll
        dataLength={conversations?.length}
        next={fetchData}
        hasMore={hasmore}
        loader={<h4>Loading...</h4>}
        height={window.innerHeight - 459}
      >
        {conversations.map((item) => {
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
        })}
      </InfiniteScroll>
    );
  }

  return content;
}
