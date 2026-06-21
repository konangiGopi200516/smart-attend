import { useState, useEffect, useRef } from 'react';
import { Camera, Scan, Maximize2, AlertCircle, CheckCircle2, UserCheck, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ref, get } from 'firebase/database';
import { rtdb } from '../../lib/firebase';

export default function LiveAttendance() {
  const [logs, setLogs] = useState([
    { name: 'Emma Wilson', id: '2300031212', time: '09:39:05 AM', status: 'Present', message: 'Attendance Marked', conf: '97.8%' }
  ]);
  const [isScanning, setIsScanning] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<{name: string, conf: string, status: string} | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Fetch enrolled students from DB
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const snapshot = await get(ref(rtdb, 'student_face_enrollment'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const studentsList = Object.values(data);
          setEnrolledStudents(studentsList);
        }
      } catch (err) {
        console.error("Error fetching enrolled students:", err);
      }
    };
    fetchStudents();
  }, []);

  // Start Camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } catch (err) {
        console.error("Camera error:", err);
      }
    };
    startCamera();
    
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  // Simulate Continuous Scanning
  useEffect(() => {
    if (!isScanning || !cameraActive) return;
    
    const interval = setInterval(() => {
      const rand = Math.random();
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      let newLog;
      if (rand > 0.8 || enrolledStudents.length === 0) {
        // Unknown Person
        newLog = { name: 'Unknown Person', id: '--', time, status: 'Unknown', message: 'Attendance Not Marked', conf: '45.1%' };
        setCurrentMatch({ name: 'Unknown Person', conf: '45.1%', status: 'error' });
      } else if (rand > 0.6) {
        // Already Recorded (Pick random enrolled)
        const student = enrolledStudents[Math.floor(Math.random() * enrolledStudents.length)];
        newLog = { name: student.name, id: student.id, time, status: 'Already Marked', message: 'Attendance Already Recorded', conf: '99.5%' };
        setCurrentMatch({ name: student.name, conf: '99.5%', status: 'warning' });
      } else {
        // Match Found -> Present (Pick random enrolled)
        const student = enrolledStudents[Math.floor(Math.random() * enrolledStudents.length)];
        newLog = { name: student.name, id: student.id, time, status: 'Present', message: 'Attendance Marked', conf: `${(95 + Math.random() * 4).toFixed(1)}%` };
        setCurrentMatch({ name: student.name, conf: newLog.conf, status: 'success' });
      }

      setLogs(prev => [newLog, ...prev].slice(0, 50));
      
      // Clear bounding box after 2s
      setTimeout(() => setCurrentMatch(null), 2000);
      
    }, 4000);

    return () => clearInterval(interval);
  }, [isScanning, cameraActive]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live Recognition</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time attendance marking via camera feed.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Camera className="w-4 h-4 mr-2" /> Switch Camera
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white" size="sm">
            <Maximize2 className="w-4 h-4 mr-2" /> Fullscreen
          </Button>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        {/* Camera Feed Area */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-white/10 overflow-hidden relative group">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full text-sm font-medium border border-white/10">
            <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            LIVE
          </div>
          
          <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full text-sm font-medium border border-white/10 text-success">
            98.5% Accuracy
          </div>

          <div className="w-full h-full flex flex-col items-center justify-center relative bg-black">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
            />
            {!cameraActive && (
              <>
                <Scan className="w-24 h-24 text-primary/20 absolute" />
                <p className="text-slate-500 relative z-10 font-medium">Connecting to Camera Stream...</p>
              </>
            )}
            
            {/* Dynamic Bounding Box */}
            {currentMatch && cameraActive && (
              <div className={`absolute w-56 h-56 border-2 rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                currentMatch.status === 'success' ? 'border-success' : 
                currentMatch.status === 'warning' ? 'border-warning' : 'border-danger'
              }`}>
                <div className={`absolute -top-8 left-0 text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-2 ${
                  currentMatch.status === 'success' ? 'bg-success' : 
                  currentMatch.status === 'warning' ? 'bg-warning' : 'bg-danger'
                }`}>
                  {currentMatch.name} - {currentMatch.conf}
                </div>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-4">
             <Button 
               onClick={() => setIsScanning(!isScanning)} 
               className={isScanning ? "bg-danger text-white hover:bg-danger/90" : "bg-success text-white hover:bg-success/90"}
             >
               {isScanning ? "Stop Scanning" : "Start Live Recognition"}
             </Button>
          </div>
        </div>

        {/* Live Logs */}
        <div className="rounded-2xl bg-surface border border-white/5 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-semibold">Recognition Logs</h3>
            <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-300">Today</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {logs.map((log, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                i === 0 ? 'bg-slate-800/80 border-white/20 shadow-lg scale-[1.02]' : 'bg-slate-800/40 border-white/5'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${log.name}&background=random`} alt={log.name} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{log.name}</div>
                    <div className="text-xs text-slate-400">{log.id} • {log.time}</div>
                  </div>
                </div>
                {log.status === 'Present' ? (
                  <div className="text-right">
                    <div className="text-xs text-success font-bold flex items-center gap-1 justify-end"><CheckCircle2 className="w-3 h-3" /> {log.status}</div>
                    <div className="text-[10px] text-slate-400">{log.message}</div>
                  </div>
                ) : log.status === 'Already Marked' ? (
                  <div className="text-right">
                    <div className="text-xs text-warning font-bold flex items-center gap-1 justify-end"><UserCheck className="w-3 h-3" /> {log.status}</div>
                    <div className="text-[10px] text-slate-400">{log.message}</div>
                  </div>
                ) : (
                  <div className="text-right">
                     <div className="text-xs text-danger font-bold flex items-center gap-1 justify-end"><AlertCircle className="w-3 h-3" /> {log.status}</div>
                     <div className="text-[10px] text-slate-400">{log.message}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
