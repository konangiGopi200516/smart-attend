import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Users, BarChart3, Shield, Activity, MonitorPlay, ArrowRight, Lock, User, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

const AnimatedStat = ({ end, suffix, decimals = 0 }: { end: number, suffix: string, decimals?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);

  return <span>{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
};

export default function LandingPage() {
  const [loginType, setLoginType] = useState<'admin' | 'faculty' | 'student' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = username.trim().toUpperCase();
    const pass = password.trim().toUpperCase();

    if (loginType === 'admin') {
      if (user !== 'KONANGI GOPI' || pass !== 'KONANGI GOPI') {
        alert("Invalid login: Admin credentials must be KONANGI GOPI.");
        return;
      }
    } else {
      // Strict requirement: Password must be exactly the same as the ID
      if (user !== pass) {
        alert(`Invalid login: Password must be exactly your ${loginType} ID.`);
        return;
      }
    }

    setIsLoggingIn(true);
    
    setTimeout(() => {
      const id = username.toUpperCase();
      const role = loginType || 'student';
      
      localStorage.setItem('smartattend_role', role);
      localStorage.setItem('smartattend_id', id);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-xl tracking-tight">SmartAttend</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-sm hidden md:block" onClick={() => setLoginType('faculty')}>Faculty Login</Button>
            <Button variant="ghost" className="text-sm hidden md:block" onClick={() => setLoginType('admin')}>Admin</Button>
            <Button size="sm" onClick={() => setLoginType('student')} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all">
              Student Portal
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6 border border-secondary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                Smart AI Version 2.0 is Live
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
                AI-Powered <br/> Face Recognition <br/> Attendance System
              </h1>
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                Automate attendance tracking with real-time facial recognition, advanced analytics, and seamless institution management. Experience the future of campus operations.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" onClick={() => setLoginType('student')} className="h-12 px-8 text-base bg-primary hover:bg-primary/90 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]">
                Student Portal <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setLoginType('faculty')} className="h-12 px-8 text-base border-slate-700 hover:bg-slate-800">
                <Users className="mr-2 w-4 h-4" /> Faculty Login
              </Button>
              <Button size="lg" variant="outline" onClick={() => setLoginType('admin')} className="h-12 px-8 text-base border-slate-700 hover:bg-slate-800">
                <Shield className="mr-2 w-4 h-4" /> Admin Login
              </Button>
            </div>
          </motion.div>

          {/* Hero Image / Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-[2.5rem] blur-3xl" />
            <div className="relative w-full aspect-square max-w-md rounded-[2rem] border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl p-4 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
              <div className="w-full h-full rounded-[1.5rem] bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden border border-white/5">
                {/* AI Scanning effect mock */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
                <motion.div 
                  animate={{ y: [-100, 100, -100] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute w-full h-1 bg-secondary/50 shadow-[0_0_20px_2px_rgba(6,182,212,0.5)] z-20"
                />
                <div className="relative z-10 w-48 h-48 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full border border-secondary/30 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-slate-500" />
                  </div>
                </div>
                <div className="mt-8 flex gap-3 z-10">
                  <div className="h-2 w-12 bg-success rounded-full" />
                  <div className="h-2 w-24 bg-slate-800 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
            {[
              { label: "Students", end: 3730, suffix: "", decimals: 0 },
              { label: "Recognition Accuracy", end: 99.4, suffix: "%", decimals: 1 },
              { label: "Departments", end: 4, suffix: "", decimals: 0 },
              { label: "Attendance Records", end: 150, suffix: "K+", decimals: 0 },
            ].map((stat, i) => (
              <div key={i} className="text-center px-4">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  <AnimatedStat end={stat.end} suffix={stat.suffix} decimals={stat.decimals} />
                </div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Enterprise-grade features</h2>
            <p className="text-slate-400">Everything you need to manage attendance at scale, built with cutting-edge AI and seamless user experience.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Camera />, title: "Face Recognition", desc: "Real-time AI recognition with high accuracy, capable of recognizing multiple faces simultaneously." },
              { icon: <Activity />, title: "Live Attendance", desc: "Instant attendance marking with zero latency. Seamless integration with dashboard real-time feeds." },
              { icon: <BarChart3 />, title: "Analytics", desc: "Advanced reporting and beautiful visualizations to track attendance trends and student performance." },
              { icon: <Users />, title: "Student Management", desc: "Complete profile management with bulk upload capabilities and detailed historical data." },
              { icon: <MonitorPlay />, title: "Multi-Camera Support", desc: "Scale up your classrooms with multi-camera inputs processing simultaneously on edge devices." },
              { icon: <Shield />, title: "Security", desc: "Encrypted face embeddings, anti-spoofing, and liveness detection ensure 100% genuine attendance." },
            ].map((feature, i) => (
              <div key={i} className="group relative p-8 rounded-2xl bg-slate-900/50 border border-white/5 hover:bg-slate-800/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-32 px-6 bg-slate-900/20 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-16">Seamless Workflow</h2>
          
          <div className="relative border-l border-white/10 ml-6 md:ml-0 md:border-l-0">
            {/* Horizontal line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2 z-0" />
            
            <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-4 relative z-10">
              {[
                { step: "1", title: "Student Registration" },
                { step: "2", title: "Face Enrollment" },
                { step: "3", title: "Live Recognition" },
                { step: "4", title: "Analytics Dashboard" },
              ].map((step, i) => (
                <div key={i} className="flex md:flex-col items-center gap-6 md:gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-white/10 flex items-center justify-center font-bold text-lg group-hover:border-primary group-hover:text-primary transition-colors z-10 shrink-0">
                    {step.step}
                  </div>
                  <div className="text-left md:text-center">
                    <div className="font-semibold text-white">{step.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            <span className="font-semibold tracking-tight">SmartAttend</span>
          </div>
          <p className="text-sm text-slate-500">© 2026 SmartAttend Inc. All rights reserved.</p>
        </div>
      </footer>
      <AnimatePresence>
        {loginType && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  {loginType === 'student' ? <User className="w-6 h-6" /> : 
                   loginType === 'faculty' ? <Users className="w-6 h-6" /> : 
                   <Shield className="w-6 h-6" />}
                </div>
                <h2 className="text-2xl font-bold capitalize">{loginType} Login</h2>
                <p className="text-sm text-slate-400 mt-2">Enter your {loginType} credentials to access the portal.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                    {loginType === 'student' ? 'Student Roll No' : loginType === 'faculty' ? 'Employee ID' : 'Admin Username'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={loginType === 'student' ? "e.g. 23CSE0001" : loginType === 'faculty' ? "e.g. EMP-CS01" : "e.g. KONANGI GOPI"}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-slate-950 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={isLoggingIn} className="w-full h-11 bg-primary hover:bg-primary/90">
                    {isLoggingIn ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Authenticating...</> : 'Sign In'}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => { setLoginType(null); setUsername(''); setPassword(''); }} className="w-full mt-2 h-11">
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
