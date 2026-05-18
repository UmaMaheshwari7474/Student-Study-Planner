"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Award, CheckCircle } from "lucide-react";
import "./page.css";

type Task = {
  id: string;
  subjectId: string;
  completed: boolean;
};

type Subject = {
  id: string;
  name: string;
  color: string;
};

export default function ProgressPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const overallProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const subjectProgress = subjects.map(subject => {
    const subjTasks = tasks.filter(t => t.subjectId === subject.id);
    const completed = subjTasks.filter(t => t.completed).length;
    const total = subjTasks.length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { ...subject, completed, total, percentage };
  });

  return (
    <div className="progress-page">
      <header className="progress-header">
        <h1 className="progress-title gradient-text">Academic Progress</h1>
        <p className="text-secondary">Track your completion rates and overall academic performance.</p>
      </header>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
          Analyzing data...
        </div>
      ) : (
        <>
          <div className="overview-cards">
            <div className="overview-card glass-panel hover-card">
              <div className="overview-value">{overallProgress}%</div>
              <div className="overview-label">Overall Completion</div>
            </div>
            <div className="overview-card glass-panel hover-card">
              <div className="overview-value">{completedTasks}/{totalTasks}</div>
              <div className="overview-label">Tasks Completed</div>
            </div>
            <div className="overview-card glass-panel hover-card">
              <div className="overview-value">{subjects.length}</div>
              <div className="overview-label">Active Subjects</div>
            </div>
          </div>

          <h2 style={{ marginBottom: "1.5rem" }}>Subject Performance</h2>
          
          <div className="subject-progress-list">
            {subjectProgress.map(subj => (
              <div key={subj.id} className="subject-progress-item hover-card">
                <div className="subject-progress-header">
                  <div className="subject-progress-name">
                    <div className="subject-color-dot" style={{ backgroundColor: subj.color }}></div>
                    {subj.name}
                  </div>
                  <div className="subject-progress-stats">
                    {subj.completed} / {subj.total} tasks ({subj.percentage}%)
                  </div>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${subj.percentage}%`, 
                      backgroundColor: subj.percentage === 100 ? 'var(--success)' : subj.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
            
            {subjectProgress.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
                No subjects found. Create subjects and tasks to see your progress!
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
