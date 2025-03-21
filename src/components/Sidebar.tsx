import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { navigation } from '../configs/navigation';
import { RootState } from '../app/store';
import * as Icons from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  // Lọc menu theo role của user
  const filteredNavigation = navigation.filter(
    item => !item.roles || item.roles.includes(user?.role || '')
  );

  return (
    <div className="flex h-full flex-col bg-gray-800">
      <div
</rewritten_file> 