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

        try {
          if (conversation?.data.id) {
            const sender = arg.users.find((user) => user.email === arg.sender);
            const receiver = arg.users.find(
              (user) => user.email !== arg.sender
            );

            dispatch(
              messageApiSlice.endpoints.addMessage.initiate({
                conversationId: conversation?.data.id,
                message: arg.message,
                sender,
                receiver,
                timestamp: arg.timestamp,
              })
            );
          }
        } catch (error) {
          // conversationUpdate.undo();
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
        const conversationUpdate = dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            arg.data.sender,
            (draft) => {
              const draftConversation = draft.find((c) => c.id == arg.id);
              draftConversation.message = arg.data.message;
              draftConversation.timestamp = arg.data.timestamp;
            }
          )
        );

        const conversation = await queryFulfilled;
        try {
          if (conversation?.data.id) {
            const sender = arg.data.users.find(
              (user) => user.email === arg.data.sender
            );
            const receiver = arg.data.users.find(
              (user) => user.email !== arg.data.sender
            );

            const res = await dispatch(
              messageApiSlice.endpoints.addMessage.initiate({
                conversationId: conversation?.data.id,
                message: arg.data.message,
                sender,
                receiver,
                timestamp: arg.data.timestamp,
              })
            ).unwrap();

            apiSlice.util.updateQueryData(
              "getMessages",
              res.conversationId.toString(),
              (draft) => {
                draft.push(res);
              }
            );
          }
        } catch (error) {
          conversationUpdate.undo();
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
