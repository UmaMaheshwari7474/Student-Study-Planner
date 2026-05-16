import { useState, useEffect } from "react";
import { Calendar, CheckSquare, Clock, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tRes, sRes, cRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/subjects"),
        fetch("/api/calendar")
      ]);
      if (tRes.ok && sRes.ok && cRes.ok) {
        setTasks(await tRes.json());
        setSubjects(await sRes.json());
        setSchedule(await cRes.json());
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const upcomingExams = tasks.filter(t => t.type === 'exam' && !t.completed).length;
  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Dynamic Schedule Logic
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];
  const currentHour = new Date().getHours();
  
  const todaysSchedule = schedule
    .filter(b => b.day === todayName)
    .sort((a, b) => parseInt(a.startTime) - parseInt(b.startTime));

  const nextSession = todaysSchedule.find(b => parseInt(b.startTime) >= currentHour);
  const nextSubject = nextSession ? subjects.find(s => s.id === nextSession.subjectId) : null;

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 font-medium mt-1">{todayStr}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 text-sm font-bold text-slate-600">
          <Sparkles size={16} className="text-amber-500" />
          Keep it up!
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Syncing your progress...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 flex items-center gap-5 hover:translate-y-[-4px] transition-transform duration-300">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                <CheckSquare size={28} />
              </div>
              <div>
                <h3 className="text-slate-500 text-xs font-black uppercase tracking-wider">Completed</h3>
                <p className="text-3xl font-black text-slate-800">{completedTasks}</p>
              </div>
            </div>
            
            <div className="glass-panel p-6 flex items-center gap-5 hover:translate-y-[-4px] transition-transform duration-300">
              <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
                <Clock size={28} />
              </div>
              <div>
                <h3 className="text-slate-500 text-xs font-black uppercase tracking-wider">Subjects</h3>
                <p className="text-3xl font-black text-slate-800">{subjects.length}</p>
              </div>
            </div>

            <div className="glass-panel p-6 flex items-center gap-5 hover:translate-y-[-4px] transition-transform duration-300">
              <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                <Calendar size={28} />
              </div>
              <div>
                <h3 className="text-slate-500 text-xs font-black uppercase tracking-wider">Exams</h3>
                <p className="text-3xl font-black text-slate-800">{upcomingExams}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Deadlines */}
            <section className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h2 className="text-xl font-black text-slate-800">Deadlines</h2>
                <Link to="/tasks" className="text-sm font-bold text-indigo-600 hover:gap-2 flex items-center gap-1 transition-all">
                  View Tasks <ArrowRight size={16} />
                </Link>
              </div>
              
              <div className="space-y-3">
                {upcomingTasks.length === 0 ? (
                  <div className="glass-panel p-10 text-center text-slate-400 font-medium italic">
                    No deadlines found. Time to relax!
                  </div>
                ) : (
                  upcomingTasks.map(task => {
                    const subject = subjects.find(s => s.id === task.subjectId);
                    return (
                      <div key={task.id} className="glass-panel p-4 flex items-center justify-between group hover:bg-white transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-2 h-10 rounded-full" style={{backgroundColor: subject?.color || '#cbd5e1'}} />
                          <div>
                            <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                              {subject?.name || 'General'} • {new Date(task.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${
                          task.type === 'exam' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {task.type}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* Smart Suggestions & Today's Schedule */}
            <div className="space-y-8">
              <section className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h2 className="text-xl font-black text-slate-800">Next Session</h2>
                  <Link to="/schedule" className="text-sm font-bold text-indigo-600 hover:gap-2 flex items-center gap-1 transition-all">
                    View Schedule <ArrowRight size={16} />
                  </Link>
                </div>
                
                {nextSession ? (
                  <div className="glass-panel p-6 bg-white border-l-8 group hover:translate-x-2 transition-transform" style={{ borderLeftColor: nextSubject?.color }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
                          <Clock size={12} /> {nextSession.startTime} - {nextSession.endTime}
                        </div>
                        <h3 className="text-2xl font-black text-slate-800">{nextSubject?.name}</h3>
                        <p className="text-slate-500 font-bold text-sm mt-1">Deep work session</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-indigo-600 transition-colors">
                        <BookOpen size={24} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="glass-panel p-6 bg-slate-50 text-center text-slate-400 font-bold italic">
                    No more sessions scheduled for today.
                  </div>
                )}
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-black text-slate-800">Study AI</h2>
                <div className="glass-panel p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp size={120} />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-100 text-xs font-black uppercase tracking-widest">
                      <Sparkles size={14} />
                      Insight of the day
                    </div>
                    <h3 className="text-2xl font-bold leading-tight">
                      {nextSession 
                        ? `Get ready! Your next session for ${nextSubject?.name} starts soon.`
                        : upcomingExams > 0 
                          ? `You have ${upcomingExams} exams approaching. Focus on active recall today.`
                          : "Your schedule is clear! It's a great time to get ahead on your reading list."}
                    </h3>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
