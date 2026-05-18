"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import "./page.css";
import "../tasks/page.css"; // Modal styles

type Subject = { id: string; name: string; color: string; };
type ScheduleBlock = { id: string; subjectId: string; dayOfWeek: number; startTime: string; endTime: string; };

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({length: 15}, (_, i) => i + 8); // 8 AM to 10 PM

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<ScheduleBlock[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [subjectId, setSubjectId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [schedRes, subjRes] = await Promise.all([
        fetch("/api/schedule"), fetch("/api/subjects")
      ]);
      const schedData = await schedRes.json();
      const subjData = await subjRes.json();
      setSchedules(schedData);
      setSubjects(subjData);
      if (subjData.length > 0) setSubjectId(subjData[0].id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) return alert("Please create a subject first.");
    
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId, dayOfWeek, startTime, endTime })
      });
      if (res.ok) {
        fetchData();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      const res = await fetch(`/api/schedule/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const getBlockStyle = (block: ScheduleBlock) => {
    const startHour = parseInt(block.startTime.split(':')[0]);
    const startMin = parseInt(block.startTime.split(':')[1]);
    const endHour = parseInt(block.endTime.split(':')[0]);
    const endMin = parseInt(block.endTime.split(':')[1]);
    
    const startOffset = (startHour - 8) * 60 + startMin;
    const duration = (endHour - startHour) * 60 + (endMin - startMin);
    
    const subject = subjects.find(s => s.id === block.subjectId);
    
    return {
      top: `${(startOffset / 60) * 60}px`,
      height: `${(duration / 60) * 60}px`,
      backgroundColor: subject?.color || 'var(--accent-primary)'
    };
  };

  return (
    <div className="schedule-page">
      <header className="schedule-header">
        <div>
          <h1 className="progress-title gradient-text">Study Schedule</h1>
          <p className="text-secondary">Plan your weekly recurring study blocks.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          <span>Add Block</span>
        </button>
      </header>

      <div className="timetable-container">
        <div className="timetable">
          {/* Header Row */}
          <div className="timetable-header-cell">Time</div>
          {DAYS.map(day => <div key={day} className="timetable-header-cell">{day}</div>)}
          
          {/* Time Column */}
          <div className="time-column">
            {HOURS.map(hour => (
              <div key={hour} className="time-slot-label">
                {hour > 12 ? `${hour-12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
              </div>
            ))}
          </div>
          
          {/* Day Columns */}
          {DAYS.map((day, dayIndex) => (
            <div key={dayIndex} className="day-column">
              {/* Background Grid */}
              {HOURS.map(hour => <div key={hour} className="hour-slot"></div>)}
              
              {/* Schedule Blocks */}
              {schedules.filter(s => s.dayOfWeek === dayIndex).map(block => {
                const subject = subjects.find(s => s.id === block.subjectId);
                return (
                  <div key={block.id} className="schedule-block" style={getBlockStyle(block)}>
                    <span className="schedule-block-title">{subject?.name || "Unknown"}</span>
                    <span className="schedule-block-time">{block.startTime} - {block.endTime}</span>
                    <button className="delete-block-btn" onClick={() => deleteSchedule(block.id)}>
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Study Block</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleAddSchedule}>
              <div className="form-group">
                <label>Subject</label>
                <select className="form-control" required value={subjectId} onChange={e => setSubjectId(e.target.value)}>
                  {subjects.length === 0 && <option value="" disabled>No subjects found. Create one first!</option>}
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Day of Week</label>
                <select className="form-control" value={dayOfWeek} onChange={e => setDayOfWeek(parseInt(e.target.value))}>
                  {DAYS.map((day, index) => <option key={index} value={index}>{day}</option>)}
                </select>
              </div>
              <div style={{display: 'flex', gap: '1rem'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Start Time</label>
                  <input type="time" className="form-control" required value={startTime} onChange={e => setStartTime(e.target.value)} />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>End Time</label>
                  <input type="time" className="form-control" required value={endTime} onChange={e => setEndTime(e.target.value)} />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Block</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
