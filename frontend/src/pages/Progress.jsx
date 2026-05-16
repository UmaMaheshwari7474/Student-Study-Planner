import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Calendar, Zap, Target, Loader2 } from "lucide-react";

const ProgressCard = ({ title, value, unit, icon: Icon, color }) => (
  <div className="glass-panel p-6 space-y-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg`} style={{ backgroundColor: color }}>
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-slate-500 text-xs font-black uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-black text-slate-800">{value}<span className="text-sm font-bold ml-1 text-slate-400">{unit}</span></p>
    </div>
  </div>
);

export default function Progress() {
  const [stats, setStats] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, weeklyRes, distRes] = await Promise.all([
          fetch('/api/analytics/stats'),
          fetch('/api/analytics/weekly'),
          fetch('/api/analytics/distribution')
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (weeklyRes.ok) setWeekly(await weeklyRes.json());
        if (distRes.ok) setDistribution(await distRes.json());
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 space-y-4">
        <Loader2 className="animate-spin" size={40} />
        <p className="font-bold text-sm uppercase tracking-widest">Calculating Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Analytics</h1>
          <p className="text-slate-500 font-medium mt-1">Visualize your academic growth.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProgressCard title="Study Hours" value={stats?.studyHours || 0} unit="hrs" icon={Calendar} color="#6366f1" />
        <ProgressCard title="Tasks Completed" value={stats?.tasksCompleted || 0} unit="%" icon={Zap} color="#10b981" />
        <ProgressCard title="Focus Score" value={stats?.focusScore || 0} unit="/100" icon={Target} color="#a855f7" />
        <ProgressCard title="Subject Mastery" value={stats?.subjectMastery || 0} unit="%" icon={TrendingUp} color="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-8 space-y-6">
          <h2 className="text-xl font-black text-slate-800">Weekly Performance</h2>
          <div className="h-64 flex items-end justify-between px-4 pb-4 border-b border-slate-100">
             {weekly.map((h, i) => (
               <div key={i} className="w-12 group relative flex flex-col items-center">
                  <div 
                    className="w-full bg-indigo-500 rounded-t-lg transition-all duration-500 hover:bg-indigo-600 cursor-pointer shadow-lg shadow-indigo-100" 
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] font-black text-slate-400 mt-4 uppercase">Day {i+1}</span>
                  <div className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}% efficiency
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="glass-panel p-8 space-y-6">
          <h2 className="text-xl font-black text-slate-800">Subject Distribution</h2>
          <div className="space-y-4">
            {distribution.length > 0 ? distribution.map((s) => (
              <div key={s.name} className="space-y-1">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                   <span className="text-slate-600">{s.name}</span>
                   <span className="text-slate-400">{s.percent}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.percent}%`, backgroundColor: s.color }} />
                </div>
              </div>
            )) : (
              <div className="h-full flex items-center justify-center text-slate-300 text-xs font-bold uppercase py-10">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
