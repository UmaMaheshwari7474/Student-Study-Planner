import { useState, useEffect } from "react";
import { Plus, Trash2, Palette, Edit3, X } from "lucide-react";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  // Form state
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/subjects");
      if (res.ok) {
        setSubjects(await res.json());
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleOpenModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setName(subject.name);
      setColor(subject.color);
    } else {
      setEditingSubject(null);
      setName("");
      setColor("#6366f1");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingSubject ? `/api/subjects/${editingSubject.id}` : "/api/subjects";
      const method = editingSubject ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color }),
      });
      if (res.ok) {
        fetchSubjects();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!confirm("Are you sure you want to delete this subject? All related tasks and schedule blocks might be affected.")) return;
    try {
      const res = await fetch(`/api/subjects/${id}`, { method: "DELETE" });
      if (res.ok) fetchSubjects();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Subjects</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your academic curriculum.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="btn btn-primary py-3 px-6 text-sm font-bold"
        >
          <Plus size={20} /> Add Subject
        </button>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map(subject => (
            <div key={subject.id} className="glass-panel p-6 group relative overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div 
                className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" 
                style={{ backgroundColor: subject.color }}
              />
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: subject.color }}>
                  <Palette size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 truncate">{subject.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {subject.color}
                  </p>
                </div>
                <div className="pt-4 flex gap-2">
                  <button 
                    onClick={() => handleOpenModal(subject)}
                    className="flex-1 btn btn-secondary py-2 text-xs font-bold"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-pop-in">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {editingSubject ? "Edit Subject" : "New Subject"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-colors text-slate-400 hover:text-slate-600 shadow-sm">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Subject Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Advanced Mathematics" className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Label Color</label>
                <div className="flex flex-wrap gap-3">
                  {['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${
                        color === c ? 'border-indigo-100 scale-125 shadow-lg' : 'border-transparent hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input 
                    type="color" 
                    value={color} 
                    onChange={e => setColor(e.target.value)}
                    className="w-10 h-10 rounded-full overflow-hidden border-none cursor-pointer"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn btn-secondary py-3 font-bold text-sm">Cancel</button>
                <button type="submit" className="flex-1 btn btn-primary py-3 font-bold text-sm shadow-indigo-200 shadow-lg">
                  {editingSubject ? "Save Changes" : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
