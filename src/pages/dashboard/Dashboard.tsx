import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { formatCurrency } from '../../utils/number';
import { formatDate } from '../../utils/date';
import {
  UsersIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

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
}

const Dashboard = () => {
  const api = useApi();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats'),
  });

  const cards = [
    {
      name: 'Total Employees',
      value: stats?.totalEmployees || 0,
      icon: UsersIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Departments',
      value: stats?.totalDepartments || 0,
      icon: BuildingOfficeIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Present Today',
      value: stats?.presentToday || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Total Salary',
      value: formatCurrency(stats?.totalSalaryThisMonth || 0),
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500',
    },
  ];

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.name}
            className="relative overflow-hidden rounded-lg bg-white p-6 shadow"
          >
            <dt>
              <div className={`absolute rounded-md ${card.color} p-3`}>
                <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {card.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Hires */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Hires
            </h3>
            <div className="mt-6 flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                {stats?.recentHires.map((person) => (
                  <li key={person.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {person.name}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {person.position}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(person.startDate)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Department Stats */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Departments
            </h3>
            <div className="mt-6 flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                {stats?.departmentStats.map((dept) => (
                  <li key={dept.name} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">
                          <h3 className="truncate text-sm font-medium text-gray-900">
                            {dept.name}
                          </h3>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {dept.employeeCount} employees
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 