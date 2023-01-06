import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: undefined,
    user: undefined,
  },
  reducers: {
    userLogin: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    userLogOut: (state) => {
      state.accessToken = undefined;
      state.user = undefined;
    },
  },
});

export default authSlice.reducer;
export const { userLogin, userLogOut } = authSlice.actions;
