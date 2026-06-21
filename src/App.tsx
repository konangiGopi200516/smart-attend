import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Students from './pages/dashboard/Students';
import FaceEnrollment from './pages/dashboard/FaceEnrollment';
import LiveAttendance from './pages/dashboard/LiveAttendance';
import AdminDepartments from './pages/dashboard/AdminDepartments';
import MyProfile from './pages/dashboard/MyProfile';
import StudentAttendance from './pages/dashboard/StudentAttendance';
import StudentHistory from './pages/dashboard/StudentHistory';
import Analytics from './pages/dashboard/Analytics';
import Settings from './pages/dashboard/Settings';
import PostedAttendance from './pages/dashboard/PostedAttendance';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="students" element={<Students />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="my-attendance" element={<StudentAttendance />} />
            <Route path="history" element={<StudentHistory />} />
            <Route path="departments" element={<AdminDepartments />} />
            <Route path="enrollment" element={<FaceEnrollment />} />
            <Route path="live" element={<LiveAttendance />} />
            <Route path="posted-attendance" element={<PostedAttendance />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
