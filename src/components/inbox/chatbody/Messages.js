import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { messageApiSlice } from "./../../../features/message/messageApi";
import { useParams } from "react-router-dom";

export default function Messages({ messages = [], totalCount }) {
  const userEmail = useSelector((state) => state.auth.user.email);
  const [hasmore, setMore] = useState(true);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    if (page > 1) {
      dispatch(
        messageApiSlice.endpoints.getMoreMessages.initiate({
          id: id,
          page: page,
        })
      );
    }
  }, [dispatch, page, id]);

  useEffect(() => {
    if (totalCount > 0) {
      const more =
        Math.ceil(
          totalCount / Number(process.env.REACT_APP_MESSAGES_PER_PAGE)
        ) > page;

      setMore(more);
    }
  }, [page, totalCount]);

  const fetchData = () => {
    setPage((prev) => prev + 1);
  };
  return (
    <div className="relative w-full h-[calc(100vh_-_197px)] p-6 overflow-y-auto flex flex-col-reverse">
      <ul className="space-y-2">
        <InfiniteScroll
          dataLength={messages?.length}
          next={fetchData}
          hasMore={hasmore}
          loader={<h4>Loading...</h4>}
          height={window.innerHeight - 509}
        >
          {messages
            .slice()
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((message) => {
              const { message: lastMessage, id, sender } = message;
              const justify = sender?.email === userEmail ? "end" : "start";
              return (
                <Message
                  key={uuidv4()}
                  justify={justify}
                  message={lastMessage}
                />
              );
            })}
        </InfiniteScroll>
      </ul>
    </div>
  );
}

// send api request after user keystoke
