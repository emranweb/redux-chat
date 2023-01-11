import { apiSlice } from "../api/apislice";

const usersSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (email) => ({
        url: `/users?email=${email}`,
        method: "GET",
      }),
    }),
  }),
});

export const { usegetUsersQuery } = usersSlice;
