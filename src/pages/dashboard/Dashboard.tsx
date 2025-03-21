import { useSelector } from 'react-redux';
import { RootState } from '../../types';
import { dashboardMockData } from '../../mocks/dashboardData';
import {
  UsersIcon,
  BriefcaseIcon,
  ClockIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { stats, recentActivities, upcomingEvents } = dashboardMockData;

  const statCards = [
    {
      title: 'Tổng nhân viên',
      value: stats.totalEmployees,
      icon: <UsersIcon className="h-6 w-6" />,
      trend: '+12% so với tháng trước',
      trendColor: 'text-green-600'
    },
    {
      title: 'Đi làm hôm nay',
      value: stats.presentToday,
      icon: <BriefcaseIcon className="h-6 w-6" />,
      trend: `${stats.attendanceRate}% tỷ lệ đi làm`,
      trendColor: 'text-blue-600'
    },
    {
      title: 'Nghỉ phép',
      value: stats.onLeave,
      icon: <ClockIcon className="h-6 w-6" />,
      trend: `${stats.leaveRate}% nhân sự`,
      trendColor: 'text-yellow-600'
    },
    {
      title: 'Phòng ban',
      value: stats.totalDepartments,
      icon: <BuildingOfficeIcon className="h-6 w-6" />,
      trend: `${stats.locations} văn phòng`,
      trendColor: 'text-gray-600'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Xin chào, {user?.name}!
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Đây là tổng quan hoạt động công ty hôm nay
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-md bg-blue-50 p-2 dark:bg-blue-900/20">
                {stat.icon}
              </div>
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
            </div>
            <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              {stat.title}
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className={`mt-2 text-sm ${stat.trendColor}`}>{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Hoạt động gần đây
          </h2>
          <div className="mt-6 flow-root">
            <ul className="-mb-8">
              {recentActivities.map((activity, index) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {index !== recentActivities.length - 1 && (
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