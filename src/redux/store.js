import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tweetReducer from './slices/tweetSlice';
 
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tweets: tweetReducer,
  },
});
 
export default store;
 