import { useState } from 'react';
import { Building2, Users, BookOpen, Search, Plus, MoreHorizontal, ChevronRight, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDepartments() {
  const [view, setView] = useState<'departments' | 'employees'>('departments');
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customFaculty, setCustomFaculty] = useState<Record<string, {id: string, name: string, role: string, subjects: string[]}[]>>({});
  const [newFaculty, setNewFaculty] = useState({ name: '', role: '', subjects: '' });


  const departments = [
    { id: 'CSE', name: 'Computer Science Engineering', head: 'Dr. Alan Turing', employees: 24, subjects: 42 },
    { id: 'ECE', name: 'Electronics & Communication', head: 'Dr. Claude Shannon', employees: 18, subjects: 28 },
    { id: 'MECH', name: 'Mechanical Engineering', head: 'Dr. Rudolf Diesel', employees: 12, subjects: 20 },
    { id: 'EEE', name: 'Electrical & Electronics', head: 'Dr. Nikola Tesla', employees: 14, subjects: 22 },
  ];

  // Mock faculty data generator
  const getFacultyForDept = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    if (!dept) return [];

    const names = [
      'Alan Turing', 'Grace Hopper', 'Tim Berners-Lee', 'Linus Torvalds', 
      'Claude Shannon', 'Hedy Lamarr', 'Rudolf Diesel', 'Nikola Tesla', 
      'Thomas Edison', 'Marie Curie', 'Albert Einstein', 'Isaac Newton', 
      'Ada Lovelace', 'Margaret Hamilton', 'John von Neumann', 'Richard Feynman',
      'Stephen Hawking', 'Charles Babbage', 'Katherine Johnson', 'Rosalind Franklin'
    ];
    
    const roles = ['Senior Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];
    
    const subjectPool: Record<string, string[]> = {
      'CSE': ['Data Structures', 'Algorithms', 'AI', 'Machine Learning', 'Cloud Computing', 'Cyber Security', 'Computer Networks', 'Database Systems', 'Software Engineering', 'Web Technologies', 'Operating Systems', 'Compiler Design'],
      'ECE': ['Digital Logic', 'Signals & Systems', 'Wireless Communications', 'VLSI Design', 'Microprocessors', 'Control Systems', 'Antenna Theory', 'Digital Signal Processing'],
      'MECH': ['Thermodynamics', 'Fluid Mechanics', 'Manufacturing', 'Automobile Eng', 'Robotics', 'Heat Transfer', 'Machine Design', 'Engineering Mechanics'],
      'EEE': ['Power Systems', 'AC/DC Machines', 'Circuit Theory', 'Basic Electronics', 'Power Electronics', 'Control Systems', 'High Voltage Engineering']
    };

    const deptSubjects = subjectPool[deptId] || subjectPool['CSE'];

    return Array.from({ length: dept.employees }).map((_, i) => {
      // Pick 2-3 random subjects from the department's specific pool
      const shuffledSubjects = [...deptSubjects].sort(() => 0.5 - Math.random());
      const assignedSubjects = shuffledSubjects.slice(0, Math.floor(Math.random() * 2) + 2);
      
      const randomName = names[(i + deptId.length) % names.length];
      const title = i % 3 === 0 ? 'Prof.' : 'Dr.';

      return {
        id: `EMP-${deptId}${String(i + 1).padStart(3, '0')}`,
        name: i === 0 ? dept.head : `${title} ${randomName}`,
        role: i === 0 ? 'Head of Department' : roles[Math.floor(Math.random() * roles.length)],
        subjects: assignedSubjects
      };
    });
  };

  const currentFaculty = selectedDept 
    ? [...getFacultyForDept(selectedDept), ...(customFaculty[selectedDept] || [])] 
    : [];

  const handleAddFaculty = () => {
    if (!selectedDept || !newFaculty.name || !newFaculty.role) return;
    
    const newEmp = {
      id: `EMP-${selectedDept}${String(currentFaculty.length + 1).padStart(3, '0')}`,
      name: newFaculty.name,
      role: newFaculty.role,
      subjects: newFaculty.subjects.split(',').map(s => s.trim()).filter(Boolean)
    };

    setCustomFaculty(prev => ({
      ...prev,
      [selectedDept]: [...(prev[selectedDept] || []), newEmp]
    }));

    setNewFaculty({ name: '', role: '', subjects: '' });
    setShowAddModal(false);
  };

  const handleDeptClick = (dept: string) => {
    setSelectedDept(dept);
    setView('employees');
  };

  const goBack = () => {
    setView('departments');
    setSelectedDept(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <span className="cursor-pointer hover:text-white transition-colors" onClick={() => view === 'employees' && goBack()}>Departments</span>
            {view === 'employees' && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-primary font-medium">{selectedDept}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {view === 'departments' ? 'Administration' : `${selectedDept} Faculty`}
          </h1>
          <p className="text-slate-400 mt-1">
            {view === 'departments' 
              ? 'Manage university departments, faculty members, and academic subjects.'
              : `Manage employees and subject assignments for ${departments.find(d => d.id === selectedDept)?.name}.`}
          </p>
        </div>
        <div className="flex gap-3">
          {view === 'employees' && (
            <Button 
              className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Faculty
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* DEPARTMENTS VIEW */}
        {view === 'departments' && (
          <motion.div 
            key="departments"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {departments.map((dept) => (
              <div 
                key={dept.id}
                onClick={() => handleDeptClick(dept.id)}
                className="group relative overflow-hidden rounded-2xl bg-surface border border-white/5 p-6 hover:border-primary/30 transition-all cursor-pointer hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Building2 className="w-24 h-24 text-primary" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{dept.id}</h3>
                      <p className="text-sm text-slate-400">{dept.name}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="text-sm text-slate-400">Head of Dept</div>
                      </div>
                      <div className="text-sm font-medium">{dept.head}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-white mb-1">{dept.employees}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Faculty</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-white mb-1">{dept.subjects}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Subjects</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* EMPLOYEES VIEW */}
        {view === 'employees' && (
          <motion.div 
            key="employees"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/50">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search faculty name or ID..." 
                    className="w-full bg-slate-950 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-900/30 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Employee ID</th>
                      <th className="px-6 py-4 font-semibold">Faculty Name</th>
                      <th className="px-6 py-4 font-semibold">Designation</th>
                      <th className="px-6 py-4 font-semibold">Subjects Known</th>
                      <th className="px-6 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {currentFaculty.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-mono text-slate-300">{emp.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-primary font-bold overflow-hidden">
                              <img src={`https://ui-avatars.com/api/?name=${emp.name.replace('Dr. ', '').replace('Prof. ', '')}&background=random`} alt={emp.name} />
                            </div>
                            <div className="font-medium text-white">{emp.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-300">{emp.role}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {emp.subjects.map((sub: string) => (
                              <span key={sub} className="px-2 py-1 rounded-md text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
                                <BookOpen className="w-3 h-3" /> {sub}
                              </span>
                            ))}
                          </div>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Faculty Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
          >
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Add New Faculty</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                <input 
                  type="text" 
                  value={newFaculty.name}
                  onChange={e => setNewFaculty(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary/50 text-white"
                  placeholder="e.g. Dr. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Designation</label>
                <input 
                  type="text" 
                  value={newFaculty.role}
                  onChange={e => setNewFaculty(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary/50 text-white"
                  placeholder="e.g. Assistant Professor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Subjects (comma separated)</label>
                <input 
                  type="text" 
                  value={newFaculty.subjects}
                  onChange={e => setNewFaculty(prev => ({ ...prev, subjects: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary/50 text-white"
                  placeholder="e.g. AI, Machine Learning"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button className="bg-primary text-white hover:bg-primary/90" onClick={handleAddFaculty}>Add Faculty</Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
