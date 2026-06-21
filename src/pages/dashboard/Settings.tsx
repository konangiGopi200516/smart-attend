import { useState } from 'react';
import { Save, Building, Camera, Cpu, Shield, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('institution');

  const tabs = [
    { id: 'institution', name: 'Institution', icon: Building },
    { id: 'camera', name: 'Camera', icon: Camera },
    { id: 'ai', name: 'AI Configuration', icon: Cpu },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'users', name: 'User Management', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage system configurations and platform preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                activeTab === tab.id 
                  ? "bg-slate-800 text-white" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-primary" : "text-slate-500")} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-surface border border-white/5 rounded-2xl p-6 min-h-[500px]">
          {activeTab === 'institution' && (
            <div className="space-y-6 max-w-lg">
              <div>
                <h3 className="text-lg font-semibold mb-4">Institution Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Institution Name</label>
                    <input type="text" defaultValue="Global Tech University" className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary/50 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Contact Email</label>
                    <input type="email" defaultValue="admin@globaltech.edu" className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary/50 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Timezone</label>
                    <select className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary/50 text-white appearance-none">
                      <option>UTC (Coordinated Universal Time)</option>
                      <option>EST (Eastern Standard Time)</option>
                      <option>IST (Indian Standard Time)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button className="bg-primary text-white hover:bg-primary/90">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6 max-w-lg">
              <div>
                <h3 className="text-lg font-semibold mb-4">AI Model Configuration</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-slate-400">Confidence Threshold</label>
                      <span className="text-sm font-medium text-white">85%</span>
                    </div>
                    <input type="range" min="50" max="99" defaultValue="85" className="w-full accent-primary" />
                    <p className="text-xs text-slate-500 mt-1">Minimum confidence score required to mark attendance.</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-white/5">
                    <div>
                      <div className="font-medium">Liveness Detection</div>
                      <div className="text-xs text-slate-400">Prevent spoofing using static images.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-white/5">
                    <div>
                      <div className="font-medium">Multi-Face Recognition</div>
                      <div className="text-xs text-slate-400">Detect and process multiple faces simultaneously.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button className="bg-primary text-white hover:bg-primary/90">
                  <Save className="w-4 h-4 mr-2" /> Save AI Settings
                </Button>
              </div>
            </div>
          )}
          
          {activeTab === 'camera' && (
            <div className="space-y-6 max-w-lg">
              <div>
                <h3 className="text-lg font-semibold mb-4">Camera Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Default Resolution</label>
                    <select className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary/50 text-white appearance-none">
                      <option>720p (Performance)</option>
                      <option selected>1080p (Balanced)</option>
                      <option>4K (High Accuracy)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Capture Frame Rate</label>
                    <select className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary/50 text-white appearance-none">
                      <option>15 FPS</option>
                      <option selected>30 FPS</option>
                      <option>60 FPS</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-white/5 mt-4">
                    <div>
                      <div className="font-medium">Hardware Acceleration</div>
                      <div className="text-xs text-slate-400">Use GPU for faster video processing.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button className="bg-primary text-white hover:bg-primary/90">
                  <Save className="w-4 h-4 mr-2" /> Save Camera Settings
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 max-w-lg">
              <div>
                <h3 className="text-lg font-semibold mb-4">Security & Privacy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-white/5">
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-xs text-slate-400">Require 2FA for all faculty and admin logins.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-white/5">
                    <div>
                      <div className="font-medium">Biometric Data Encryption</div>
                      <div className="text-xs text-slate-400">Encrypt face descriptors at rest (AES-256).</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5 mt-4">Session Timeout (Minutes)</label>
                    <input type="number" defaultValue="30" className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary/50 text-white" />
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button className="bg-primary text-white hover:bg-primary/90">
                  <Save className="w-4 h-4 mr-2" /> Update Security
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">User Management</h3>
                <Button className="bg-primary hover:bg-primary/90 text-white text-sm py-1.5 h-auto">
                  + Invite User
                </Button>
              </div>
              
              <div className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-4 border-b border-white/5 bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <div className="col-span-2">User</div>
                  <div>Role</div>
                  <div>Status</div>
                </div>
                
                {[
                  { name: 'Dr. Sarah Connor', email: 'sarah.c@globaltech.edu', role: 'System Admin', status: 'Active' },
                  { name: 'Prof. Alan Turing', email: 'alan.t@globaltech.edu', role: 'Faculty Lead', status: 'Active' },
                  { name: 'Dr. John Smith', email: 'john.s@globaltech.edu', role: 'Faculty', status: 'Pending' },
                ].map((user, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors">
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-300">{user.role}</div>
                    <div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        user.status === 'Active' ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
