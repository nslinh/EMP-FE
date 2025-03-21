import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';
import themeReducer from './slices/themeSlice';

// Cấu hình riêng cho auth reducer
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated'] // Chỉ lưu các field cần thiết
};

// Cấu hình cho theme
const themePersistConfig = {
  key: 'theme',
  storage
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    notification: notificationReducer,
    theme: persistedThemeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 