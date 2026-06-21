import { Users, UserCheck, UserX, Target, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardHome() {
  const stats = [
    { name: 'Total Students', value: '3,730', icon: Users, trend: '+4%', trendUp: true },
    { name: 'Present Today', value: '3,357', icon: UserCheck, trend: '90.0%', trendUp: true, color: 'text-success' },
    { name: 'Absent Today', value: '373', icon: UserX, trend: '10.0%', trendUp: false, color: 'text-danger' },
    { name: 'Recognition Accuracy', value: '99.4%', icon: Target, trend: '+0.2%', trendUp: true, color: 'text-secondary' },
  ];

  const weeklyData = [
    { day: 'Mon', present: 94 },
    { day: 'Tue', present: 96 },
    { day: 'Wed', present: 92 },
    { day: 'Thu', present: 98 },
    { day: 'Fri', present: 95 },
    { day: 'Sat', present: 88 },
  ];

  const recentScans = [
    { id: '23CSE0001', name: 'Ravi Kumar', time: '09:41 AM', accuracy: '99.8%', status: 'success' },
    { id: '23ECE0045', name: 'Priya Sharma', time: '09:38 AM', accuracy: '98.5%', status: 'success' },
    { id: '23MEC0012', name: 'Rahul Verma', time: '09:35 AM', accuracy: '99.1%', status: 'success' },
    { id: '23EEE0088', name: 'Anjali Desai', time: '09:32 AM', accuracy: '85.4%', status: 'warning' },
    { id: '23CSE0102', name: 'Karthik Reddy', time: '09:28 AM', accuracy: '99.9%', status: 'success' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <div className="text-sm text-slate-400">
          Last updated: Today, 09:41 AM
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-surface border border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
              <stat.icon className="w-16 h-16" />
            </div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color || 'text-primary'}`} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400 flex items-center gap-2">
                {stat.name}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  stat.trendUp ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                }`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* CSS Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-surface border border-white/5 h-[420px] flex flex-col shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-semibold">Weekly Attendance Trends</h2>
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-primary"></div> Present</span>
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-800"></div> Absent</span>
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-4">
            {weeklyData.map((data, i) => (
              <div key={data.day} className="flex flex-col items-center gap-3 flex-1">
                <div className="w-full h-[250px] bg-slate-800/50 rounded-t-lg relative group overflow-hidden border-b border-white/5">
                  {/* Absent Background is the container, Present is the filled bar */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${data.present}%` }}
                    transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-lg"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-10 border border-white/10">
                      {data.present}% Present
                    </div>
                  </motion.div>
                </div>
                <div className="text-sm font-medium text-slate-400">{data.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Feed Logs */}
        <div className="p-6 rounded-2xl bg-surface border border-white/5 h-[420px] flex flex-col shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              Live Detections
            </h2>
            <span className="text-xs text-slate-500 font-medium">Last 5 mins</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {recentScans.map((scan, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex items-start gap-4 p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  scan.status === 'success' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                }`}>
                  {scan.status === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium text-sm truncate text-white">{scan.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {scan.time}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-mono text-slate-400">{scan.id}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                      Match: {scan.accuracy}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
