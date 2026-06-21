import { User, Phone, MapPin, GraduationCap, School, BookOpen, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function MyProfile() {
  const studentId = localStorage.getItem('smartattend_id') || '23CSE0001';

  const generateStudentData = (id: string) => {
    const lastDigit = parseInt(id.slice(-1)) || 0;
    
    const names = [
      'Ravi Kumar', 'Priya Sharma', 'Rahul Verma', 'Anjali Desai', 'Karthik Reddy',
      'Sneha Patel', 'Amit Singh', 'Pooja Gupta', 'Suresh Rao', 'Divya Menon'
    ];
    
    const villages = [
      'Ramachandrapuram', 'Amalapuram', 'Kakinada', 'Rajahmundry', 'Mandapeta',
      'Tuni', 'Samalkot', 'Pithapuram', 'Peddapuram', 'Gollaprolu'
    ];
    
    // Parse the department from the ID if possible (e.g., 23CSE0001 -> CSE)
    let dept = 'Computer Science Engineering (CSE)';
    let shortDept = 'CSE';
    if (id.includes('ECE')) { dept = 'Electronics & Communication (ECE)'; shortDept = 'ECE'; }
    else if (id.includes('MEC')) { dept = 'Mechanical Engineering (MECH)'; shortDept = 'MECH'; }
    else if (id.includes('EEE')) { dept = 'Electrical & Electronics (EEE)'; shortDept = 'EEE'; }

    // Parse Year from ID Prefix (e.g., 26 -> 1st Year, 25 -> 2nd Year, 24 -> 3rd Year, <=23 -> 4th Year)
    const yearPrefix = parseInt(id.slice(0, 2)) || 23;
    let studentYear = '4th Year';
    if (yearPrefix === 26) studentYear = '1st Year';
    else if (yearPrefix === 25) studentYear = '2nd Year';
    else if (yearPrefix === 24) studentYear = '3rd Year';
    else if (yearPrefix <= 23) studentYear = '4th Year';

    // Map the ID number exactly to a consistent profile (1 -> index 0, 2 -> index 1)
    // We already have lastDigit declared at the top of the function.
    const nameIndex = lastDigit === 0 ? 9 : lastDigit - 1;

    return {
      id: id,
      name: names[nameIndex % names.length],
      email: `${id.toLowerCase()}@smartattend.edu.in`,
      phone: `+91 98765 4321${nameIndex}`,
      village: villages[nameIndex % villages.length],
      district: 'East Godavari',
      state: 'Andhra Pradesh',
      pincode: `53325${nameIndex}`,
      interCollege: nameIndex % 2 === 0 ? 'Narayana Junior College' : 'Sri Chaitanya College',
      interPercentage: `${(92 + (nameIndex * 0.5)).toFixed(1)}%`,
      schoolName: nameIndex % 2 === 0 ? 'Z.P. High School' : 'Bhashyam Public School',
      schoolPercentage: `${(9.2 + (nameIndex * 0.05)).toFixed(1)} GPA`,
      department: dept,
      section: `${shortDept}-A`,
      year: studentYear,
      bloodGroup: ['O+', 'A+', 'B+', 'AB+', 'O-'][lastDigit % 5],
      dob: `${10 + lastDigit} Aug 2005`
    };
  };

  const studentInfo = generateStudentData(studentId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-slate-400 mt-1">View and manage your personal and academic information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: ID Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface border border-white/5 rounded-2xl p-6 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/20 to-transparent" />
            
            <div className="relative z-10">
              <div className="w-32 h-32 mx-auto rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden mb-4 shadow-lg">
                <img src={`https://ui-avatars.com/api/?name=${studentInfo.name}&size=128&background=2563eb&color=fff`} alt={studentInfo.name} />
              </div>
              <h2 className="text-2xl font-bold text-white">{studentInfo.name}</h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <ShieldCheck className="w-4 h-4" />
                {studentInfo.id}
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/5 space-y-3 text-left">
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Mail className="w-4 h-4 text-slate-500" />
                  {studentInfo.email}
                </div>
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Phone className="w-4 h-4 text-slate-500" />
                  {studentInfo.phone}
                </div>
              </div>
            </div>
          </div>
          
          <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">
            Request Information Update
          </Button>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Academic Profile */}
          <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Current Academics</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Department</label>
                <div className="mt-1 font-medium">{studentInfo.department}</div>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Year & Section</label>
                <div className="mt-1 font-medium">{studentInfo.year} • {studentInfo.section}</div>
              </div>
            </div>
          </div>

          {/* Education History */}
          <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Education History</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <School className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Intermediate (10+2)</h4>
                  <p className="text-sm text-slate-400 mt-1">{studentInfo.interCollege}</p>
                  <div className="mt-2 inline-block px-2 py-1 rounded bg-success/10 text-success text-xs font-bold border border-success/20">
                    Score: {studentInfo.interPercentage}
                  </div>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10 ml-5 -my-4" />
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <School className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Secondary School (10th)</h4>
                  <p className="text-sm text-slate-400 mt-1">{studentInfo.schoolName}</p>
                  <div className="mt-2 inline-block px-2 py-1 rounded bg-success/10 text-success text-xs font-bold border border-success/20">
                    Score: {studentInfo.schoolPercentage}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Personal Details</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Date of Birth</label>
                <div className="mt-1 font-medium">{studentInfo.dob}</div>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Blood Group</label>
                <div className="mt-1 font-medium text-danger">{studentInfo.bloodGroup}</div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Address
                </label>
                <div className="mt-2 p-3 rounded-lg bg-slate-900/50 border border-white/5 text-sm text-slate-300 leading-relaxed">
                  {studentInfo.village},<br />
                  {studentInfo.district} District,<br />
                  {studentInfo.state} - {studentInfo.pincode}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
