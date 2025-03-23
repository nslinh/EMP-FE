import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import authService, { AuthState, User, LastScreenState } from '../../services/authService';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  lastScreen: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      
      // Cập nhật token cho axios
      authService.setupAxiosAuth(action.payload.token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.lastScreen = undefined;
      
      // Xóa token khỏi axios
      authService.clearAxiosAuth();
    },
    saveLastScreen: (state, action: PayloadAction<{ path: string; data?: any }>) => {
      state.lastScreen = {
        path: action.payload.path,
        data: action.payload.data,
        timestamp: Date.now(),
      };
    },
  },
});

export const { loginSuccess, logout, saveLastScreen } = authSlice.actions;
export default authSlice.reducer; 