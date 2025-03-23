import axios from 'axios';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  departmentId?: string;
}

export interface LastScreenState {
  path: string;
  data?: any;
  timestamp: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  lastScreen?: LastScreenState;
}

const AUTH_STORAGE_KEY = 'emp_auth_state';

export const saveAuthState = (state: AuthState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(AUTH_STORAGE_KEY, serializedState);
    
    console.log('Saved auth state:', state);
  } catch (error) {
    console.error('Error saving auth state:', error);
  }
};

export const saveLastScreen = (path: string, data?: any): void => {
  try {
    const currentState = loadAuthState();
    if (currentState && currentState.isAuthenticated) {
      const updatedState: AuthState = {
        ...currentState,
        lastScreen: {
          path,
          data,
          timestamp: Date.now(),
        },
      };
      saveAuthState(updatedState);
      
      console.log('Saved last screen:', updatedState.lastScreen);
    }
  } catch (error) {
    console.error('Error saving last screen:', error);
  }
};

export const loadAuthState = (): AuthState | null => {
  try {
    const serializedState = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!serializedState) {
      return null;
    }
    
    const state = JSON.parse(serializedState);
    
    console.log('Loaded auth state:', state);
    
    return state;
  } catch (error) {
    console.error('Error loading auth state:', error);
    return null;
  }
};

export const clearAuthState = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    console.log('Cleared auth state');
  } catch (error) {
    console.error('Error clearing auth state:', error);
  }
};

export const setupAxiosAuth = (token: string): void => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Setup axios auth token');
  }
};

export const clearAxiosAuth = (): void => {
  delete axios.defaults.headers.common['Authorization'];
  console.log('Cleared axios auth token');
};

const authService = {
  saveAuthState,
  loadAuthState,
  clearAuthState,
  setupAxiosAuth,
  clearAxiosAuth,
  saveLastScreen,
};

export default authService; 