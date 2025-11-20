
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal, Task } from '../types';
import { Target, Plus, Calendar, CheckCircle, Edit2, Trash2, Save } from 'lucide-react';
import { Button } from '../components/Button';

interface BigPictureProps {
  goals: Goal[];
  tasks: Task[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

export const BigPicture: React.FC<BigPictureProps> = ({ goals, tasks, setGoals }) => {
  // Form State
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const handleSaveGoal = () => {
    if (!newGoalTitle.trim()) return;

    if (editingId) {
        // Update Existing
        setGoals(prev => prev.map(g => {
            if (g.id === editingId) {
                return { 
                    ...g, 
                    title: newGoalTitle, 
                    deadline: deadline || "No Deadline" 
                };
            }
            return g;
        }));
    } else {
        // Create New
        const newGoal: Goal = {
          id: Date.now().toString(),
          title: newGoalTitle,
          description: "Grand Objective",
          progress: 0,
          color: "bg-blue-500", 
          deadline: deadline || "No Deadline"
        };
        setGoals([...goals, newGoal]);
    }
    
    resetForm();
  };

  const startEdit = (goal: Goal) => {
      setNewGoalTitle(goal.title);
      setDeadline(goal.deadline === "No Deadline" ? "" : goal.deadline);
      setEditingId(goal.id);
      setIsFormOpen(true);
  };

  const deleteGoal = (id: string) => {
      if (confirm('Delete this goal? Linked tasks will remain but be unlinked.')) {
          setGoals(prev => prev.filter(g => g.id !== id));
          if (editingId === id) resetForm();
      }
  };

  const resetForm = () => {
      setNewGoalTitle('');
      setDeadline('');
      setEditingId(null);
      setIsFormOpen(false);
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="h-full p-6 md:p-8 overflow-y-auto custom-scrollbar bg-[#050508]"
    >
       <div className="flex justify-between items-end mb-8">
          <div>
              <h2 className="text-4xl font-bold text-white font-['Outfit'] tracking-tight">Goals</h2>
              <p className="text-gray-500 mt-1">Strategic Objectives & Milestones.</p>
          </div>
          <Button onClick={() => { resetForm(); setIsFormOpen(true); }}>
              <Plus size={18} /> New Goal
          </Button>
       </div>

       {/* Goal Form Input */}
       <AnimatePresence>
         {isFormOpen && (
             <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-8 overflow-hidden"
             >
                 <div className="bg-[#121217] p-6 rounded-2xl border border-white/10 shadow-lg space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Goal' : 'Define New Goal'}</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase font-bold">Goal Title</label>
                                <input 
                                    autoFocus
                                    value={newGoalTitle}
                                    onChange={(e) => setNewGoalTitle(e.target.value)}
                                    placeholder="e.g., Master Machine Learning"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-white/30 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase font-bold">Deadline</label>
                                <input 
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none [color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-4 border-t border-white/5">
                        <Button onClick={resetForm} variant="ghost" className="text-sm">Cancel</Button>
                        <Button onClick={handleSaveGoal} className="text-sm flex items-center gap-2">
                            <Save size={16} />
                            {editingId ? 'Save Changes' : 'Create Objective'}
                        </Button>
                    </div>
                 </div>
             </motion.div>
         )}
       </AnimatePresence>

       <div className="grid lg:grid-cols-2 gap-6 pb-24">
          {goals.map((goal, idx) => {
             const linkedTasks = tasks.filter(t => t.goalId === goal.id);
             const completedTasks = linkedTasks.filter(t => t.completed).length;
             
             // Progress calculation: Strictly based on linked tasks
             let calculatedProgress = 0;
             if (linkedTasks.length > 0) {
                 calculatedProgress = Math.round((completedTasks / linkedTasks.length) * 100);
             }
            
             // Colors based on index for visual variety
             const barColor = idx % 3 === 0 ? 'bg-blue-500' : idx % 3 === 1 ? 'bg-orange-500' : 'bg-emerald-500';
             const iconColor = idx % 3 === 0 ? 'text-blue-400 bg-blue-500/10' : idx % 3 === 1 ? 'text-orange-400 bg-orange-500/10' : 'text-emerald-400 bg-emerald-500/10';

             return (
                 <motion.div
                    key={goal.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative bg-[#121217] border border-white/10 rounded-3xl p-8 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all flex flex-col"
                 >
                     <div className="relative z-10 flex-1">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-xl ${iconColor}`}>
                                <Target size={24} />
                            </div>
                            
                            {/* Edit Controls */}
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(goal)} className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => deleteGoal(goal.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="text-right absolute top-8 right-8 group-hover:opacity-0 transition-opacity pointer-events-none">
                                <span className="text-4xl font-bold text-white font-['Space_Grotesk'] tracking-tight">{calculatedProgress}%</span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-1 font-['Outfit']">{goal.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 font-medium">
                            <span className="flex items-center gap-1"><CheckCircle size={14} /> {completedTasks} / {linkedTasks.length} Tasks</span>
                            <span className="flex items-center gap-1"><Calendar size={14} /> {goal.deadline}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${calculatedProgress}%` }}
                                transition={{ duration: 1 }}
                                className={`h-full ${barColor}`}
                            />
                        </div>
                     </div>
                 </motion.div>
             );
          })}

          {/* Empty State for Goals */}
          {goals.length === 0 && !isFormOpen && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-600">
                  <Target size={48} className="mb-4 opacity-50" />
                  <p>No goals initialized.</p>
              </div>
          )}
       </div>
    </motion.div>
  );
};
