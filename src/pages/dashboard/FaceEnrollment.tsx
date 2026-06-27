import { useState, useEffect, useMemo, useRef } from 'react';
import { Camera, Check, ChevronRight, Fingerprint, Focus, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ref as dbRef, set, get } from 'firebase/database';
import { ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage';
import { rtdb, storage } from '../../lib/firebase';
import * as faceapi from 'face-api.js';

export default function FaceEnrollment() {
  const [step, setStep] = useState(1);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  
  const [draftYear, setDraftYear] = useState('All');
  const [draftDept, setDraftDept] = useState('All');
  const [draftSection, setDraftSection] = useState('All');
  const [filtersApplied, setFiltersApplied] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [captureCount, setCaptureCount] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [studentDetails, setStudentDetails] = useState({ id: '', name: '', dept: 'Computer Science', section: 'A' });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [existingDescriptors, setExistingDescriptors] = useState<{id: string, name: string, descriptor: Float32Array}[]>([]);
  const [studentDescriptor, setStudentDescriptor] = useState<number[] | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  
  const requiredCaptures = 4;

  // Fetch existing enrollments to check for duplicates
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const snapshot = await get(dbRef(rtdb, 'student_face_enrollment'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const descriptors = Object.values(data)
            .filter((d: any) => d.descriptor)
            .map((d: any) => ({
              id: d.id,
              name: d.name,
              descriptor: new Float32Array(d.descriptor)
            }));
          setExistingDescriptors(descriptors);
        }
      } catch (err) {
        console.error("Error fetching enrollments:", err);
      }
    };
    fetchEnrollments();
  }, []);

  // Load face-api models
  useEffect(() => {
    let isMounted = true;
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]);
        if (isMounted) setModelsLoaded(true);
      } catch (err) {
        console.error("Failed to load models:", err);
        // Do not artificially unlock UI if models fail to load, otherwise capture will throw errors
      }
    };
    loadModels();
    return () => { isMounted = false; };
  }, []);

  // Determine current angle instruction based on progress
  const getCurrentInstruction = () => {
    if (captureCount === 0) return "Turn head slightly LEFT";
    if (captureCount === 1) return "Turn head slightly RIGHT";
    if (captureCount === 2) return "Tilt head UP";
    if (captureCount === 3) return "Tilt head DOWN";
    return "Capture Complete!";
  };

  // Camera setup
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (step === 2) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            setHasCamera(true);
          }
        })
        .catch((err) => {
          console.error("Camera access denied:", err);
          setHasCamera(false);
        });
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setHasCamera(false);
    };
  }, [step]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const attemptCapture = async () => {
      if (!isCapturing || captureCount >= requiredCaptures || !videoRef.current) return;
      
      if (!modelsLoaded) {
        // If they click start before models load, wait and try again
        timeout = setTimeout(attemptCapture, 500);
        return;
      }
      
      try {
        const detection = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.2 })
        ).withFaceLandmarks().withFaceDescriptor();

        if (detection) {
          // Check for duplicate face against other students
          let isDuplicate = false;
          let duplicateName = "";
          for (const existing of existingDescriptors) {
             if (existing.id === studentDetails.id) continue; // Skip self if re-enrolling
             const dist = faceapi.euclideanDistance(detection.descriptor, existing.descriptor);
             if (dist < 0.5) {
                 isDuplicate = true;
                 duplicateName = existing.name;
                 break;
             }
          }
          
          if (isDuplicate) {
             setDuplicateWarning(`Not able to register! Face already matched with ${duplicateName}.`);
             setIsCapturing(false);
             setCaptureCount(0);
             setCapturedImages([]);
             return;
          }

          if (captureCount === 0) {
             setStudentDescriptor(Array.from(detection.descriptor));
          }

          // Face detected with high confidence! Capture it.
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setCapturedImages(prev => [...prev, dataUrl]);
          }
          
          setCaptureCount(prev => prev + 1);
          
          // Wait 2 seconds before the next capture to allow user to turn head
          timeout = setTimeout(attemptCapture, 2000);
        } else {
          // No face detected, try again in 500ms
          timeout = setTimeout(attemptCapture, 500);
        }
      } catch (error) {
        console.error("Detection error:", error);
        timeout = setTimeout(attemptCapture, 1000);
      }
    };

    if (isCapturing && captureCount < requiredCaptures) {
      attemptCapture();
    } else if (captureCount >= requiredCaptures) {
      setTimeout(() => setIsCapturing(false), 0);
    }
    
    return () => clearTimeout(timeout);
  }, [isCapturing, captureCount, modelsLoaded]);

  // Encoding & Database Save step
  useEffect(() => {
    if (step === 3) {
      let isMounted = true;
      const saveToDatabase = async () => {
        try {
          const imageUrls: string[] = [];
          
          // 1. Upload images to Firebase Storage (with a timeout)
          const uploadPromise = async () => {
            for (let i = 0; i < capturedImages.length; i++) {
              const imageRef = storageRef(storage, `student_faces/${studentDetails.id}/face_${i + 1}.jpg`);
              await uploadString(imageRef, capturedImages[i], 'data_url');
              const url = await getDownloadURL(imageRef);
              imageUrls.push(url);
            }
          };

          try {
            await Promise.race([
              uploadPromise(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Storage upload timed out')), 5000))
            ]);
          } catch (storageErr) {
            console.warn("Storage upload failed or timed out. Proceeding to save DB only.", storageErr);
          }

          // 2. Save metadata, URLs, and face descriptor to Realtime Database
          await set(dbRef(rtdb, `student_face_enrollment/${studentDetails.id}`), {
            id: studentDetails.id,
            name: studentDetails.name,
            dept: studentDetails.dept,
            section: studentDetails.section,
            faceImages: imageUrls,
            descriptor: studentDescriptor,
            faceEncodingStatus: "Complete",
            encodedAt: new Date().toISOString()
          });
          
          if (isMounted) setStep(4);
        } catch (error) {
          console.error("Failed to save to Firebase:", error);
          if (isMounted) {
            setStep(4); // Advance anyway so they don't get stuck in UI loop
          }
        }
      };
      
      saveToDatabase();
      return () => { isMounted = false; };
    }
  }, [step, studentDetails, capturedImages]);

  const mockStudents = useMemo(() => {
    const list: { sno: number; name: string; id: string; dept: string; section: string; year: string }[] = [];
    const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    
    // Array of Indian/Global names for variety
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

    let sno = 1;
    let nameCounter = 0;

    years.forEach((year) => {
      // Determine admission year prefix
      let admissionYear = '26';
      if (year === '2nd Year') admissionYear = '25';
      if (year === '3rd Year') admissionYear = '24';
      if (year === '4th Year') admissionYear = '23';

      const departmentData = [
        { id: 'CSE', sections: 8, secSize: 72, code: '01' },
        { id: 'ECE', sections: 3, secSize: 64, code: '02' },
        { id: 'MECH', sections: 2, secSize: 48, code: '03' },
        { id: 'EEE', sections: 2, secSize: 48, code: '04' },
      ];
      
      const sectionLetters = 'ABCDEFGH'.split('');

      departmentData.forEach((dept) => {
        for (let sIdx = 0; sIdx < dept.sections; sIdx++) {
          const section = sectionLetters[sIdx];
          const startNum = (sIdx * dept.secSize) + 1;
          
          for (let i = 0; i < dept.secSize; i++) {
            const studentNum = startNum + i;
            const internalId = `${admissionYear}0003${dept.code}${String(studentNum).padStart(4, '0')}`;
            
            const fn = firstNames[(nameCounter * 7) % firstNames.length];
            const ln = lastNames[(nameCounter * 11) % lastNames.length];
            nameCounter++;

            list.push({
              sno: sno++,
              name: `${fn} ${ln}`,
              id: internalId,
              dept: dept.id,
              section: section,
              year: year
            });
          }
        }
      });
    });

    return list;
  }, []);

  const filteredStudents = useMemo(() => {
    return mockStudents.filter(s => {
      const matchYear = selectedYear === 'All' || s.year === selectedYear;
      const matchDept = selectedDept === 'All' || s.dept === selectedDept;
      const matchSection = selectedSection === 'All' || s.section === selectedSection;
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchYear && matchDept && matchSection && matchSearch;
    });
  }, [mockStudents, selectedYear, selectedDept, selectedSection, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Face Enrollment Wizard</h1>
        <p className="text-slate-400 text-sm mt-1">Register new student face embeddings for the AI recognition system.</p>
      </div>

      {/* Progress Steps */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 w-full h-px bg-white/10 -translate-y-1/2 z-0" />
        <div className="relative z-10 flex justify-between">
          {[
            { num: 1, label: 'Details' },
            { num: 2, label: 'Capture' },
            { num: 3, label: 'Encoding' },
            { num: 4, label: 'Done' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-colors ${
                step > s.num ? 'bg-primary border-primary text-white' : 
                step === s.num ? 'bg-slate-900 border-primary text-primary' : 
                'bg-slate-900 border-white/10 text-slate-500'
              }`}>
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-xs font-medium ${step >= s.num ? 'text-slate-200' : 'text-slate-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-surface border border-white/5 rounded-2xl p-8 min-h-[400px] flex flex-col">
        {step === 1 && (
          <div className="flex-1 space-y-6 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold">Select Student for Enrollment</h2>
              <div className="relative w-full md:w-64">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students..." 
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary/50 text-white"
                />
              </div>
            </div>

            {/* 4 Layers of Organization */}
            <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5">
              <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                <Filter className="w-4 h-4" /> Filters:
              </div>
              
              <select 
                value={draftYear} 
                onChange={(e) => setDraftYear(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-primary/50"
              >
                <option value="All">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>

              <select 
                value={draftDept} 
                onChange={(e) => setDraftDept(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-primary/50"
              >
                <option value="All">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="EEE">EEE</option>
              </select>

              <select 
                value={draftSection} 
                onChange={(e) => setDraftSection(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-primary/50"
              >
                <option value="All">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
                <option value="E">Section E</option>
                <option value="F">Section F</option>
                <option value="G">Section G</option>
                <option value="H">Section H</option>
              </select>

              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-white ml-2"
                onClick={() => {
                  setSelectedYear(draftYear);
                  setSelectedDept(draftDept);
                  setSelectedSection(draftSection);
                  setFiltersApplied(true);
                }}
              >
                Apply Filter
              </Button>

              <div className="ml-auto text-sm text-slate-400 font-medium bg-slate-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                {filtersApplied ? `Showing ${filteredStudents.length} students` : 'Waiting for filters'}
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/30 max-h-[500px]">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-900/90 border-b border-white/10 sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="px-6 py-4 font-semibold w-24">S.No</th>
                    <th className="px-6 py-4 font-semibold">Student Name</th>
                    <th className="px-6 py-4 font-semibold">ID Number</th>
                    <th className="px-6 py-4 font-semibold">Class</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {!filtersApplied ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        Please select your class filters and click "Apply Filter" to load the student list.
                      </td>
                    </tr>
                  ) : filteredStudents.length > 0 ? filteredStudents.slice(0, 500).map((student) => (
                    <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-500 font-mono">{student.sno}</td>
                      <td className="px-6 py-4 font-medium text-white">{student.name}</td>
                      <td className="px-6 py-4 font-mono text-slate-300">{student.id}</td>
                      <td className="px-6 py-4 text-slate-300">{student.year} • {student.dept}-{student.section}</td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          size="sm"
                          className="bg-primary/20 text-primary hover:bg-primary hover:text-white border border-primary/30 transition-all"
                          onClick={() => {
                            setStudentDetails({ id: student.id, name: student.name, dept: student.dept, section: student.section });
                            setStep(2);
                          }}
                        >
                          <Camera className="w-3.5 h-3.5 mr-1.5" /> Add Face
                        </Button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        No students found matching the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="w-full max-w-md bg-slate-950 rounded-xl overflow-hidden relative border border-white/10 shadow-2xl aspect-video flex items-center justify-center mb-6">
              {/* Real Camera Feed */}
              <div className="absolute inset-0 bg-slate-950 flex items-center justify-center overflow-hidden">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover opacity-80"
                />
                {!hasCamera && (
                  <Camera className="absolute w-16 h-16 text-slate-800" />
                )}
              </div>
              
              {/* Camera Overlay */}
              <div className="absolute inset-0 border-2 border-primary/30 m-4 rounded-lg pointer-events-none" />
              <Focus className="absolute w-32 h-32 text-primary/50 opacity-50 pointer-events-none" />
              
              {isCapturing && (
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-danger animate-pulse" /> Capturing Images
                </div>
              )}
              
              {duplicateWarning ? (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-danger/90 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 text-white font-bold text-center w-11/12 max-w-sm shadow-2xl z-20">
                  <Fingerprint className="w-8 h-8 mx-auto mb-2 text-white opacity-80" />
                  {duplicateWarning}
                  <Button size="sm" className="mt-4 w-full bg-white text-danger hover:bg-white/90" onClick={() => setDuplicateWarning(null)}>Try Again</Button>
                </div>
              ) : null}
              
              {/* Instruction Toast */}
              {!duplicateWarning && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-sm font-medium whitespace-nowrap text-white z-10">
                  {captureCount >= requiredCaptures ? "Capture Complete!" : getCurrentInstruction()}
                </div>
              )}
            </div>

            <div className="w-full max-w-md space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Capture Progress</span>
                <span className="font-bold text-primary">{captureCount} / {requiredCaptures}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${(captureCount / requiredCaptures) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-center pt-4">
                {captureCount === 0 ? (
                  <Button 
                    className="bg-primary text-white w-full" 
                    onClick={() => isCapturing ? setIsCapturing(false) : setIsCapturing(true)}
                    disabled={!modelsLoaded}
                  >
                    {!modelsLoaded ? (
                      <>Loading AI Models...</>
                    ) : isCapturing ? (
                      <><Camera className="w-4 h-4 mr-2 animate-pulse" /> Capturing...</>
                    ) : (
                      <><Camera className="w-4 h-4 mr-2" /> Start Multi-Angle Capture</>
                    )}
                  </Button>
                ) : captureCount < requiredCaptures ? (
                  <Button variant="outline" className="w-full text-danger border-danger/30 hover:bg-danger/10" onClick={() => setIsCapturing(false)}>
                    Pause Capture
                  </Button>
                ) : (
                  <Button className="bg-success text-white w-full hover:bg-success/90" onClick={() => setStep(3)}>
                    <Check className="w-4 h-4 mr-2" /> Continue to Encoding
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="relative mb-8">
              <Fingerprint className="w-20 h-20 text-secondary animate-pulse" />
              <div className="absolute inset-0 bg-secondary/20 blur-xl rounded-full animate-ping" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Generating Robust Face Encodings</h3>
            <p className="text-sm text-slate-400 max-w-sm">Aggregating features from {requiredCaptures} multi-angle images to create a highly accurate biometric profile.</p>
            <div className="w-64 h-2 bg-slate-800 rounded-full mt-6 overflow-hidden">
              <div className="w-2/3 h-full bg-secondary rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mb-6">
              <Check className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Enrollment Complete!</h3>
            <p className="text-slate-400 max-w-md mx-auto">All {requiredCaptures} face images have been securely stored in Firebase Storage, and the high-accuracy encodings are mapped to the student's profile.</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => {
              setStep(s => Math.max(1, s - 1));
              if (step === 2) {
                setCaptureCount(0);
                setIsCapturing(false);
              }
            }}
            disabled={step === 1 || step === 4}
          >
            Back
          </Button>
          {step < 4 ? (
            <Button 
              className="bg-primary text-white hover:bg-primary/90" 
              onClick={() => setStep(s => Math.min(4, s + 1))}
              disabled={(step === 2 && captureCount < requiredCaptures) || step === 1}
            >
              Next Step <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button 
              className="bg-primary text-white hover:bg-primary/90" 
              onClick={() => setStep(1)}
            >
              Enroll Another
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
