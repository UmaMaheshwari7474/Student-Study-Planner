import { useState, useEffect } from "react";
import { Plus, Clock, ChevronLeft, ChevronRight, BookOpen, X, Trash2 } from "lucide-react";

export default function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state for new block
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [endTime, setEndTime] = useState("");

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = Array.from({ length: 14 }, (_, i) => `${i + 8}:00`);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [schRes, subRes] = await Promise.all([
        fetch("/api/calendar"),
        fetch("/api/subjects")
      ]);
      if (schRes.ok && subRes.ok) {
        setSchedule(await schRes.json());
        const subData = await subRes.json();
        setSubjects(subData);
        if (subData.length > 0) setSelectedSubjectId(subData[0].id);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleCellClick = (day, time) => {
    const existing = schedule.find(b => b.day === day && b.startTime === time);
    if (existing) {
      handleDeleteBlock(existing.id);
    } else {
      setSelectedDay(day);
      setSelectedTime(time);
      // Default end time to 1 hour later
      const hour = parseInt(time.split(':')[0]);
      setEndTime(`${hour + 1}:00`);
      setIsModalOpen(true);
    }
  };

  const handleAddBlock = async (e) => {
    e.preventDefault();
    const newBlock = {
      day: selectedDay,
      startTime: selectedTime,
      endTime: endTime,
      subjectId: selectedSubjectId
    };

    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBlock),
      });
      if (res.ok) {
        fetchData();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteBlock = async (id) => {
    if (!confirm("Remove this study block?")) return;
    try {
      const res = await fetch(`/api/calendar/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Study Schedule</h1>
          <p className="text-slate-500 font-medium mt-1">Optimize your weekly routine. Click cells to manage blocks.</p>
        </div>
        <div className="flex gap-2">
           <button className="btn btn-secondary px-3"><ChevronLeft size={20} /></button>
           <button className="btn btn-secondary px-3"><ChevronRight size={20} /></button>
        </div>
      </header>

      {isLoading ? (
        <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div></div>
      ) : (
        <div className="glass-panel overflow-hidden border-none shadow-xl shadow-slate-200/50">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 w-20 border-r border-slate-100"></th>
                  {days.map(day => (
                    <th key={day} className="p-4 text-xs font-black uppercase tracking-widest text-slate-400 min-w-[150px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time} className="border-b border-slate-50 last:border-0 group">
                    <td className="p-4 text-xs font-bold text-slate-400 border-r border-slate-50 bg-slate-50/30">
                      {time}
                    </td>
                    {days.map(day => {
                      const block = schedule.find(b => b.day === day && b.startTime === time);
                      const subject = subjects.find(s => s.id === block?.subjectId);
                      
                      return (
                        <td key={`${day}-${time}`} className="p-1 min-h-[70px] relative">
                          {block ? (
                            <div 
                              onClick={() => handleCellClick(day, time)}
                              className="h-full rounded-xl p-3 shadow-sm flex flex-col justify-between group/block hover:scale-[1.02] transition-transform cursor-pointer relative"
                              style={{ backgroundColor: `${subject?.color}15`, borderLeft: `4px solid ${subject?.color}` }}
                            >
                              <p className="text-xs font-black" style={{ color: subject?.color }}>{subject?.name}</p>
                              <span className="text-[10px] font-bold text-slate-400">{block.startTime} - {block.endTime}</span>
                              <div className="absolute top-1 right-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
                                <Trash2 size={12} className="text-red-400" />
                              </div>
                            </div>
                          ) : (
                            <div 
                              onClick={() => handleCellClick(day, time)}
                              className="h-full w-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 cursor-pointer"
                            >
                               <div className="w-full h-12 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:border-indigo-200 hover:text-indigo-400 transition-all">
                                 <Plus size={16} />
                               </div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-pop-in">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add Study Block</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-colors text-slate-400 hover:text-slate-600 shadow-sm">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddBlock} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Day</label>
                  <input readOnly value={selectedDay} className="w-full px-5 py-3 rounded-2xl border border-slate-200 font-bold text-slate-500 bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Start Time</label>
                  <input readOnly value={selectedTime} className="w-full px-5 py-3 rounded-2xl border border-slate-200 font-bold text-slate-500 bg-slate-50" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Subject</label>
                <select 
                  required 
                  value={selectedSubjectId} 
                  onChange={e => setSelectedSubjectId(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700 appearance-none bg-white"
                >
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">End Time</label>
                <select 
                  value={endTime} 
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700 appearance-none bg-white"
                >
                  {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  <option value="22:00">22:00</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn btn-secondary py-3 font-bold text-sm">Cancel</button>
                <button type="submit" className="flex-1 btn btn-primary py-3 font-bold text-sm shadow-indigo-200 shadow-lg">Save Block</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
