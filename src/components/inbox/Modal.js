import { useEffect, useState } from "react";
import { useGetUserQuery } from "../../features/users/usersApi";
import { mailValidationCheck } from "../ui/isValidate";
import Error from "../ui/Error";
import { useDispatch, useSelector } from "react-redux";
import {
  conversationApiSlice,
  useAddConversationMutation,
  useEditConversationMutation,
} from "../../features/conversation/conversationApi";

function debouce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      return func(...args);
    }, delay);
  };
}

export default function Modal({ open, control }) {
  const [message, setMessage] = useState();
  const [checkUser, setCheckUser] = useState(false);
  const [to, setTo] = useState();
  const { user } = useSelector((state) => state.auth) || {};
  const { email: loginUser } = user;
  const [conversation, setConversation] = useState(undefined);
  const [error, setError] = useState("");

  const { data: userEmail } = useGetUserQuery(to, {
    skip: !checkUser,
  });

  // add conversation

  const [addConversation, { isSuccess: addConversationSuccess }] =
    useAddConversationMutation();

  // edit conversation

  const [editConversation, { isSuccess: editConversationSuccess }] =
    useEditConversationMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (userEmail?.length > 0) {
      dispatch(
        conversationApiSlice.endpoints.getConversation.initiate({
          userEmail: loginUser,
          participantEmail: to,
        })
      )
        .unwrap()
        .then((data) => setConversation(data))
        .catch((error) => setError(error));
    }
    // get conversation
  }, [userEmail, dispatch, loginUser, to]);

  // conversation sucess modal close

  useEffect(() => {
    if (addConversationSuccess || editConversationSuccess) {
      control();
    }
  }, [addConversationSuccess, editConversationSuccess]);

  const mailCheck = (value) => {
    const valid = mailValidationCheck(value);

    if (valid) {
      setTo(valid[0]);
      setCheckUser(true);
    }
  };

  const handleChange = debouce(mailCheck, 1000);
  // form submit

  const formSubmit = (event) => {
    event.preventDefault();

    if (conversation?.length > 0) {
      editConversation({
        id: conversation[0].id,
        sender: loginUser,
        data: {
          participants: `${loginUser}-${userEmail[0].email}`,
          users: [user, userEmail[0]],
          message,
          timeStamp: new Date().getTime(),
        },
      });
    } else if (conversation?.length === 0) {
      addConversation({
        participants: `${loginUser}-${userEmail[0].email}`,
        sender: loginUser,
        users: [user, userEmail[0]],
        message,
        timeStamp: new Date().getTime(),
      });
    }
  };

  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        ></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Send message
          </h2>
          <form
            className="mt-8 space-y-6"
            action="#"
            method="POST"
            onSubmit={formSubmit}
          >
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  id="to"
                  name="to"
                  type="mail"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Send to"
                  onChange={(e) => handleChange(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  type="message"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-30"
                disabled={
                  conversation === undefined ||
                  (userEmail?.length > 0 && userEmail[0].email === loginUser)
                }
              >
                Send Message
              </button>
            </div>
            {userEmail?.length === 0 && <Error message="No user Found" />}
            {error && <Error message={error} />}
            {userEmail?.length > 0 && userEmail[0].email === loginUser && (
              <Error message="You Can't Send Email Yourself" />
            )}
          </form>
        </div>
      </>
    )
  );
}
