import { configureStore} from '@reduxjs/toolkit';
import userReducer from "./user/userSlice";

// middleware is added to be safe from any warnings
export const store = configureStore({
  reducer: {
    user: userReducer
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
});