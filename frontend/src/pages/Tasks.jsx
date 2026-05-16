import { useState, useEffect } from "react";
import { Plus, Clock, BookOpen, Trash2, CheckCircle2, X, Filter, ChevronRight, Edit3 } from "lucide-react";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  // Form state
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("assignment");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tasksRes, subjectsRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/subjects")
      ]);
      const tasksData = await tasksRes.json();
      const subjectsData = await subjectsRes.json();
      setTasks(tasksData);
      setSubjects(subjectsData);
      if (subjectsData.length > 0 && !subjectId) setSubjectId(subjectsData[0].id);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
    setIsLoading(false);
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setSubjectId(task.subjectId);
      setDate(task.date);
      setTime(task.time || "");
      setType(task.type);
      setPriority(task.priority);
    } else {
      setEditingTask(null);
      setTitle("");
      setDate("");
      setTime("");
      setType("assignment");
      setPriority("medium");
      if (subjects.length > 0) setSubjectId(subjects[0].id);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { title, subjectId, date, time, type, priority };
    try {
      const url = editingTask ? `/api/tasks/${editingTask.id}` : "/api/tasks";
      const method = editingTask ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (res.ok) {
        fetchData();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to save task", error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, completed: !task.completed }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Failed to toggle task", error);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Tasks</h1>
          <p className="text-slate-500 font-medium mt-1">Organize your academic life.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="btn btn-primary py-3 px-6 text-sm font-bold"
        >
          <Plus size={20} /> New Task
        </button>
      </header>

      {/* Filter Bar */}
      <div className="flex gap-2 p-1 bg-slate-200/50 w-fit rounded-xl">
        {['all', 'pending', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-400 font-bold italic">No tasks found in this category.</p>
            </div>
          ) : (
            filteredTasks.map(task => {
              const subject = subjects.find(s => s.id === task.subjectId);
              return (
                <div key={task.id} className={`glass-panel p-6 flex flex-col group transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/50 ${
                  task.completed ? 'opacity-50 grayscale-[0.5]' : ''
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                      task.type === 'exam' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      {task.type}
                    </span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleOpenModal(task)}
                        className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-black text-xl text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors">
                    {task.title}
                  </h3>
                  
                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: subject?.color}} />
                      <span>{subject?.name || "General"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                      <Clock size={16} />
                      <span>{new Date(task.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                    <div className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                      task.priority === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {task.priority} priority
                    </div>
                    <button 
                      onClick={() => handleToggleComplete(task)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        task.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-emerald-500 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 size={24} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform animate-pop-in">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {editingTask ? "Edit Task" : "New Task"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-colors text-slate-400 hover:text-slate-600 shadow-sm">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Title</label>
                  <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Subject</label>
                    <select required value={subjectId} onChange={e => setSubjectId(e.target.value)} className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700 appearance-none bg-white">
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Due Date</label>
                    <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Time Reminder</label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Type</label>
                    <select required value={type} onChange={e => setType(e.target.value)} className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700 appearance-none bg-white">
                      <option value="assignment">Assignment</option>
                      <option value="exam">Exam</option>
                      <option value="project">Project</option>
                      <option value="reading">Reading</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Priority</label>
                    <select required value={priority} onChange={e => setPriority(e.target.value)} className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700 appearance-none bg-white">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="pt-6 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary py-3 px-6 text-sm font-bold">Cancel</button>
                <button type="submit" className="btn btn-primary py-3 px-8 text-sm font-bold shadow-indigo-200 shadow-lg">
                  {editingTask ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
