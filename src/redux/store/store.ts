import { userReducer } from './../../components/Admin/UserSlice';
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import destinationsSlice from "../../components/Maps/destinationsSlice";
import { blogsReducer } from "../../components/Blogs/BlogsSlice";

// Cấu hình persist cho destinations slice
const destinationsPersistConfig = {
  key: "destinations",
  storage,
};

const persistedDestinationsReducer = persistReducer(
  destinationsPersistConfig,
  destinationsSlice
);

export const store = configureStore({
  reducer: {
    destinations: persistedDestinationsReducer,
    blogs: blogsReducer,
    user: userReducer
    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store);
