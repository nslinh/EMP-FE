export const dashboardMockData = {
  stats: {
    totalEmployees: 156,
    totalDepartments: 8,
    presentToday: 142,
    absentToday: 14,
    totalSalaryThisMonth: 450000000,
    attendanceRate: 91,
    onLeave: 8,
    leaveRate: 5.1,
    locations: 3
  },
  recentHires: [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      position: 'Frontend Developer',
      startDate: '2024-03-01'
    },
    {
      id: '2', 
      name: 'Trần Thị B',
      position: 'UI/UX Designer',
      startDate: '2024-02-28'
    }
  ],
  recentActivities: [
    {
      id: '1',
      user: 'Lê Văn C',
      description: 'Đã check-in',
      time: '08:45 AM',
      date: '2024-03-15',
      type: 'check-in'
    },
    {
      id: '2',
      user: 'Phạm Thị D',
      description: 'Đã gửi đơn xin nghỉ phép',
      time: '09:30 AM', 
      date: '2024-03-15',
      type: 'leave-request'
    },
    {
      id: '3',
      user: 'Hoàng Văn E',
      description: 'Đã hoàn thành task ABC-123',
      time: '10:15 AM',
      date: '2024-03-15',
      type: 'task-complete'
    }
  ],
  upcomingEvents: [
    {
      id: '1',
      title: 'Họp Team Weekly',
      time: '14:00',
      date: '2024-03-15'
    },
    {
      id: '2', 
      title: 'Training React Advanced',
      time: '15:30',
      date: '2024-03-15'
    }
  ],
  departmentStats: [
    { name: 'Engineering', employeeCount: 45 },
    { name: 'Marketing', employeeCount: 20 },
    { name: 'Sales', employeeCount: 30 },
    { name: 'HR', employeeCount: 10 }
  ]
}; 