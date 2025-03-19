import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth';
import { loginStart, loginSuccess, loginFailure } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { dispatch }) => {
    try {
      dispatch(loginStart());
      const response = await authService.login(credentials);
      dispatch(loginSuccess(response));
      return response;
    } catch (error: any) {
      dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
      throw error;
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      authService.logout();
      dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
); 