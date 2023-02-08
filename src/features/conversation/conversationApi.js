import { apiSlice } from "../api/apislice";
import { messageApiSlice } from "../message/messageApi";

export const conversationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) => ({
        url: `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=5`,
        method: "GET",
      }),
    }),
    getConversation: builder.query({
      query: ({ userEmail, participantEmail }) => ({
        url: `/conversations?participants_like=${userEmail}-${participantEmail}&&participants_like=${participantEmail}-${userEmail}}`,
        method: "GET",
      }),
    }),
    addConversation: builder.mutation({
      query: (data) => ({
        url: `/conversations`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const conversation = await queryFulfilled;

        if (conversation?.data.id) {
          console.log(arg);
          const sender = arg.users.find((user) => user.email === arg.sender);
          const receiver = arg.users.find((user) => user.email !== arg.sender);

          dispatch(
            messageApiSlice.endpoints.addMessage.initiate({
              conversationId: conversation.id,
              message: arg.message,
              sender,
              receiver,
              timestamp: arg.timestamp,
            })
          );
        }
      },
    }),
    editConversation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        console.log("it here");
        const conversation = await queryFulfilled;
        if (conversation?.data.id) {
          console.log(arg);
          const sender = arg.data.users.find(
            (user) => user.email === arg.data.sender
          );
          const receiver = arg.data.users.find(
            (user) => user.email !== arg.data.sender
          );
          console.log("add conversation");

          dispatch(
            messageApiSlice.endpoints.addMessage.initiate({
              conversationId: conversation.id,
              message: arg.data.message,
              sender,
              receiver,
              timestamp: arg.data.timestamp,
            })
          );
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useAddConversationMutation,
  useGetConversationQuery,
  useEditConversationMutation,
} = conversationApiSlice;
