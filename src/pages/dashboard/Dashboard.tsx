import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';

interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  presentToday: number;
  absentToday: number;
  totalSalaryThisMonth: number;
  recentHires: Array<{
    id: string;
    name: string;
    position: string;
    startDate: string;
  }>;
  departmentStats: Array<{
    name: string;
    employeeCount: number;
  }>;
  attendanceRate: any,
  onLeave: any,
  leaveRate: any,
  locations: any,
}

const Dashboard = () => {
  const api = useApi();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats'),
  });

  const { data: recentActivities } = useQuery<any[]>({
    queryKey: ['recent-activities'],
    queryFn: () => api.get('/activities/recent'),
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-lg bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          Welcome back, {user?.name}! Here's what's happening with your company today.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="stats-container">
        <div className="stat-card">
          <p className="stat-title">Total Employees</p>
          <p className="stat-value">{stats?.totalEmployees || 0}</p>
          <p className="stat-description text-success-600">
            ↗︎ 12% increase
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-title">Present Today</p>
          <p className="stat-value">{stats?.presentToday || 0}</p>
          <p className="stat-description text-success-600">
            {stats?.attendanceRate || 0}% attendance rate
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-title">On Leave</p>
          <p className="stat-value">{stats?.onLeave || 0}</p>
          <p className="stat-description text-warning-600">
            {stats?.leaveRate || 0}% of workforce
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-title">Departments</p>
          <p className="stat-value">{stats?.totalDepartments || 0}</p>
          <p className="stat-description text-gray-600 dark:text-gray-400">
            Across {stats?.locations || 0} locations
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activities</h3>
          </div>
          <div className="card-body">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities?.map((activity: any, index: number) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {index !== recentActivities?.length - 1 && (
                        <span
                          className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex items-start space-x-3">
                        <div className="relative px-1">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 ring-8 ring-white dark:bg-primary-900 dark:ring-gray-900">
                            {/* Icon based on activity type */}
                            <span className="text-primary-600 dark:text-primary-400">
                              {activity.icon}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {activity.user}
                              </span>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                              {activity.description}
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <time dateTime={activity.date}>{activity.time}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-8">
          {/* Upcoming Events */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Upcoming Events</h3>
            </div>
            <div className="card-body">
              <div className="space-y-6">
                {/* Event items */}
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Team Meeting
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Today at 2:00 PM
                    </p>
                  </div>
                  <button className="btn btn-secondary btn-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Stats</h3>
            </div>
            <div className="card-body">
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    New Employees
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-primary-600">
                    12
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Leave Requests
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-warning-600">
                    5
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 