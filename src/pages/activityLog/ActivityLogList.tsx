import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { API_ENDPOINTS } from '../../constants';
import { useApi } from '../../hooks/useApi';
import ActivityLogFilters from './components/ActivityLogFilters';
import ActivityLogSummary from './components/ActivityLogSummary';
import ActivityLogTable from './components/ActivityLogTable';

const ActivityLogList = () => {
  const api = useApi();
  const [filters, setFilters] = useState({
    userId: '',
    entityType: '',
    action: '',
    startDate: null,
    endDate: null,
    page: 1
  });

  const { data: activityData, isLoading } = useQuery({
    queryKey: ['activity-logs', filters],
    queryFn: () => api.get(API_ENDPOINTS.ACTIVITY_LOGS.BASE, { params: filters })
  });

  const { data: summaryData } = useQuery({
    queryKey: ['activity-summary'],
    queryFn: () => api.get(`${API_ENDPOINTS.ACTIVITY_LOGS.BASE}/summary`)
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Lịch sử hoạt động
          </h1>
        </div>
      </div>

      <ActivityLogSummary data={summaryData} />
      <ActivityLogFilters filters={filters} setFilters={setFilters} />
      <ActivityLogTable data={activityData} isLoading={isLoading} filters={filters} setFilters={setFilters} />
    </div>
  );
};

export default ActivityLogList; 