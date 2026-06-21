import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Camera, ScanFace, 
  BarChart, Bell, Settings, LogOut, Search, Building2, Calendar, FileText
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [role] = useState<'admin' | 'faculty' | 'student'>(
    (localStorage.getItem('smartattend_role') as any) || 'admin'
  );

  const handleLogout = () => {
    localStorage.removeItem('smartattend_role');
    localStorage.removeItem('smartattend_id');
    navigate('/');
  };

  const adminNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Students', href: '/dashboard/students', icon: Users },
    { name: 'Departments & Faculty', href: '/dashboard/departments', icon: Building2 },
    { name: 'Student Face Enrollment', href: '/dashboard/enrollment', icon: ScanFace },
    { name: 'Live Recognition', href: '/dashboard/live', icon: Camera },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const facultyNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Students', href: '/dashboard/students', icon: Users },
    { name: 'Mark Attendance', href: '/dashboard/live', icon: Camera },
    { name: 'Reports', href: '/dashboard/analytics', icon: BarChart },
    { name: 'Posted Attendance', href: '/dashboard/posted-attendance', icon: FileText },
    { name: 'Attendance History', href: '/dashboard/history', icon: Calendar },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const studentNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', href: '/dashboard/profile', icon: Users },
    { name: 'My Attendance', href: '/dashboard/my-attendance', icon: BarChart },
    { name: 'Attendance History', href: '/dashboard/history', icon: Calendar },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const currentNav = role === 'admin' ? adminNav : role === 'faculty' ? facultyNav : studentNav;

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 bg-slate-900/50 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">SmartAttend</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {currentNav.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-slate-400 hover:text-danger hover:bg-danger/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 bg-background/95 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center bg-slate-900 border border-white/5 rounded-lg px-3 py-1.5 w-96">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search students, roll numbers..." 
              className="bg-transparent border-none outline-none text-sm ml-2 w-full placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-sm font-medium">
              {role === 'admin' ? 'AD' : role === 'faculty' ? 'FA' : 'ST'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
