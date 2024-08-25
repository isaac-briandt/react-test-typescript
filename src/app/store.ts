import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import todosReducer from "../features/auth/todoSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todosReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
