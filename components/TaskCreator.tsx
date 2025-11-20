
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Target, Clock, Calendar, Save, Moon, CheckSquare, AlertCircle } from 'lucide-react';
import { Task, Goal, Subtask } from '../types';

interface TaskCreatorProps {
  onClose: () => void;
  onSave: (task: Task) => void;
  goals: Goal[];
  initialTask?: Task;
}

export const TaskCreator: React.FC<TaskCreatorProps> = ({ onClose, onSave, goals, initialTask }) => {
  // Get Local Today Date String (YYYY-MM-DD)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const [title, setTitle] = useState(initialTask?.title || '');
  const [category, setCategory] = useState(initialTask?.category || 'Work');
  const [importance, setImportance] = useState(initialTask?.importance || 5);
  const [urgency, setUrgency] = useState(initialTask?.urgency || 5);
  const [score, setScore] = useState(initialTask?.priorityScore || 5);
  const [selectedGoal, setSelectedGoal] = useState(initialTask?.goalId || '');
  const [duration, setDuration] = useState(initialTask?.duration || 30);
  const [startTime, setStartTime] = useState(initialTask?.startTime || '');
  const [date, setDate] = useState(initialTask?.date || todayStr);
  
  // Subtask State
  const [subtasks, setSubtasks] = useState<Subtask[]>(initialTask?.subtasks || []);
  const [subtaskInput, setSubtaskInput] = useState('');
  
  // Validation State
  const [timeError, setTimeError] = useState('');

  useEffect(() => {
    // Priority = (Importance * 0.6) + (Urgency * 0.4)
    const calculated = (importance * 0.6) + (urgency * 0.4);
    setScore(Number(calculated.toFixed(1)));
  }, [importance, urgency]);

  const isSleepTime = (timeStr: string) => {
      if (!timeStr) return false;
      const [h] = timeStr.split(':').map(Number);
      // Sleep Cycle: 23:00 (11 PM) to 06:00 (6 AM)
      return h >= 23 || h < 6;
  };

  const validateConfiguration = (d: string, t: string) => {
      if (!d) return '';
      
      // 1. Past Date Check
      if (d < todayStr) return 'Cannot schedule in the past';

      // 2. Past Time Check (if today)
      if (d === todayStr && t) {
          const currentNow = new Date();
          const currentMinutes = currentNow.getHours() * 60 + currentNow.getMinutes();
          const [h, m] = t.split(':').map(Number);
          const selectedMinutes = h * 60 + m;
          if (selectedMinutes < currentMinutes) return 'Cannot schedule time in the past';
      }

      // 3. Sleep Cycle Check
      if (t && isSleepTime(t)) {
          return 'Restricted: Sleep Cycle (23:00 - 06:00)';
      }
      
      return '';
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setDate(val);
      setTimeError(validateConfiguration(val, startTime));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setStartTime(val);
      setTimeError(validateConfiguration(date, val));
  };

  const handleAddSubtask = () => {
      if (!subtaskInput.trim()) return;
      const newSub: Subtask = {
          id: Date.now().toString(),
          title: subtaskInput,
          completed: false
      };
      setSubtasks([...subtasks, newSub]);
      setSubtaskInput('');
  };

  const handleRemoveSubtask = (id: string) => {
      setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    // Final Validation
    const error = validateConfiguration(date, startTime);
    if (error) {
        setTimeError(error);
        return;
    }
    
    const newTask: Task = {
      id: initialTask?.id || Date.now().toString(),
      title,
      completed: initialTask?.completed || false,
      category,
      importance,
      urgency,
      priorityScore: score,
      duration: duration,
      goalId: selectedGoal || undefined,
      startTime: startTime || undefined,
      date: date || undefined,
      subtasks: subtasks
    };

    onSave(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl bg-[#0A0A0F] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-['Outfit'] font-bold text-white">{initialTask ? 'Edit Task' : 'New Task'}</h2>
            <p className="text-gray-500 text-sm">Define parameters for execution.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Task Name</label>
                <input 
                    autoFocus
                    type="text" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Draft Q3 Strategy"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-white/30 outline-none transition-colors font-['Space_Grotesk'] font-medium"
                />
            </div>

             {/* Goal Linking */}
             <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2"><Target size={12} /> Link to Goal</label>
                <select
                    value={selectedGoal}
                    onChange={(e) => setSelectedGoal(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30 appearance-none"
                >
                    <option value="" className="bg-[#0A0A0F] text-gray-500">No Linked Goal</option>
                    {goals.map(g => (
                        <option key={g.id} value={g.id} className="text-white bg-[#0A0A0F]">{g.title}</option>
                    ))}
                </select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2"><Calendar size={12} /> Scheduled Date</label>
                <input 
                    type="date" 
                    min={todayStr}
                    value={date}
                    onChange={handleDateChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30 [color-scheme:dark]"
                />
            </div>

            {/* Duration & Time */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2"><Clock size={12} /> Duration (Min)</label>
                    <input 
                        type="number" 
                        value={duration}
                        onChange={e => setDuration(parseInt(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2">
                        <Clock size={12} /> Start Time
                    </label>
                    <input 
                        type="time" 
                        value={startTime}
                        onChange={handleTimeChange}
                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white outline-none transition-colors [color-scheme:dark]
                        ${timeError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/30'}`}
                    />
                </div>
            </div>
            
            {/* Error Message for Time/Date */}
            <AnimatePresence>
                {timeError && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 text-red-400 text-xs font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                    >
                        <AlertCircle size={14} />
                        {timeError}
                    </motion.div>
                )}
            </AnimatePresence>

             {/* Subtasks */}
             <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2"><CheckSquare size={12} /> Subtasks</label>
                <div className="flex gap-2">
                    <input 
                        value={subtaskInput}
                        onChange={(e) => setSubtaskInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                        placeholder="Add step..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-white/30"
                    />
                    <button onClick={handleAddSubtask} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 text-white"><Plus size={18} /></button>
                </div>
                <div className="space-y-2 mt-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                    {subtasks.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                            <span className="text-sm text-gray-300">{sub.title}</span>
                            <button onClick={() => handleRemoveSubtask(sub.id)} className="text-gray-500 hover:text-red-400"><X size={14} /></button>
                        </div>
                    ))}
                </div>
            </div>

             {/* Sliders */}
            <div className="space-y-6 pt-2">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-blue-400 font-bold">Importance</span>
                        <span className="text-white font-bold">{importance}/10</span>
                    </div>
                    <input 
                        type="range" min="1" max="10" step="1"
                        value={importance}
                        onChange={(e) => setImportance(parseFloat(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-orange-400 font-bold">Urgency</span>
                        <span className="text-white font-bold">{urgency}/10</span>
                    </div>
                    <input 
                        type="range" min="1" max="10" step="1"
                        value={urgency}
                        onChange={(e) => setUrgency(parseFloat(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-orange-500"
                    />
                </div>
            </div>
          </div>

          {/* Right: Visualization */}
          <div className="bg-white/5 rounded-3xl p-6 flex flex-col items-center justify-center relative border border-white/5">
             <div className="text-center mb-4">
                <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Calculated Priority</span>
             </div>
             
             {/* Gauge Visual */}
             <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/10" />
                    <circle 
                        cx="64" cy="64" r="56" 
                        stroke="currentColor" 
                        strokeWidth="12" 
                        fill="transparent" 
                        strokeDasharray={351}
                        strokeDashoffset={351 - (351 * score) / 10}
                        className={`transition-all duration-500 ease-out ${score > 7 ? 'text-orange-500' : score > 4 ? 'text-blue-500' : 'text-emerald-500'}`}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white font-['Outfit']">{score}</span>
                </div>
             </div>

             <div className="mt-6 w-full">
                 <div className="p-3 rounded-xl bg-white/5 text-xs text-gray-400 leading-relaxed border border-white/5">
                    <span className="text-white font-bold">Logic:</span> Priority is weighted: Importance (60%) + Urgency (40%).
                 </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-[#0A0A0F]">
            <button onClick={onClose} className="px-6 py-3 rounded-xl text-gray-500 hover:text-white transition-colors font-bold text-sm">Cancel</button>
            <button 
                onClick={handleSubmit}
                disabled={!title.trim() || !!timeError}
                className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
                {initialTask ? <Save size={18} /> : <Plus size={18} />}
                {initialTask ? 'Update Task' : 'Add Task'}
            </button>
        </div>
      </motion.div>
    </div>
  );
};
