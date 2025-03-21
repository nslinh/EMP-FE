import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const api = useApi();
  const [groupBy, setGroupBy] = useState('department');
  const [salaryType, setSalaryType] = useState('month');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [quarter, setQuarter] = useState(Math.floor(month / 3) + 1);

  const { data: employeeStats } = useQuery({
    queryKey: ['employee-stats', groupBy],
    queryFn: () => api.get(`/statistics/employees?groupBy=${groupBy}`)
  });

  const { data: salaryStats } = useQuery({
    queryKey: ['salary-stats', { type: salaryType, year, month, quarter }],
    queryFn: () => api.get(`/statistics/salary?type=${salaryType}&year=${year}&month=${month}&quarter=${quarter}`)
  });

  const handleExport = async (format: 'excel' | 'pdf', type: 'employees' | 'salary' | 'attendance') => {
    try {
      const response = await api.get(`/statistics/export?format=${format}&type=${type}`, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          Accept: format === 'excel' 
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'application/pdf'
        }
      });
      
      const blob = new Blob([response.data], {
        type: format === 'excel'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${type}-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Export error:', error);
      // Thêm thông báo lỗi cho người dùng
      if (error.response) {
        console.error('Response error:', error.response);
      }
    }
  };

  const employeeChartData = {
    labels: employeeStats?.map((stat: any) => stat.departmentInfo.name) || [],
    datasets: [
      {
        label: 'Số lượng nhân viên',
        data: employeeStats?.map((stat: any) => stat.count) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)'
      }
    ]
  };

  const salaryChartData = {
    labels: employeeStats?.map((stat: any) => stat.departmentInfo.name) || [],
    datasets: [
      {
        label: 'Tổng lương',
        data: employeeStats?.map((stat: any) => stat.totalSalary) || [],
        backgroundColor: 'rgba(147, 51, 234, 0.5)'
      },
      {
        label: 'Lương trung bình',
        data: employeeStats?.map((stat: any) => stat.avgSalary) || [],
        backgroundColor: 'rgba(234, 179, 8, 0.5)'
      }
    ]
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Báo cáo và Thống kê
          </h1>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex space-x-2">
          <button
            onClick={() => handleExport('excel', 'employees')}
            className="btn-primary"
          >
            Xuất Excel
          </button>
          <button
            onClick={() => handleExport('pdf', 'employees')}
            className="btn-secondary"
          >
            Xuất PDF
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Thống kê nhân viên */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Thống kê nhân viên</h2>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="rounded-md border-gray-300"
            >
              <option value="department">Theo phòng ban</option>
              <option value="position">Theo chức vụ</option>
              <option value="gender">Theo giới tính</option>
            </select>
          </div>
          <Bar data={employeeChartData} />
        </div>

        {/* Thống kê lương */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Thống kê lương</h2>
            <div className="flex space-x-2">
              <select
                value={salaryType}
                onChange={(e) => setSalaryType(e.target.value)}
                className="rounded-md border-gray-300"
              >
                <option value="month">Theo tháng</option>
                <option value="quarter">Theo quý</option>
              </select>
              {salaryType === 'month' ? (
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="rounded-md border-gray-300"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>Tháng {m}</option>
                  ))}
                </select>
              ) : (
                <select
                  value={quarter}
                  onChange={(e) => setQuarter(Number(e.target.value))}
                  className="rounded-md border-gray-300"
                >
                  {[1, 2, 3, 4].map((q) => (
                    <option key={q} value={q}>Quý {q}</option>
                  ))}
                </select>
              )}
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="rounded-md border-gray-300"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <Bar data={salaryChartData} />
          {salaryStats?.summary && (
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Tổng nhân viên</p>
                <p className="font-semibold">{salaryStats.summary.totalEmployees}</p>
              </div>
              <div>
                <p className="text-gray-500">Tổng lương</p>
                <p className="font-semibold">{salaryStats.summary.totalSalary.toLocaleString('vi-VN')}đ</p>
              </div>
              <div>
                <p className="text-gray-500">Lương trung bình</p>
                <p className="font-semibold">{salaryStats.summary.avgSalary.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics; 