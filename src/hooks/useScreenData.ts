import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { saveLastScreen } from '../features/auth/authSlice';

export interface ScreenData {
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  selectedItems?: string[];
  pagination?: {
    page: number;
    pageSize: number;
  };
  scrollPosition?: number;
  tabIndex?: number;
  [key: string]: any;
}

export function useScreenData(screenData?: ScreenData) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && location.pathname !== '/login' && screenData) {
      dispatch(saveLastScreen({ 
        path: location.pathname,
        data: screenData
      }));
    }
  }, [location.pathname, screenData, isAuthenticated, dispatch]);

  const savedState = useSelector((state: RootState) => state.auth.lastScreen);
  const savedData = savedState?.path === location.pathname ? savedState.data : undefined;

  return {
    savedData,
    updateScreenData: (newData: ScreenData) => {
      if (isAuthenticated && location.pathname !== '/login') {
        dispatch(saveLastScreen({ 
          path: location.pathname,
          data: newData
        }));
      }
    }
  };
}

export default useScreenData; 