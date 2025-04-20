// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { redditApi } from '../features/api/apiSlice'; // or whatever your path is

export const store = configureStore({
  reducer: {
    [redditApi.reducerPath]: redditApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(redditApi.middleware),
});
