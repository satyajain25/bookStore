import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GETBOOK, GETBOOKBYID } from '../../components/ApiEndipoint/ApiEndpoint';
import apiClient from '../Axios/apiClient';

// ✅ Fetch all books
export const fetchAllBooks = createAsyncThunk(
  'books/getall',
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await apiClient.get(GETBOOK, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.books;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ✅ Fetch single book by ID
export const fetchBookById = createAsyncThunk(
  'books/getById',
  async (bookId, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await apiClient.get(GETBOOKBYID(bookId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.book;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ✅ Slice definition
const bookGetSlice = createSlice({
  name: 'allbooks',
  initialState: {
    loading: false,
    error: null,
    allBooks: [],
    book: null,
  },
  reducers: {
    // ✅ Add new book to list without refetching all
    addBookToList: (state, action) => {
      state.allBooks.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch all books
      .addCase(fetchAllBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.allBooks = action.payload;
      })
      .addCase(fetchAllBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔄 Fetch book by ID
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Export actions and reducer
export const { addBookToList } = bookGetSlice.actions;
export default bookGetSlice.reducer;
