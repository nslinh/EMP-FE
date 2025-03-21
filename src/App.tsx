import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './app/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Employees from './pages/employees/Employees';
import Departments from './pages/departments/Departments';
import Attendance from './pages/attendance/Attendance';
import EmployeeAttendance from './pages/attendance/EmployeeAttendance';
import LeaveRequest from './pages/attendance/LeaveRequest';
import Salary from './pages/salary/Salary';
import Profile from './pages/profile/Profile';
import NotFound from './pages/NotFound';
import Statistics from './pages/reports/Statistics';
import ActivityLogs from './pages/reports/ActivityLogs';
import ActivityLogList from './pages/activityLog/ActivityLogList';

const App = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
          />
        </Route>

        {/* Protected routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/employees/*"
            element={user?.role === 'admin' ? <Employees /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/departments/*"
            element={user?.role === 'admin' ? <Departments /> : <Navigate to="/dashboard" />}
          />
          
          {/* Attendance routes */}
          <Route path="/attendance">
            <Route 
              index 
              element={
                user?.role === 'admin' ? 
                <Attendance /> : 
                <EmployeeAttendance />
              } 
            />
            <Route 
              path="leave-request" 
              element={
                user?.role === 'employee' ? 
                <LeaveRequest /> : 
                <Navigate to="/attendance" />
              } 
            />
          </Route>

          <Route
            path="/salary"
            element={user?.role === 'admin' ? <Salary /> : <Navigate to="/dashboard" />}
          />
          <Route path="/profile" element={<Profile />} />

          {/* Report routes - Chỉ admin mới truy cập được */}
          <Route path="/reports">
            <Route index element={user?.role === 'admin' ? <Statistics /> : <Navigate to="/dashboard" />} />

            <Route path="activity" element={user?.role === 'admin' ? <ActivityLogs /> : <Navigate to="/dashboard" />} />
          </Route>

          <Route
            path="/activity-logs"
            element={user?.role === 'admin' ? <ActivityLogList /> : <Navigate to="/dashboard" />}
          />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" />
    </Router>
  );
};

export default App;
