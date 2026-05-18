"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import "./page.css";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function PomodoroPage() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (isWork) {
        setIsWork(false);
        setTimeLeft(BREAK_TIME);
        // Could trigger notification here
      } else {
        setIsWork(true);
        setTimeLeft(WORK_TIME);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isWork]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setIsWork(true);
    setTimeLeft(WORK_TIME);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="pomodoro-page">
      <header className="pomodoro-header">
        <h1 className="gradient-text">Pomodoro Timer</h1>
        <p className="text-secondary">Stay focused and productive with timed study sessions.</p>
      </header>

      <div className="glass-panel timer-container">
        <div className="timer-mode">
          {isWork ? "Work Session" : "Short Break"}
        </div>
        <div className="timer-display">
          {formatTime(timeLeft)}
        </div>
        
        <div className="timer-controls">
          <button 
            className="btn btn-primary" 
            onClick={toggleTimer}
          >
            {isActive ? <Pause size={20} /> : <Play size={20} />}
            {isActive ? "Pause" : "Start"}
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={resetTimer}
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
