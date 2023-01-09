import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "../api/apislice";

const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (id) => ({
        url: `/messages?conversationId=${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetMessagesQuery } = messageApiSlice;
