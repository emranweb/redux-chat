import { apiSlice } from "../api/apislice";

const usersSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (email) => ({
        url: `/users?email=${email}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserQuery } = usersSlice;
