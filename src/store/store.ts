import { configureStore } from "@reduxjs/toolkit";
import { userSearchApi } from "../features/user-search/api/userSearchApi";

export const store = configureStore({
  reducer: {
    [userSearchApi.reducerPath]: userSearchApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userSearchApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
