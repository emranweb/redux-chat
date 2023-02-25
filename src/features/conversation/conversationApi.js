import { io } from "socket.io-client";
import { apiSlice } from "../api/apislice";
import { messageApiSlice } from "../message/messageApi";

export const conversationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) => ({
        url: `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=5`,
        method: "GET",
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // create socket
        const socket = io("http://localhost:9000", {
          reconnectionDelay: 1000,
          reconnection: true,
          reconnectionAttemps: 10,
          transports: ["websocket"],
          agent: false,
          upgrade: false,
          rejectUnauthorized: false,
        });

        try {
          await cacheDataLoaded;
          socket.on("conversation", (data) => {
            updateCachedData((draft) => {
              const conversation = draft.find((c) => c.id == data?.data?.id);

              if (conversation?.id) {
                conversation.message = data?.data?.message;
                conversation.timestamp = data?.data?.timestamp;
              } else {
              }
            });
          });
        } catch (err) {}

        await cacheEntryRemoved;
        socket.close();
      },
    }),
    getConversation: builder.query({
      query: ({ userEmail, participantEmail }) => ({
        url: `/conversations?participants_like=${userEmail}-${participantEmail}&&participants_like=${participantEmail}-${userEmail}}`,
        method: "GET",
      }),
    }),
    // add conversation mudation for add a new conversation
    addConversation: builder.mutation({
      query: (data) => ({
        url: `/conversations`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const conversation = await queryFulfilled;

        dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            conversation.data.sender,
            (draft) => {
              draft.push(conversation.data);
            }
          )
        );

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
          console.log("conversation error");
        }
      },
    }),

    // edit conversation mutaion for edit the existing conversation
    editConversation: builder.mutation({
      query: ({ id, sender, data }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),

      // after query fulltill it called the getConversation query
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const conversationUpdate = dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            arg.sender,
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
              (user) => user.email === arg.sender
            );

            const receiver = arg.data.users.find(
              (user) => user.email !== arg.sender
            );

            // create a new message on existing conversation
            const res = await dispatch(
              messageApiSlice.endpoints.addMessage.initiate({
                conversationId: conversation?.data.id,
                message: arg.data.message,
                sender,
                receiver,
                timestamp: arg.data.timestamp,
              })
            ).unwrap();

            // after the message set call the get message query
            dispatch(
              apiSlice.util.updateQueryData(
                "getMessages",
                res.conversationId.toString(),
                (draft) => {
                  draft.push(res);
                }
              )
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
