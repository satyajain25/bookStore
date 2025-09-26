import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LOGIN, REGISTER,UPDATEUSER } from "../../components/ApiEndipoint/ApiEndpoint.js";
import { storeUserData } from '../../utils/storage.js';
import apiClient from "../Axios/apiClient";



export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await apiClient.post(REGISTER, userData);
      await storeUserData(response.data.user);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message || 'Registration failed');
    }
  }
);
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await apiClient.post(LOGIN, userData);
      // console.log("response:", response);
      const { token, user } = response.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));


      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message || 'Login failed'
      );
    }
  }
);


export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const formData = new FormData();
      formData.append('username', userData.name);
      formData.append('email', userData.email);

      if (userData.image) {
        formData.append('profileImage', {
          uri: userData.image.uri,
          name: userData.image.fileName || 'profile.jpg',
          type: userData.image.type || 'image/jpeg',
        });
      }

      const response = await apiClient.put(UPDATEUSER, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // ✅ Persist updated user to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data.user;
    } catch (error) {
      console.error('❌ Error updating user:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message || 'Update failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    token: null, 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;

      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token; 
        // console.log("Token set in Redux store:", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
  },
});

export default authSlice.reducer;
