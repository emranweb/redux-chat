import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "../api/apislice";

const conversationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversation: builder.query({
      query: (email) => ({
        url: `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=5`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetConversationQuery } = conversationApiSlice;
