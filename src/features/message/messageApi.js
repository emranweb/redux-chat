import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "../api/apislice";
import { io } from "socket.io-client";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (id) => ({
        url: `/messages?conversationId=${id}`,
        method: "GET",
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
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
          socket.on("message", (data) => {
            console.log(data);
            updateCachedData((draft) => {
              let message = draft.find((m) => console.log(m.id));
              console.log(message);
            });
          });
        } catch (error) {
          console.log(error);
        }
        await cacheEntryRemoved;
        socket.close();
      },
    }),
    addMessage: builder.mutation({
      query: (data) => ({
        url: `/messages`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetMessagesQuery, useAddMessageMutation } = messageApiSlice;
