"use client";

import { useState, useEffect } from "react";
import { Calendar, CheckSquare, Clock, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import "./page.css";
import { useNotification } from "@/context/NotificationContext";

type Task = { id: string; subjectId: string; title: string; date: string; type: string; completed: boolean; };
type Subject = { id: string; name: string; color: string; };

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tRes, sRes] = await Promise.all([fetch("/api/tasks"), fetch("/api/subjects")]);
      if (tRes.ok && sRes.ok) {
        const fetchedTasks = await tRes.json();
        setTasks(fetchedTasks);
        setSubjects(await sRes.json());
        
        // Trigger notification for upcoming exams
        const upcomingExams = fetchedTasks.filter((t: Task) => t.type === 'exam' && !t.completed);
        if (upcomingExams.length > 0) {
          addNotification(`You have ${upcomingExams.length} upcoming exam(s)!`, "warning");
        }
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const completedTasks = tasks.filter(t => t.completed).length;
  const upcomingExams = tasks.filter(t => t.type === 'exam' && !t.completed).length;
  
  // Sort tasks by date for upcoming
  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title gradient-text">Welcome back, Student!</h1>
          <p className="dashboard-subtitle">Here is what's happening with your studies today.</p>
        </div>
        <div className="date-display">
          <Calendar size={20} className="text-secondary" />
          <span>{todayStr}</span>
        </div>
      </header>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>Loading dashboard...</div>
      ) : (
        <>
          <div className="stats-grid">
        <div className="stat-card glass-panel hover-card">
          <div className="stat-icon-wrapper bg-primary">
            <CheckSquare size={24} />
          </div>
          <div className="stat-content">
            <h3>Tasks Completed</h3>
            <p>{completedTasks} <span style={{fontSize: '1rem', color: 'var(--success)', fontWeight: 'normal'}}>Total</span></p>
          </div>
        </div>
        
        <div className="stat-card glass-panel hover-card">
          <div className="stat-icon-wrapper bg-warning">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>Active Subjects</h3>
            <p>{subjects.length}</p>
          </div>
        </div>

        <div className="stat-card glass-panel hover-card">
          <div className="stat-icon-wrapper bg-success">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>Upcoming Exams</h3>
            <p>{upcomingExams}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <section>
          <div className="section-header">
            <h2>Upcoming Deadlines</h2>
            <Link href="/tasks" className="btn btn-secondary" style={{padding: '0.5rem 1rem'}}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="task-list">
            {upcomingTasks.length === 0 && <p style={{color: 'var(--text-secondary)'}}>No upcoming tasks.</p>}
            {upcomingTasks.map(task => {
              const subject = subjects.find(s => s.id === task.subjectId);
              return (
                <div key={task.id} className="task-card">
                  <div className={`task-color ${task.type}`} style={{ backgroundColor: subject?.color }}></div>
                  <div className="task-details">
                    <h4>{task.title}</h4>
                    <div className="task-meta">
                      <span style={{color: subject?.color}}>{subject?.name || 'Unknown'}</span>
                      <span>•</span>
                      <span>{new Date(task.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button className="task-action" aria-label="Mark as done">
                    <Check size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
        
        <section>
          <div className="section-header">
            <h2>Today's Schedule</h2>
          </div>
          <div className="glass-panel" style={{padding: '1.5rem', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)'}}>
             <Calendar size={48} style={{opacity: 0.2}} />
             <p>Manage your schedule from the Study Schedule tab.</p>
             <Link href="/schedule" className="btn btn-primary">View Schedule</Link>
          </div>
        </section>
        
        <section>
          <div className="section-header">
            <h2>✨ Smart Study Suggestions</h2>
          </div>
          <div className="glass-panel" style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
             {upcomingExams > 0 ? (
               <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid var(--accent-primary)' }}>
                 <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Focus Required</h4>
                 <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You have {upcomingExams} upcoming exams. AI suggests scheduling two 25-minute Pomodoro sessions for revision today.</p>
                 <Link href="/pomodoro" className="btn btn-secondary" style={{ marginTop: '1rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Start Timer</Link>
               </div>
             ) : (
               <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid var(--success)' }}>
                 <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>You're on Track!</h4>
                 <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No immediate exams detected. AI suggests doing light reading to stay ahead of the syllabus.</p>
               </div>
             )}
          </div>
        </section>
      </div>
        </>
      )}
    </div>
  );
}
