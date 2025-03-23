import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from "axios"
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

// Thêm interface cho params
interface ExportParams {
  format: 'excel' | 'pdf';
  type: 'employees' | 'salary' | 'attendance';
  year?: number;
  month?: number;
  quarter?: number;
}

const Statistics = () => {
  const api = useApi();
  const [groupBy, setGroupBy] = useState('department');
  const [salaryType, setSalaryType] = useState('month');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [quarter, setQuarter] = useState(Math.floor(month / 3) + 1);
  const [isExcelOpen, setIsExcelOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  const { data: employeeStats } = useQuery({
    queryKey: ['employee-stats', groupBy],
    queryFn: () => api.get(`/statistics/employees?groupBy=${groupBy}`)
  });

  const { data: salaryStats } = useQuery({
    queryKey: ['salary-stats', { type: salaryType, year, month, quarter }],
    queryFn: () => api.get(`/statistics/salary?type=${salaryType}&year=${year}&month=${month}&quarter=${quarter}`)
  });

  const handleExport = async (params: ExportParams) => {
    try {
      // Tạo query params
      const queryParams = new URLSearchParams({
        format: params.format,
        type: params.type
      });

      // Thêm params tùy theo loại báo cáo
      if (params.type === 'salary') {
        queryParams.append('year', year.toString());
        if (salaryType === 'month') {
          queryParams.append('month', month.toString());
        } else {
          queryParams.append('quarter', quarter.toString());
        }
      }

      // Gọi API để lấy file
      const response = await axios.get(`/statistics/export?${queryParams}`, {
        responseType: "blob"
      });
      console.log("responseresponseresponse", response)
      let fileName = `report-${params.type}-${new Date().toISOString().split('T')[0]}.${params.format === 'excel' ? 'xlsx' : 'pdf'}`;
      // Tạo URL và kích hoạt tải xuống
      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error: any) {
      // Xử lý error response
      if (error.response instanceof Blob) {
        try {
          const blob = error.response;
          const text = await blob.text();
          const errorData = JSON.parse(text);
          console.error('Export error:', errorData.message);
        } catch {
          console.error('Export error:', error.message);
        }
      } else {
        console.error('Export error:', error);
      }
    } finally {
      setIsExcelOpen(false);
      setIsPdfOpen(false);
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
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex space-x-4">
          {/* Excel Export Button */}
          <div className="relative">
            <button
              onClick={() => {
                setIsExcelOpen(!isExcelOpen);
                setIsPdfOpen(false);
              }}
              onBlur={() => setTimeout(() => setIsExcelOpen(false), 200)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span>Xuất Excel</span>
              <svg
                className={`ml-2 -mr-1 h-5 w-5 transition-transform duration-200 ${isExcelOpen ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {isExcelOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleExport({ format: 'excel', type: 'employees' })}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <svg className="mr-3 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Báo cáo nhân viên</span>
                  </button>

                  <button
                    onClick={() => handleExport({ format: 'excel', type: 'salary' })}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <svg className="mr-3 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Báo cáo lương</span>
                  </button>

                  <button
                    onClick={() => handleExport({ format: 'excel', type: 'attendance' })}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <svg className="mr-3 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Báo cáo chấm công</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PDF Export Button - Tương tự như Excel nhưng với isPdfOpen */}
          <div className="relative">
            <button
              onClick={() => {
                setIsPdfOpen(!isPdfOpen);
                setIsExcelOpen(false);
              }}
              onBlur={() => setTimeout(() => setIsPdfOpen(false), 200)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span>Xuất PDF</span>
              <svg
                className={`ml-2 -mr-1 h-5 w-5 transition-transform duration-200 ${isPdfOpen ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {isPdfOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleExport({ format: 'pdf', type: 'employees' })}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <svg className="mr-3 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Báo cáo nhân viên</span>
                  </button>

                  <button
                    onClick={() => handleExport({ format: 'pdf', type: 'salary' })}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <svg className="mr-3 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Báo cáo lương</span>
                  </button>

                  <button
                    onClick={() => handleExport({ format: 'pdf', type: 'attendance' })}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <svg className="mr-3 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Báo cáo chấm công</span>
                  </button>
                </div>
              </div>
            )}
          </div>
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