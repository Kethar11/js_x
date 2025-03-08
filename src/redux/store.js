import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tweetReducer from './slices/tweetSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tweets: tweetReducer,
    users: userReducer,
  },
});
 
export default store;