import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { formatCurrency } from '../../utils/number';
import { formatDate } from '../../utils/date';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ReportData {
  departmentStats: Array<{
    name: string;
    employeeCount: number;
    totalSalary: number;
  }>;
  attendanceStats: {
    present: number;
    absent: number;
    late: number;
    total: number;
  };
  salaryStats: {
    totalSalary: number;
    averageSalary: number;
    minSalary: number;
    maxSalary: number;
  };
  leaveStats: {
    approved: number;
    pending: number;
    rejected: number;
    total: number;
  };
}

const Reports = () => {
  const api = useApi();
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const { data: reportData, isLoading } = useQuery<ReportData>({
    queryKey: ['reports', { startDate, endDate }],
    queryFn: () =>
      api.get(`/reports?startDate=${startDate}&endDate=${endDate}`),
  });

  const departmentChartData = {
    labels: reportData?.departmentStats.map((dept) => dept.name) || [],
    datasets: [
      {
        label: 'Employee Count',
        data: reportData?.departmentStats.map((dept) => dept.employeeCount) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Total Salary',
        data: reportData?.departmentStats.map((dept) => dept.totalSalary) || [],
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
      },
    ],
  };

  const attendanceChartData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        label: 'Attendance',
        data: reportData
          ? [
              reportData.attendanceStats.present,
              reportData.attendanceStats.absent,
              reportData.attendanceStats.late,
            ]
          : [],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(234, 179, 8, 0.5)',
        ],
      },
    ],
  };

  const leaveChartData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        label: 'Leave Requests',
        data: reportData
          ? [
              reportData.leaveStats.approved,
              reportData.leaveStats.pending,
              reportData.leaveStats.rejected,
            ]
          : [],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(234, 179, 8, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
      },
    ],
  };

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
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Reports
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            View detailed reports and statistics about employees, departments,
            attendance, and more.
          </p>
        </div>
        <div className="mt-4 flex items-center space-x-4 sm:ml-16 sm:mt-0">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      {reportData && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.171-.879-1.171-2.303 0-3.182C10.582 7.72 11.35 7.5 12 7.5c.725 0 1.45.22 2.003.659"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Total Salary
                      </dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">
                        {formatCurrency(reportData.salaryStats.totalSalary)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Average Salary
                      </dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">
                        {formatCurrency(reportData.salaryStats.averageSalary)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Attendance Rate
                      </dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">
                        {Math.round(
                          (reportData.attendanceStats.present /
                            reportData.attendanceStats.total) *
                            100
                        )}
                        %
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Leave Approval Rate
                      </dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">
                        {Math.round(
                          (reportData.leaveStats.approved /
                            reportData.leaveStats.total) *
                            100
                        )}
                        %
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Department Statistics
              </h3>
              <div className="mt-6 h-80">
                <Bar
                  data={departmentChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Attendance Statistics
              </h3>
              <div className="mt-6 h-80">
                <Bar
                  data={attendanceChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Leave Statistics
              </h3>
              <div className="mt-6 h-80">
                <Bar
                  data={leaveChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Salary Distribution
                </h3>
                <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5">
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Minimum Salary
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {formatCurrency(reportData.salaryStats.minSalary)}
                    </dd>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5">
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Maximum Salary
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {formatCurrency(reportData.salaryStats.maxSalary)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports; 