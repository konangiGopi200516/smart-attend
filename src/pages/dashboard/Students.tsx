import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Filter, Plus, Search, MoreHorizontal, ChevronRight, Users, UserCheck, UserX, Building2, ArrowLeft, Layers, Camera, Scan, BarChart3, CheckCircle2, XCircle, Circle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { ref as dbRef, push, set } from 'firebase/database';
import { rtdb } from '../../lib/firebase';

export default function Students() {
  const [view, setView] = useState<'years' | 'departments' | 'sections' | 'students' | 'mark_attendance'>('years');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sectionStudents, setSectionStudents] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [sessionFaceId, setSessionFaceId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<{text: string, type: 'success'|'error'|'info'} | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [enrolledFaces, setEnrolledFaces] = useState<string[]>([]);
  const itemsPerPage = 15;

  const years = [
    { id: '1st Year', students: 960 },
    { id: '2nd Year', students: 940 },
    { id: '3rd Year', students: 920 },
    { id: '4th Year', students: 910 },
  ];

  const departments = [
    { id: 'CSE', name: 'Computer Science Engineering', students: 576, sections: 8, secSize: 72 },
    { id: 'ECE', name: 'Electronics & Communication', students: 192, sections: 3, secSize: 64 },
    { id: 'MECH', name: 'Mechanical Engineering', students: 96, sections: 2, secSize: 48 },
    { id: 'EEE', name: 'Electrical & Electronics', students: 96, sections: 2, secSize: 48 },
  ];

  // Helper to generate sections dynamically based on the department
  const getSectionsForDept = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    if (!dept) return [];
    const sectionLetters = 'ABCDEFGH'.split('');
    return Array.from({ length: dept.sections }).map((_, i) => ({
      id: `${deptId}-${sectionLetters[i]}`,
      students: dept.secSize,
      present: Math.floor(dept.secSize * (Math.random() * 0.15 + 0.85)), // 85-100% present
      attendance: Math.floor(Math.random() * 10) + 90, // 90-100%
    }));
  };

  const getStudentsForSection = (sectionId: string, size: number) => {
    // Determine admission year prefix based on the selected year
    let admissionYear = '26'; // Default 1st Year
    let yearIndex = 0;
    if (selectedYear === '2nd Year') { admissionYear = '25'; yearIndex = 1; }
    if (selectedYear === '3rd Year') { admissionYear = '24'; yearIndex = 2; }
    if (selectedYear === '4th Year') { admissionYear = '23'; yearIndex = 3; }

    // Determine department code and name
    const deptParts = sectionId.split('-'); // e.g. CSE-A
    const deptName = deptParts[0]; // CSE
    const sectionLetter = deptParts[1]; // A

    let deptCode = '01';
    let deptShort = 'CSE';
    let deptOffset = 0;
    if (deptName === 'ECE') { deptCode = '02'; deptShort = 'ECE'; deptOffset = 576; }
    if (deptName === 'MECH') { deptCode = '03'; deptShort = 'MEC'; deptOffset = 768; }
    if (deptName === 'EEE') { deptCode = '04'; deptShort = 'EEE'; deptOffset = 864; }

    // Calculate starting student number for this section
    const sectionIndex = sectionLetter.charCodeAt(0) - 65; // A=0, B=1, etc.
    const startNum = (sectionIndex * size) + 1;
    
    const firstNames = [
      'Aarav', 'Vihaan', 'Aditya', 'Ramesh', 'Suresh', 'Gopi', 'Priya', 'Anjali', 'Kavya', 'Neha',
      'Rahul', 'Vikram', 'Siddharth', 'Arjun', 'Rohan', 'Sneha', 'Pooja', 'Shruti', 'Divya', 'Swati',
      'John', 'Michael', 'David', 'Chris', 'Sarah', 'Jessica', 'Emily', 'Emma', 'Daniel', 'Matthew',
      'Karthik', 'Nitin', 'Abhishek', 'Varun', 'Tarun', 'Ananya', 'Riya', 'Isha', 'Megha', 'Tanya',
      'Harish', 'Gautam', 'Sanjay', 'Prakash', 'Amit', 'Sunil', 'Anil', 'Rajesh', 'Vikas', 'Deepak'
    ];
    const lastNames = [
      'Kumar', 'Singh', 'Sharma', 'Patel', 'Reddy', 'Rao', 'Yadav', 'Gupta', 'Verma', 'Choudhary',
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
      'Iyer', 'Nair', 'Menon', 'Pillai', 'Desai', 'Joshi', 'Kulkarni', 'Deshmukh', 'Patil', 'Jadhav'
    ];

    return Array.from({ length: size }).map((_, i) => {
      const studentNum = startNum + i;
      const internalId = `${admissionYear}0003${deptCode}${String(studentNum).padStart(4, '0')}`;
      const displayRoll = `${admissionYear}${deptShort}${String(studentNum).padStart(4, '0')}`;
      
      const nameCounter = (yearIndex * 960) + deptOffset + (sectionIndex * size) + i;
      const fn = firstNames[(nameCounter * 7) % firstNames.length];
      const ln = lastNames[(nameCounter * 11) % lastNames.length];

      return {
        id: internalId,
        displayRoll: displayRoll,
        name: `${fn} ${ln}`,
        attendance: Math.floor(Math.random() * 30) + 70,
        status: Math.random() > 0.85 ? 'Warning' : 'Active',
        scanStatus: 'pending' as 'pending' | 'present' | 'absent',
      };
    });
  };

  const currentSections = selectedDept ? getSectionsForDept(selectedDept) : [];

  useEffect(() => {
    if (selectedSection) {
      const size = currentSections.find(s => s.id === selectedSection)?.students || 72;
      setSectionStudents(getStudentsForSection(selectedSection, size));
    }
  }, [selectedSection, selectedYear, selectedDept]);

  useEffect(() => {
    if (view === 'mark_attendance') {
      // Fetch enrolled faces
      const fetchEnrolled = async () => {
        try {
          const snapshot = await dbRef(rtdb, 'student_face_enrollment');
          import('firebase/database').then(({ get }) => {
            get(snapshot).then(snap => {
              if (snap.exists()) {
                setEnrolledFaces(Object.keys(snap.val()));
              }
            });
          });
        } catch (e) {
          console.error(e);
        }
      };
      fetchEnrolled();

      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraActive(true);
        } catch (err) {
          console.error("Error accessing camera:", err);
          setCameraActive(false);
        }
      };
      startCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
    }
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [view]);

  const handleCapture = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanMessage(null);

    // Simulate backend processing delay and AI rules
    setTimeout(() => {
      // 15% chance the camera fails to extract a clear face encoding
      if (Math.random() > 0.85) {
         setScanMessage({ text: "Face Not Recognized. Please try again.", type: 'error' });
         setIsScanning(false);
         return;
      }

      // Identify the "person in front of the camera"
      // We no longer simulate random people. We strictly match against enrolled faces in this section.
      const pending = sectionStudents.filter(s => s.scanStatus === 'pending');
      const enrolledPending = pending.filter(s => enrolledFaces.includes(s.id));
      
      let faceId = sessionFaceId;
      
      if (!faceId || Math.random() > 0.75) {
        if (enrolledPending.length > 0) {
          // A registered student stepped in front of the camera!
          faceId = enrolledPending[0].id;
          setSessionFaceId(faceId);
        } else {
          // No registered faces left in this section. Reject the scan.
          setScanMessage({ text: "Unrecognized Face: Person is not enrolled in database.", type: 'error' });
          setIsScanning(false);
          setSessionFaceId(null);
          return;
        }
      }

      // Check the status of this matched faceId against section constraints
      const studentIndex = sectionStudents.findIndex(s => s.id === faceId);
      if (studentIndex !== -1) {
        if (sectionStudents[studentIndex].scanStatus === 'present') {
           setScanMessage({ text: `Attendance Already Marked for ${sectionStudents[studentIndex].name}`, type: 'error' });
        } else {
           const updated = [...sectionStudents];
           updated[studentIndex] = { ...updated[studentIndex], scanStatus: 'present' };
           setSectionStudents(updated);
           setScanMessage({ text: `Success: ${updated[studentIndex].name} Recognized`, type: 'success' });
        }
      }
      setIsScanning(false);
    }, 1500);
  };

  const handleFinalizeAttendance = async () => {
    if (!selectedSection) return;
    setIsFinalizing(true);
    try {
      const attendanceRef = dbRef(rtdb, 'posted_attendance');
      const newPostRef = push(attendanceRef);
      
      const presentStudents = sectionStudents.filter(s => s.scanStatus === 'present').map(s => ({
        id: s.id,
        name: s.name,
        displayRoll: s.displayRoll
      }));

      await set(newPostRef, {
        date: new Date().toISOString(),
        sectionId: selectedSection,
        totalStudents: sectionStudents.length,
        presentCount: presentStudents.length,
        absentCount: sectionStudents.length - presentStudents.length,
        presentStudents: presentStudents
      });

      alert("Attendance finalized and posted successfully!");
      goBack(); // Return to directory
    } catch (err) {
      console.error("Failed to finalize attendance:", err);
      alert("Error posting attendance.");
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleYearClick = (year: string) => {
    setSelectedYear(year);
    setView('departments');
  };

  const handleDeptClick = (dept: string) => {
    setSelectedDept(dept);
    setView('sections');
  };

  const handleSectionClick = (section: string) => {
    setSelectedSection(section);
    setCurrentPage(1);
    setSearchQuery('');
    setFilterStatus(null);
    setView('students');
  };

  const filteredStudents = sectionStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.displayRoll.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus ? student.status === filterStatus : true;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goBack = () => {
    if (view === 'mark_attendance') {
      setView('students');
      setSessionFaceId(null);
      setScanMessage(null);
      setIsScanning(false);
    } else if (view === 'students') {
      setView('sections');
      setSelectedSection(null);
    } else if (view === 'sections') {
      setView('departments');
      setSelectedDept(null);
    } else if (view === 'departments') {
      setView('years');
      setSelectedYear(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center flex-wrap gap-2 text-sm text-slate-400 mb-2">
            <span 
              className={`hover:text-white cursor-pointer transition-colors ${view === 'years' ? 'text-primary font-medium' : ''}`}
              onClick={() => { setView('years'); setSelectedYear(null); setSelectedDept(null); setSelectedSection(null); }}
            >
              Directory
            </span>
            {selectedYear && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span 
                  className={`hover:text-white cursor-pointer transition-colors ${view === 'departments' ? 'text-primary font-medium' : ''}`}
                  onClick={() => { setView('departments'); setSelectedDept(null); setSelectedSection(null); }}
                >
                  {selectedYear}
                </span>
              </>
            )}
            {selectedDept && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span 
                  className={`hover:text-white cursor-pointer transition-colors ${view === 'sections' ? 'text-primary font-medium' : ''}`}
                  onClick={() => { setView('sections'); setSelectedSection(null); }}
                >
                  {selectedDept}
                </span>
              </>
            )}
            {selectedSection && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-primary font-medium">{selectedSection}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {view !== 'years' && (
              <Button variant="ghost" size="icon" onClick={goBack} className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-white/10">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <h1 className="text-2xl font-bold tracking-tight">
              {view === 'years' ? 'Academic Explorer' : 
               view === 'departments' ? `${selectedYear} Departments` : 
               view === 'sections' ? `${selectedDept} Sections` : 
               `${selectedSection} Students`}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Link to="/dashboard/enrollment">
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" /> Add Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Statistics (Only show on Years view) */}
      <AnimatePresence mode="wait">
        {view === 'years' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { label: 'Total Students', value: '3,730', icon: Users, color: 'text-primary' },
              { label: 'Present Today', value: '3,357', icon: UserCheck, color: 'text-success' },
              { label: 'Absent Today', value: '373', icon: UserX, color: 'text-danger' },
              { label: 'Departments', value: '4', icon: Building2, color: 'text-secondary' },
            ].map((stat, i) => (
              <div key={i} className="bg-surface border border-white/5 rounded-2xl p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {/* YEARS VIEW */}
          {view === 'years' && (
            <motion.div 
              key="years"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {years.map((year) => (
                <div 
                  key={year.id} 
                  onClick={() => handleYearClick(year.id)}
                  className="group relative bg-surface border border-white/5 rounded-2xl p-6 cursor-pointer hover:bg-slate-800/50 hover:border-primary/50 transition-all overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{year.id}</h3>
                      <p className="text-slate-400 text-sm flex items-center gap-2">
                        <Users className="w-4 h-4" /> {year.students} Students Enrolled
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors">
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* DEPARTMENTS VIEW */}
          {view === 'departments' && (
            <motion.div 
              key="departments"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {departments.map((dept) => (
                <div 
                  key={dept.id}
                  onClick={() => handleDeptClick(dept.id)}
                  className="group bg-surface border border-white/5 rounded-2xl p-6 cursor-pointer hover:bg-slate-800/80 hover:border-secondary/50 transition-all relative overflow-hidden"
                >
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">{dept.id}</h3>
                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-white/5">
                          {dept.name}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center group-hover:bg-secondary group-hover:border-secondary transition-colors">
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Users className="w-4 h-4" />
                      <span className="font-semibold text-white">{dept.students}</span> Students
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Layers className="w-4 h-4" />
                      <span className="font-semibold text-white">{dept.sections}</span> Sections
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* SECTIONS VIEW */}
          {view === 'sections' && (
            <motion.div 
              key="sections"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {currentSections.map((section) => (
                <div 
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className="group bg-surface border border-white/5 rounded-2xl p-5 cursor-pointer hover:bg-slate-800/80 hover:border-primary/50 transition-all relative overflow-hidden"
                >
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{section.id}</h3>
                    <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">
                      {section.attendance}% Attd
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Total</span>
                      <span className="font-semibold text-white">{section.students}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Present</span>
                      <span className="font-semibold text-success">{section.present}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Absent</span>
                      <span className="font-semibold text-danger">{section.students - section.present}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 text-xs font-medium text-slate-400 flex items-center justify-center group-hover:text-white transition-colors">
                    View Students <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* STUDENTS VIEW (SECTION DASHBOARD) */}
          {view === 'students' && (
            <motion.div 
              key="students"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Section Dashboard Action Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" onClick={() => setView('mark_attendance')}>
                  <Camera className="w-4 h-4 mr-2" /> Mark Attendance
                </Button>
                <Button variant="outline" className="bg-surface border-white/10 hover:bg-slate-800">
                  <Scan className="w-4 h-4 mr-2" /> Start Camera
                </Button>
                <Button variant="outline" className="bg-surface border-white/10 hover:bg-slate-800">
                  <BarChart3 className="w-4 h-4 mr-2" /> View Analytics
                </Button>
                <Button variant="outline" className="bg-surface border-white/10 hover:bg-slate-800">
                  <Download className="w-4 h-4 mr-2" /> Export Report
                </Button>
              </div>

              <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/50">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search by name or roll number..." 
                    className="w-full bg-slate-950 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-slate-500"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select 
                      value={filterStatus || ''}
                      onChange={(e) => { setFilterStatus(e.target.value || null); setCurrentPage(1); }}
                      className="w-full sm:w-auto bg-slate-950 border border-white/10 rounded-lg pl-9 pr-8 py-2 text-sm outline-none focus:border-primary/50 transition-colors text-slate-300 appearance-none cursor-pointer"
                    >
                      <option value="">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Warning">Warning</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 font-medium w-16">S.No</th>
                      <th className="px-6 py-4 font-medium">Student Name</th>
                      <th className="px-6 py-4 font-medium">Roll No</th>
                      <th className="px-6 py-4 font-medium">Attendance %</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedStudents.map((student, index) => (
                      <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 text-slate-500 font-mono">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
                              <img src={`https://ui-avatars.com/api/?name=${student.name}&background=random`} alt={student.name} />
                            </div>
                            <div className="font-medium text-white">{student.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-mono text-white">{student.displayRoll}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5" title="Internal System ID">{student.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-full bg-slate-800 rounded-full h-1.5 max-w-[5rem] overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  student.attendance >= 85 ? 'bg-success' : 
                                  student.attendance >= 75 ? 'bg-warning' : 'bg-danger'
                                }`}
                                style={{ width: `${student.attendance}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium tabular-nums">{student.attendance}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                            student.status === 'Active' ? 'bg-success/10 text-success border-success/20' :
                            student.status === 'Warning' ? 'bg-warning/10 text-warning border-warning/20' :
                            'bg-danger/10 text-danger border-danger/20'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-white p-1.5 rounded-md hover:bg-slate-800 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-slate-400 bg-slate-900/30">
                <div>Showing {filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} students in {selectedSection}</div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="h-8">Previous</Button>
                  <Button variant="outline" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="h-8">Next</Button>
                </div>
              </div>
              </div>
            </motion.div>
          )}

          {/* MARK ATTENDANCE VIEW */}
          {view === 'mark_attendance' && (
            <motion.div 
              key="mark_attendance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="h-[calc(100vh-16rem)] flex flex-col gap-6"
            >
              <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
                {/* Camera Feed Area */}
                <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-white/10 overflow-hidden relative group shadow-2xl">
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full text-sm font-medium border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-danger animate-pulse" /> LIVE
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
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Scan className="w-24 h-24 text-primary/20 absolute" />
                        <p className="text-slate-500 relative z-10 font-medium">Scanning {selectedSection} Students...</p>
                        <p className="text-slate-600 relative z-10 text-xs mt-2">Connecting to webcam...</p>
                      </div>
                    )}
                    
                    {/* Simulated Bounding Box */}
                    {isScanning && (
                      <div className="absolute hidden group-hover:block w-48 h-48 border-2 border-primary rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="absolute -top-8 left-0 bg-primary text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-2">
                          <Loader2 className="w-3 h-3 animate-spin" /> Analyzing 128-d Vector...
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 w-full px-6">
                    <AnimatePresence>
                      {scanMessage && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-xl backdrop-blur-md border ${
                          scanMessage.type === 'success' ? 'bg-success/20 text-success border-success/30' :
                          scanMessage.type === 'error' ? 'bg-danger/20 text-danger border-danger/30' :
                          'bg-slate-800/80 text-white border-white/10'
                        }`}>
                          {scanMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : 
                           scanMessage.type === 'error' ? <AlertCircle className="w-4 h-4" /> : 
                           <Circle className="w-4 h-4" />}
                          {scanMessage.text}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Button 
                      onClick={handleCapture} 
                      disabled={isScanning}
                      className="bg-white text-black hover:bg-slate-200 shadow-lg px-8 rounded-full disabled:opacity-80 transition-all"
                    >
                      {isScanning ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scanning Face...</>
                      ) : (
                        "Capture & Match"
                      )}
                    </Button>
                  </div>
                </div>

                {/* Real-Time Tracker */}
                <div className="rounded-2xl bg-surface border border-white/5 flex flex-col overflow-hidden shadow-xl">
                  <div className="p-5 border-b border-white/5 bg-slate-900/50">
                    <h3 className="font-bold text-lg text-white mb-1">Attendance Tracker</h3>
                    <p className="text-xs text-slate-400">{selectedSection} • Total: {sectionStudents.length}</p>
                    
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                      <div className="bg-success/10 border border-success/20 rounded-lg p-2">
                        <div className="text-success font-bold text-xl">{sectionStudents.filter(s => s.scanStatus === 'present').length}</div>
                        <div className="text-[10px] text-success uppercase tracking-wider font-semibold">Present</div>
                      </div>
                      <div className="bg-slate-800/50 border border-white/10 rounded-lg p-2">
                        <div className="text-white font-bold text-xl">{sectionStudents.filter(s => s.scanStatus === 'pending').length}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Pending</div>
                      </div>
                      <div className="bg-danger/10 border border-danger/20 rounded-lg p-2">
                        <div className="text-danger font-bold text-xl">{sectionStudents.filter(s => s.scanStatus === 'absent').length}</div>
                        <div className="text-[10px] text-danger uppercase tracking-wider font-semibold">Absent</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-900/20">
                    {sectionStudents.map(student => (
                      <div key={student.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-white/5 hover:bg-slate-800/60 transition-colors">
                        {student.scanStatus === 'present' ? (
                          <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                        ) : student.scanStatus === 'absent' ? (
                          <XCircle className="w-5 h-5 text-danger shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-white truncate">{student.displayRoll}</div>
                          <div className="text-xs text-slate-400 truncate">{student.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-white/5 bg-slate-900/80">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      onClick={handleFinalizeAttendance}
                      disabled={isFinalizing}
                    >
                      {isFinalizing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Finalize Attendance"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
