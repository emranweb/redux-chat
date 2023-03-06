import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "../api/apislice";
import { io } from "socket.io-client";
import { createEntityAdapter, current } from "@reduxjs/toolkit";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (id) => ({
        url: `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_MESSAGES_PER_PAGE}`,
        method: "GET",
      }),
      transformResponse(apiResponse, meta) {
        const totalCount = meta.response.headers.get("X-Total-Count");
        console.log(totalCount);
        return {
          data: apiResponse,
          totalCount: totalCount,
        };
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState }
      ) {
        let getRecievedUserEmail = getState().auth?.user?.email;

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
          socket.on("messages", (data) => {
            updateCachedData((draft) => {
              if (data?.data?.receiver?.email === getRecievedUserEmail) {
                console.log("condidtion check");
                draft.data.push(data?.data);
              }
            });
          });
        } catch (error) {
          console.log(error);
        }
        await cacheEntryRemoved;
        socket.close();
      },
    }),

    getMoreMessages: builder.query({
      query: ({ id, page }) => ({
        url: `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=${page}&_limit=${process.env.REACT_APP_MESSAGES_PER_PAGE}`,
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const messages = await queryFulfilled;
        try {
          if (messages) {
            dispatch(
              apiSlice.util.updateQueryData("getMessages", arg.id, (draft) => {
                return {
                  data: [...draft.data, ...messages.data],
                  totalCount: Number(draft.totalCount),
                };
              })
            );
          }
        } catch (error) {
          console.log(error);
        }
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
