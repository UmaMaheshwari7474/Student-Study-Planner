"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import "./page.css";

type Task = {
  id: string;
  title: string;
  subject: string;
  date: string;
  type: "exam" | "assignment" | "reading";
  completed: boolean;
  priority: "high" | "medium" | "low";
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const days = [];
  
  // Previous month padding
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="day-cell empty"></div>);
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
    
    // Find tasks for this day
    const dayTasks = tasks.filter(t => {
      const taskDate = new Date(t.date);
      return taskDate.getDate() === day && taskDate.getMonth() === month && taskDate.getFullYear() === year;
    });

    days.push(
      <div key={`day-${day}`} className={`day-cell ${isToday ? 'today' : ''}`}>
        <span className="date-number">{day}</span>
        <div className="day-tasks">
          {dayTasks.map(task => (
            <div key={task.id} className={`calendar-task ${task.type}`} title={task.title}>
              {task.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="calendar-page">
      <header className="calendar-header">
        <div>
          <h1 className="tasks-title gradient-text">Calendar</h1>
          <p className="text-secondary">Visualize your schedule and upcoming deadlines.</p>
        </div>
        
        <div className="calendar-controls">
          <button className="btn btn-secondary" onClick={prevMonth} style={{padding: '0.5rem'}}>
            <ChevronLeft size={20} />
          </button>
          <h2 style={{minWidth: '200px', textAlign: 'center'}}>
            <CalendarIcon size={20} style={{display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom'}} />
            {monthNames[month]} {year}
          </h2>
          <button className="btn btn-secondary" onClick={nextMonth} style={{padding: '0.5rem'}}>
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      <div className="calendar-grid-container">
        <div className="weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="days-grid">
          {days}
        </div>
      </div>
    </div>
  );
}
