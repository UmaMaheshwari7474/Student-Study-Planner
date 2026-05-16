import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Camera, Mail, UserCircle, MessageSquare, Save, Loader2 } from 'lucide-react';

export default function Profile() {
  const { user: authUser, checkAuth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/users/profile');
      if (res.ok) {
        setProfile(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
    setIsLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        await checkAuth(); // Sync global user state (including sidebar image)
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred.' });
    }
    setIsSaving(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Your Profile</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your identity and bio.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-8 text-center space-y-4">
            <div className="relative inline-block group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white overflow-hidden shadow-2xl border-4 border-white">
                {profile?.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={64} />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg hover:scale-110 transition-transform"
              >
                <Camera size={18} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
            </div>
            
            <div>
              <h2 className="text-2xl font-black text-slate-800">{profile?.name}</h2>
              <p className="text-slate-500 font-bold text-sm">{profile?.email}</p>
            </div>
            
            <div className="pt-4 border-t border-slate-50">
               <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                  <span>Status</span>
                  <span className="text-emerald-500">Active Student</span>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleUpdate} className="glass-panel p-8 space-y-6">
            {message.text && (
              <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {message.type === 'success' ? <UserCircle size={20} /> : <Loader2 size={20} />}
                {message.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  <UserCircle size={14} /> Full Name
                </label>
                <input 
                  type="text" 
                  value={profile?.name || ''} 
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700 bg-white" 
                />
              </div>
              <div className="space-y-2 opacity-60 cursor-not-allowed">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Mail size={14} /> Email Address
                </label>
                <input 
                  type="email" 
                  readOnly
                  value={profile?.email || ''} 
                  className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:outline-none font-bold text-slate-500 bg-slate-50" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                <MessageSquare size={14} /> Bio
              </label>
              <textarea 
                rows="4" 
                placeholder="Tell us about your study goals..."
                value={profile?.bio || ''} 
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700 bg-white resize-none" 
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="btn btn-primary px-8 py-3 text-sm font-bold shadow-indigo-200 shadow-xl"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
