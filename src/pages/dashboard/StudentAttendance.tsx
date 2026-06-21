import { BookOpen, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentAttendance() {
  const overallAttendance = 93;
  
  const subjects = [
    { name: 'Java Programming', code: 'CS301', attendance: 95, classesHeld: 40, classesAttended: 38 },
    { name: 'Python for Data Science', code: 'CS302', attendance: 90, classesHeld: 30, classesAttended: 27 },
    { name: 'Database Management Systems', code: 'CS303', attendance: 92, classesHeld: 38, classesAttended: 35 },
    { name: 'Web Development', code: 'CS304', attendance: 96, classesHeld: 25, classesAttended: 24 },
    { name: 'Operating Systems', code: 'CS305', attendance: 88, classesHeld: 32, classesAttended: 28 },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
        <p className="text-slate-400 mt-1">View your subject-wise attendance percentages and overall performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 p-6 rounded-2xl bg-surface border border-white/5 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-24 h-24 text-success" />
          </div>
          <div className="relative z-10">
            <div className="text-slate-400 font-semibold uppercase tracking-wider mb-2">Overall Attendance</div>
            <div className="text-6xl font-bold text-success mb-2">{overallAttendance}%</div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium border border-success/20">
              <CheckCircle2 className="w-4 h-4" /> Good Standing
            </div>
          </div>
        </div>

        <div className="md:col-span-2 p-6 rounded-2xl bg-surface border border-white/5 shadow-xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Subject-wise Breakdown
          </h2>
          <div className="space-y-5">
            {subjects.map((sub, i) => (
              <motion.div 
                key={sub.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <div className="font-semibold text-white">{sub.name} <span className="text-xs text-slate-500 font-mono ml-2">{sub.code}</span></div>
                    <div className="text-xs text-slate-400 mt-0.5">{sub.classesAttended} / {sub.classesHeld} Classes Attended</div>
                  </div>
                  <div className={`font-bold ${sub.attendance < 90 ? 'text-warning' : 'text-success'}`}>
                    {sub.attendance}%
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${sub.attendance}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full rounded-full ${sub.attendance < 90 ? 'bg-warning' : 'bg-success'}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
