import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../components/Slice/authSlice';
import bookReducer from '../components/Slice/bookSlice';
import bookGetReducer from '../components/Slice/bookGetSlice.js';
import userReducer from '../components/Slice/userSlice.js'
const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    allbooks: bookGetReducer,
    user: userReducer,
  },
});

export default store;
