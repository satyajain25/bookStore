import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DELETEUSER, GETUSER } from '../../components/ApiEndipoint/ApiEndpoint.js';
import apiClient from '../Axios/apiClient.js';

export const fetchUserWithBooks = createAsyncThunk('user/fetchUserWithBooks',
    async (_, thunkAPI) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('Authentication token not found');

            const response = await apiClient.get(GETUSER, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);
export const deleteUserBook = createAsyncThunk(
    'user/deleteBook',
    async (bookId, thunkAPI) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('Authentication token not found');

            await apiClient.delete(DELETEUSER(bookId), {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            thunkAPI.dispatch(fetchUserWithBooks());
            return bookId;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);
const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: false,
        user: null,
        recommendedBooks: [],
        error: null,
    },
    reducers: {
        addBookToUser: (state, action) => {
            state.recommendedBooks.unshift(action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchUserWithBooks.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserWithBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.recommendedBooks = action.payload.recommendedBooks;
            })
            .addCase(fetchUserWithBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUserBook.pending, state => {
                state.loading = true;
            })
            .addCase(deleteUserBook.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteUserBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export const { addBookToUser } = userSlice.actions;
export default userSlice.reducer;
