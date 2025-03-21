export const navigation = [
  // ... existing items ...
  {
    name: 'Báo cáo & Thống kê',
    path: '/reports',
    icon: 'ChartBarIcon', // từ @heroicons/react/24/outline
    children: [
      {
        name: 'Tổng quan',
        path: '/reports'
      },
      {
        name: 'Báo cáo lương',
        path: '/reports/salary'
      },
      {
        name: 'Lịch sử hoạt động',
        path: '/reports/activity'
      }
    ],
    roles: ['admin'] // Chỉ admin mới thấy menu này
  },
  {
    name: 'Lịch sử hoạt động',
    path: '/activity-logs',
    icon: 'ClockIcon',
    roles: ['admin']
  }
]; 