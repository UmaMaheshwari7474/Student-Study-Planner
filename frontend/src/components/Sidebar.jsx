import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BookOpen, 
  Calendar as CalendarIcon, 
  Clock, 
  Timer, 
  BarChart3,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NavLink = ({ to, icon: Icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
        : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
    }`}
  >
    <Icon size={20} className={active ? '' : 'group-hover:scale-110 transition-transform'} />
    <span className="font-semibold">{label}</span>
  </Link>
);

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/subjects', icon: BookOpen, label: 'Subjects' },
    { to: '/schedule', icon: CalendarIcon, label: 'Schedule' },
    { to: '/pomodoro', icon: Timer, label: 'Pomodoro' },
    { to: '/progress', icon: BarChart3, label: 'Progress' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-20">
      <div className="p-8">
        <h1 className="text-2xl font-black gradient-text tracking-tight">
          STUDY<span className="text-slate-800">FLOW</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink 
            key={item.to} 
            {...item} 
            active={location.pathname === item.to} 
          />
        ))}
      </nav>

      <div className="p-8 mt-auto border-t border-slate-50">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center">StudyFlow v1.0</p>
      </div>
    </aside>
  );
}
