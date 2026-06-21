import { useState, useEffect } from 'react';
import { ref as dbRef, get } from 'firebase/database';
import { rtdb } from '../../lib/firebase';
import { FileText, Calendar, Users, Building2, CheckCircle2 } from 'lucide-react';

export default function PostedAttendance() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const attendanceRef = dbRef(rtdb, 'posted_attendance');
        const snapshot = await get(attendanceRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const postsList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setPosts(postsList);
        }
      } catch (err) {
        console.error("Error fetching posted attendance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Posted Attendance
          </h1>
          <p className="text-slate-400 mt-1">Review previously finalized and submitted attendance registers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold text-lg text-white mb-2">Recent Registers</h3>
          {loading ? (
            <div className="text-slate-500 text-sm animate-pulse">Loading posted registers...</div>
          ) : posts.length === 0 ? (
            <div className="p-6 bg-surface border border-white/5 rounded-2xl text-center text-slate-500">
              No attendance registers have been posted yet.
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
              {posts.map(post => (
                <div 
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedPost?.id === post.id 
                      ? 'bg-primary/10 border-primary/50' 
                      : 'bg-surface border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      Section: {post.sectionId}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5 text-sm">
                    <div className="text-slate-400 flex items-center gap-1">
                      <Users className="w-4 h-4" /> Total: {post.totalStudents}
                    </div>
                    <div className="text-success font-medium">
                      {post.presentCount} Present
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedPost ? (
            <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[700px]">
              <div className="p-6 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Class Attendance Record</h2>
                  <p className="text-slate-400 text-sm">
                    Section {selectedPost.sectionId} • {new Date(selectedPost.date).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center px-4 py-2 bg-slate-800 rounded-lg border border-white/5">
                    <div className="text-xl font-bold text-success">{selectedPost.presentCount}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Present</div>
                  </div>
                  <div className="text-center px-4 py-2 bg-slate-800 rounded-lg border border-white/5">
                    <div className="text-xl font-bold text-danger">{selectedPost.absentCount}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Absent</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-950 flex items-center gap-2 text-sm font-medium text-slate-300 border-b border-white/5">
                <CheckCircle2 className="w-4 h-4 text-success" />
                List of Present Students
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {selectedPost.presentStudents ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedPost.presentStudents.map((s: any) => (
                      <div key={s.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{s.name}</div>
                          <div className="text-xs text-slate-400">{s.displayRoll}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    No students were marked present in this session.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-500">
              <FileText className="w-12 h-12 mb-4 opacity-20" />
              <p>Select a register from the left to view full attendance details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
