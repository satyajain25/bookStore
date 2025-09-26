
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ADDBOOK } from '../../components/ApiEndipoint/ApiEndpoint';
import apiClient from '../Axios/apiClient';

export const submitBook = createAsyncThunk(
  'book/books',
  async (bookData, thunkAPI) => {
    try {
      const formData = new FormData();

      formData.append('title', bookData.title);
      formData.append('caption', bookData.caption);
      formData.append('rating', String(bookData.rating));

      const localUri = bookData.image;
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append('image', {
        uri: localUri,
        name: filename || `photo.jpg`,
        type,
      });

      const response = await apiClient.post(ADDBOOK, formData, {
        headers: {
          Authorization: `Bearer ${bookData.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.book;
    } catch (error) {
      console.error(' Error in submitBook:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Book submission failed'
      );
    }
  }
);

const bookSlice = createSlice({
  name: 'book',
  initialState: {
    loading: false,
    error: null,
    book: null,
  },
  reducers: {
    clearBookError: (state) => {
      state.error = null;
    },
    clearBookData: (state) => {
      state.book = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitBook.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload;
      })
      .addCase(submitBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookError, clearBookData } = bookSlice.actions;
export default bookSlice.reducer;
