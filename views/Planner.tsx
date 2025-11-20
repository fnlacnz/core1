
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, Goal } from '../types';
import { Button } from '../components/Button';
import { Plus, CheckCircle2, Trash2, Calendar, Target, Edit2, Clock, Circle, CheckSquare } from 'lucide-react';
import { TaskCreator } from '../components/TaskCreator';

interface PlannerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  goals: Goal[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
}

export const Planner: React.FC<PlannerProps> = ({ tasks, setTasks, goals, onToggleTask, onAddTask, onUpdateTask }) => {
  const [showTaskCreator, setShowTaskCreator] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const deleteTask = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleEditClick = (e: React.MouseEvent, task: Task) => {
      e.stopPropagation();
      setEditingTask(task);
      setShowTaskCreator(true);
  };

  const handleCloseCreator = () => {
      setShowTaskCreator(false);
      setEditingTask(null);
  };

  const handleSaveTask = (task: Task) => {
      if (editingTask) {
          onUpdateTask(task);
      } else {
          onAddTask(task);
      }
  };

  const handleToggleSubtask = (e: React.MouseEvent, taskId: string, subtaskId: string) => {
      e.stopPropagation();
      const task = tasks.find(t => t.id === taskId);
      if (!task || !task.subtasks) return;

      const updatedSubtasks = task.subtasks.map(s => 
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
      );

      onUpdateTask({ ...task, subtasks: updatedSubtasks });
  };

  // Sort by Priority Score
  const sortedTasks = [...tasks].sort((a, b) => b.priorityScore - a.priorityScore);

  return (
    <div className="h-full flex flex-col p-6 md:p-8 relative bg-[#050508]">
      <AnimatePresence>
        {showTaskCreator && (
            <TaskCreator 
                onClose={handleCloseCreator} 
                onSave={handleSaveTask} 
                goals={goals} 
                initialTask={editingTask || undefined}
            />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
            <h2 className="text-4xl font-bold text-white font-['Outfit'] tracking-tight">Tasks</h2>
            <p className="text-gray-500 mt-1">Execute high-priority items.</p>
        </div>
        <Button onClick={() => setShowTaskCreator(true)} className="bg-white text-black shadow-xl shadow-white/10">
            <Plus size={18} />
            New Task
        </Button>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-24">
         {sortedTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[400px] text-center opacity-40">
                <Target size={48} className="mb-4 text-gray-600" />
                <h3 className="text-xl font-bold text-gray-400">No active tasks</h3>
                <p className="text-gray-600">Initialize a new task to begin.</p>
            </div>
         )}

         <AnimatePresence>
            {sortedTasks.map((task, idx) => {
                const linkedGoal = goals.find(g => g.id === task.goalId);
                const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
                const totalSubtasks = task.subtasks?.length || 0;

                return (
                <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => onToggleTask(task.id)}
                    className={`group relative rounded-2xl transition-all duration-200 cursor-pointer border
                    ${task.completed 
                        ? 'bg-white/5 border-white/5 opacity-50' 
                        : 'bg-[#121217] border-white/10 hover:border-white/20 hover:bg-[#18181f]'
                    }
                    `}
                >
                    <div className="p-5 flex items-start gap-5">
                        {/* Priority Badge */}
                        <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border text-lg font-bold font-['Space_Grotesk'] shrink-0 ${
                            task.priorityScore > 7 ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                            task.priorityScore > 4 ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                            'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        }`}>
                            {task.priorityScore}
                        </div>

                        <div className="flex-1">
                            <h3 className={`text-lg font-bold mb-1 font-['Outfit'] ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                                {task.title}
                            </h3>
                            
                            <div className="flex flex-wrap gap-3 text-xs text-gray-500 items-center font-medium mb-3">
                                {linkedGoal && (
                                    <span className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                                        <Target size={10} /> {linkedGoal.title}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} /> {task.date || 'No Date'}
                                </span>
                                {task.startTime && (
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} /> {task.startTime} ({task.duration}m)
                                    </span>
                                )}
                                {totalSubtasks > 0 && (
                                     <span className="flex items-center gap-1 text-gray-400">
                                        <CheckSquare size={12} /> {completedSubtasks}/{totalSubtasks}
                                     </span>
                                )}
                            </div>

                            {/* Subtasks Section */}
                            {task.subtasks && task.subtasks.length > 0 && !task.completed && (
                                <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                                    {task.subtasks.map(sub => (
                                        <button
                                            key={sub.id}
                                            onClick={(e) => handleToggleSubtask(e, task.id, sub.id)}
                                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white w-full text-left group/sub"
                                        >
                                            <div className={`transition-colors ${sub.completed ? 'text-emerald-500' : 'text-gray-600 group-hover/sub:text-gray-400'}`}>
                                                {sub.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                            </div>
                                            <span className={sub.completed ? 'line-through text-gray-600' : ''}>{sub.title}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-700 group-hover:border-emerald-500 text-transparent'
                            }`}>
                                <CheckCircle2 size={12} fill="currentColor" className={!task.completed ? "hidden" : ""} />
                            </div>
                            
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                                <button onClick={(e) => handleEditClick(e, task)} className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={(e) => deleteTask(e, task.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )})}
         </AnimatePresence>
      </div>
    </div>
  );
};
