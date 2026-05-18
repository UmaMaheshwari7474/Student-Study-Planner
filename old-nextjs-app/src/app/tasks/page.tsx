"use client";

import { useState, useEffect } from "react";
import { Plus, Clock, BookOpen, Trash2, CheckCircle, X } from "lucide-react";
import "./page.css";

type Task = {
  id: string;
  title: string;
  subjectId: string;
  date: string;
  time: string;
  type: "exam" | "assignment" | "reading";
  completed: boolean;
  priority: "high" | "medium" | "low";
  reminders: string[];
};

type Subject = {
  id: string;
  name: string;
  color: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<Task["type"]>("assignment");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [reminder, setReminder] = useState("1 day before");

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
      if (subjectsData.length > 0) setSubjectId(subjectsData[0].id);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
    setIsLoading(false);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) {
      alert("Please create a subject first.");
      return;
    }
    const newTask = { title, subjectId, date, time, type, completed: false, priority, reminders: [reminder] };
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        fetchData();
        setIsModalOpen(false);
        setTitle(""); setDate(""); setTime(""); setType("assignment"); setPriority("medium");
      }
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  const toggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return task.type === filter;
  });

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <div>
          <h1 className="tasks-title gradient-text">Tasks & Exams</h1>
          <p className="text-secondary">Manage your upcoming deadlines and study sessions.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          <span>Add Task</span>
        </button>
      </header>

      <div className="filters-bar">
        {["all", "active", "completed", "exam", "assignment"].map(f => (
          <button 
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
          Loading tasks...
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map(task => (
            <div key={task.id} className={`task-card-full glass-panel hover-card ${task.completed ? "completed" : ""}`}>
              <div className="task-header-row">
                <span className={`task-type-badge ${task.type}`}>{task.type}</span>
                <div className={`task-priority priority-${task.priority}`} title={`Priority: ${task.priority}`}></div>
              </div>
              
              <div>
                <h3 className="task-title">{task.title}</h3>
                <div className="task-meta-full">
                  <div className="meta-item">
                    <BookOpen size={16} />
                    <span style={{color: subjects.find(s => s.id === task.subjectId)?.color}}>
                      {subjects.find(s => s.id === task.subjectId)?.name || "Unknown Subject"}
                    </span>
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{new Date(task.date).toLocaleDateString()} {task.time ? `at ${task.time}` : ''}</span>
                  </div>
                </div>
              </div>

              <div className="task-actions">
                <button 
                  className={`btn ${task.completed ? 'btn-secondary' : 'btn-primary'}`} 
                  onClick={() => toggleComplete(task.id, task.completed)}
                  style={{ padding: "0.5rem" }}
                >
                  <CheckCircle size={18} />
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => deleteTask(task.id)}
                  style={{ padding: "0.5rem", color: "var(--danger)", borderColor: "var(--danger)" }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && (
             <div style={{gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "var(--text-secondary)"}}>
               No tasks found. Click "Add Task" to create one.
             </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Task</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="form-control" required value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              
              <div className="form-group">
                <label>Subject</label>
                <select className="form-control" required value={subjectId} onChange={e => setSubjectId(e.target.value)}>
                  {subjects.length === 0 && <option value="" disabled>No subjects found. Create one first!</option>}
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div style={{display: 'flex', gap: '1rem'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Due Date</label>
                  <input type="date" className="form-control" required value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>Time (Optional)</label>
                  <input type="time" className="form-control" value={time} onChange={e => setTime(e.target.value)} />
                </div>
              </div>

              <div style={{display: 'flex', gap: '1rem'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Type</label>
                  <select className="form-control" value={type} onChange={e => setType(e.target.value as Task["type"])}>
                    <option value="assignment">Assignment</option>
                    <option value="exam">Exam</option>
                    <option value="reading">Reading</option>
                  </select>
                </div>
                
                <div className="form-group" style={{flex: 1}}>
                  <label>Priority</label>
                  <select className="form-control" value={priority} onChange={e => setPriority(e.target.value as Task["priority"])}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Reminder</label>
                <select className="form-control" value={reminder} onChange={e => setReminder(e.target.value)}>
                  <option value="None">None</option>
                  <option value="1 hour before">1 hour before</option>
                  <option value="1 day before">1 day before</option>
                  <option value="3 days before">3 days before</option>
                  <option value="1 week before">1 week before</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
