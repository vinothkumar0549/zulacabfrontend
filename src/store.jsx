import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apislice";

const Store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default Store;
