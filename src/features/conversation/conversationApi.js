import { apiSlice } from "../api/apislice";

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
    }),
    editConversation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useAddConversationMutation,
  useGetConversationQuery,
  useEditConversationMutation,
} = conversationApiSlice;
