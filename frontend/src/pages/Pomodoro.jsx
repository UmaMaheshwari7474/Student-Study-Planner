import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Coffee, Brain, Bell, Settings2, X, Check } from "lucide-react";

export default function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('study'); // study, shortBreak, longBreak, custom
  const [customMins, setCustomMins] = useState(25);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [alarm] = useState(new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"));

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      playAlarm();
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const playAlarm = () => {
    alarm.currentTime = 0;
    alarm.loop = true;
    alarm.play();
    setIsAlarmPlaying(true);
  };

  const stopAlarm = () => {
    alarm.pause();
    alarm.currentTime = 0;
    setIsAlarmPlaying(false);
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'custom') {
      setTimeLeft(customMins * 60);
    } else {
      setTimeLeft(mode === 'study' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === 'custom') {
      setIsCustomModalOpen(true);
    } else {
      setTimeLeft(newMode === 'study' ? 25 * 60 : newMode === 'shortBreak' ? 5 * 60 : 15 * 60);
    }
  };

  const handleSetCustom = (e) => {
    e.preventDefault();
    setTimeLeft(customMins * 60);
    setIsCustomModalOpen(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'study' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : mode === 'longBreak' ? 15 * 60 : customMins * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-12 animate-fade-in">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase">Focus Timer</h1>
        <p className="text-slate-500 font-bold">The secret to deep work is a focused mind.</p>
      </header>

      <div className="glass-panel p-10 flex flex-col items-center space-y-10 relative overflow-hidden bg-white/40">
        <div 
          className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-1000 ease-linear" 
          style={{ width: `${progress}%` }} 
        />

        <div className="flex flex-wrap justify-center gap-3 p-1.5 bg-slate-200/50 rounded-2xl">
          {[
            { id: 'study', label: 'Study', icon: Brain },
            { id: 'shortBreak', label: 'Break', icon: Coffee },
            { id: 'longBreak', label: 'Long Break', icon: Bell },
            { id: 'custom', label: 'Custom', icon: Settings2 }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                mode === m.id ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <m.icon size={14} />
              {m.label}
            </button>
          ))}
        </div>

        <div className="text-[120px] font-black tabular-nums text-slate-800 leading-none tracking-tighter drop-shadow-sm">
          {formatTime(timeLeft)}
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={resetTimer}
            className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <RotateCcw size={28} />
          </button>
          <button 
            onClick={toggleTimer}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${
              isActive 
                ? 'bg-amber-500 text-white shadow-amber-200' 
                : 'bg-indigo-600 text-white shadow-indigo-200'
            }`}
          >
            {isActive ? <Pause size={48} /> : <Play size={48} className="ml-2" />}
          </button>
          <button 
            onClick={isAlarmPlaying ? stopAlarm : playAlarm}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isAlarmPlaying 
                ? 'bg-red-500 text-white animate-pulse shadow-red-200' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Bell size={28} className={isAlarmPlaying ? 'animate-bounce' : ''} />
          </button>
        </div>
      </div>

      {isCustomModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs overflow-hidden animate-pop-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Custom Timer</h2>
              <button onClick={() => setIsCustomModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSetCustom} className="p-6 space-y-6 text-center">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Minutes</label>
                <div className="flex items-center justify-center gap-4">
                  <button type="button" onClick={() => setCustomMins(Math.max(1, customMins - 5))} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black">-</button>
                  <input 
                    type="number" 
                    value={customMins} 
                    onChange={e => setCustomMins(parseInt(e.target.value) || 1)}
                    className="w-20 text-center text-4xl font-black text-indigo-600 focus:outline-none"
                  />
                  <button type="button" onClick={() => setCustomMins(customMins + 5)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black">+</button>
                </div>
              </div>
              <button type="submit" className="w-full btn btn-primary py-3 font-bold text-sm">
                <Check size={20} /> Set Timer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
