import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Search, CheckCircle2, AlertCircle, Clock, LogOut, X } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeReminder, setActiveReminder] = useState(null);
  const [notifiedTasks, setNotifiedTasks] = useState(new Set());
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Upcoming Study Session', message: 'Math session starts in 15 mins', type: 'info', time: '10:30 AM', icon: Clock },
    { id: 2, title: 'Task Completed', message: 'You finished "Physics Revision"', type: 'success', time: '09:15 AM', icon: CheckCircle2 },
    { id: 3, title: 'Deadline Alert', message: 'History project due tomorrow!', type: 'warning', time: 'Yesterday', icon: AlertCircle }
  ]);

  useEffect(() => {
    const checkReminders = async () => {
      try {
        const res = await fetch('/api/tasks');
        if (res.ok) {
          const tasks = await res.json();
          const now = new Date();
          const todayStr = now.toISOString().split('T')[0];
          const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

          tasks.forEach(task => {
            if (!task.completed && task.date === todayStr && task.time && !notifiedTasks.has(task.id)) {
              if (task.time === currentTime) {
                setActiveReminder(task);
                setNotifiedTasks(prev => new Set(prev).add(task.id));
                setNotifications(prev => [{
                  id: Date.now(),
                  title: 'Task Reminder',
                  message: `Time for: ${task.title}`,
                  type: 'warning',
                  time: 'Just now',
                  icon: Clock
                }, ...prev]);
              }
            }
          });
        }
      } catch (error) {
        console.error("Reminder check failed", error);
      }
    };

    const interval = setInterval(checkReminders, 30000);
    checkReminders();
    return () => clearInterval(interval);
  }, [notifiedTasks]);

  const clearNotifications = () => setNotifications([]);

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
      {activeReminder && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-slate-700 animate-slide-in flex items-center gap-6 max-w-sm">
          <div className="p-3 bg-indigo-500 rounded-2xl">
            <Bell className="animate-bounce" size={24} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Task Reminder</p>
            <h4 className="font-bold text-lg leading-tight">{activeReminder.title}</h4>
            <p className="text-xs text-slate-400 mt-1">Starting right now!</p>
          </div>
          <button onClick={() => setActiveReminder(null)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>
      )}

      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search for tasks, subjects..." 
          className="w-full bg-slate-100/50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`transition-colors relative p-2 rounded-xl ${showNotifications ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'}`}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-pop-in">
              <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Notifications</h3>
                <button onClick={clearNotifications} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-tighter">Clear All</button>
              </div>
              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group cursor-pointer">
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          notif.type === 'info' ? 'bg-blue-100 text-blue-600' :
                          notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          <notif.icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{notif.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{notif.message}</p>
                          <p className="text-[9px] font-black text-slate-300 uppercase mt-1.5 tracking-tighter">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                      <Bell size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-400">All caught up!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-slate-100 mx-2" />

        <Link to="/profile" className="flex items-center gap-3 p-1.5 hover:bg-indigo-50 rounded-xl transition-all group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-800 leading-none">{user?.name || 'Student'}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">View Profile</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white overflow-hidden shadow-md group-hover:scale-105 transition-transform">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={20} />
            )}
          </div>
        </Link>

        <button 
          onClick={logout}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
