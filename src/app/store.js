import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apislice";
import messageReducer from "../features/message/messageSlice";
import conversationReducer from "../features/conversation/conversationSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    message: messageReducer,
    conversation: conversationReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddlewares) =>
  getDefaultMiddlewares().concat(apiSlice.middleware),
});
