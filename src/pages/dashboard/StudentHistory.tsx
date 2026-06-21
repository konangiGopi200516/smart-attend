import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentHistory() {
  const historyLog = [
    { date: 'Today, 21 Jun', time: '09:05 AM', status: 'Present', subject: 'Java Programming' },
    { date: 'Yesterday, 20 Jun', time: '09:12 AM', status: 'Present', subject: 'Operating Systems' },
    { date: 'Wed, 19 Jun', time: '09:02 AM', status: 'Present', subject: 'Web Development' },
    { date: 'Tue, 18 Jun', time: '-', status: 'Absent', subject: 'Database Management' },
    { date: 'Mon, 17 Jun', time: '09:15 AM', status: 'Present', subject: 'Python for Data Science' },
    { date: 'Fri, 14 Jun', time: '09:08 AM', status: 'Present', subject: 'Java Programming' },
    { date: 'Thu, 13 Jun', time: '09:22 AM', status: 'Present', subject: 'Operating Systems' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance History</h1>
          <p className="text-slate-400 mt-1">A detailed log of your daily AI facial scans.</p>
        </div>
      </div>

      <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Recent Logs</h3>
        </div>
        
        <div className="divide-y divide-white/5">
          {historyLog.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  log.status === 'Present' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                }`}>
                  {log.status === 'Present' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-semibold text-white">{log.date}</div>
                  <div className="text-sm text-slate-400 mt-0.5">{log.subject}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-bold ${log.status === 'Present' ? 'text-success' : 'text-danger'}`}>
                  {log.status}
                </div>
                {log.status === 'Present' && (
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" /> Scanned at {log.time}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
