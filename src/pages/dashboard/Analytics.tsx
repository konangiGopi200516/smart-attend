import { BarChart as BarChartIcon, TrendingUp, Users, Target, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Analytics() {
  const departmentData = [
    { dept: 'CSE', attendance: 94 },
    { dept: 'ECE', attendance: 88 },
    { dept: 'MECH', attendance: 82 },
    { dept: 'EEE', attendance: 86 },
    { dept: 'CIVIL', attendance: 78 },
  ];

  const monthlyTrends = [
    { month: 'Jan', value: 85 },
    { month: 'Feb', value: 88 },
    { month: 'Mar', value: 86 },
    { month: 'Apr', value: 92 },
    { month: 'May', value: 95 },
    { month: 'Jun', value: 94 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Analytics</h1>
        <p className="text-slate-400 mt-1">Deep insights into university-wide attendance and facial recognition performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Avg Attendance', value: '88.5%', icon: Activity, color: 'text-primary' },
          { label: 'Highest Dept (CSE)', value: '94.0%', icon: TrendingUp, color: 'text-success' },
          { label: 'Total Scans', value: '1.2M', icon: Users, color: 'text-secondary' },
          { label: 'AI Accuracy', value: '99.8%', icon: Target, color: 'text-white' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-surface border border-white/5 shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Department Comparison */}
        <div className="p-6 rounded-2xl bg-surface border border-white/5 shadow-xl h-[400px] flex flex-col">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <BarChartIcon className="w-5 h-5 text-primary" /> Department Comparison
          </h2>
          <div className="flex-1 flex flex-col justify-end gap-4 relative">
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-t border-dashed border-white/20 w-full"></div>
              <div className="border-t border-dashed border-white/20 w-full"></div>
              <div className="border-t border-dashed border-white/20 w-full"></div>
              <div className="border-t border-dashed border-white/20 w-full"></div>
            </div>
            <div className="flex justify-around items-end h-[250px] z-10">
              {departmentData.map((data, i) => (
                <div key={data.dept} className="flex flex-col items-center gap-3 w-12">
                  <div className="w-full h-[200px] flex items-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${data.attendance}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`w-full rounded-t-sm relative group ${data.attendance > 90 ? 'bg-success' : data.attendance > 85 ? 'bg-primary' : 'bg-warning'}`}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.attendance}%
                      </div>
                    </motion.div>
                  </div>
                  <div className="text-xs font-medium text-slate-400">{data.dept}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6-Month Trend */}
        <div className="p-6 rounded-2xl bg-surface border border-white/5 shadow-xl h-[400px] flex flex-col">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary" /> 6-Month Trend
          </h2>
          <div className="flex-1 flex flex-col justify-end gap-4 relative">
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-t border-dashed border-white/20 w-full"></div>
              <div className="border-t border-dashed border-white/20 w-full"></div>
              <div className="border-t border-dashed border-white/20 w-full"></div>
              <div className="border-t border-dashed border-white/20 w-full"></div>
            </div>
            <div className="flex justify-around items-end h-[250px] z-10">
              {monthlyTrends.map((data, i) => (
                <div key={data.month} className="flex flex-col items-center gap-3 w-12">
                  <div className="w-full h-[200px] flex items-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${data.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="w-full rounded-t-sm bg-gradient-to-t from-secondary/50 to-secondary relative group"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.value}%
                      </div>
                    </motion.div>
                  </div>
                  <div className="text-xs font-medium text-slate-400">{data.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
