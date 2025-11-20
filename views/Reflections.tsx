import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reflection } from '../types';
import { Button } from '../components/Button';
import { Zap, Activity, Edit3, Save, X } from 'lucide-react';

interface ReflectionsProps {
  reflections: Reflection[];
  setReflections: React.Dispatch<React.SetStateAction<Reflection[]>>;
}

export const Reflections: React.FC<ReflectionsProps> = ({ reflections, setReflections }) => {
  // Create Mode State
  const [content, setContent] = useState('');
  const [learning, setLearning] = useState('');
  const [preventive, setPreventive] = useState('');

  // Edit Mode State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editLearning, setEditLearning] = useState('');
  const [editPreventive, setEditPreventive] = useState('');

  const handlePost = () => {
    if (!content.trim()) return;
    
    const entry: Reflection = {
        id: Date.now().toString(),
        content,
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
        learning,
        preventiveMeasure: preventive
    };

    setReflections(prev => [entry, ...prev]);
    setContent('');
    setLearning('');
    setPreventive('');
  };

  const startEdit = (ref: Reflection) => {
      setEditingId(ref.id);
      setEditContent(ref.content);
      setEditLearning(ref.learning);
      setEditPreventive(ref.preventiveMeasure);
  };

  const cancelEdit = () => {
      setEditingId(null);
  };

  const saveEdit = () => {
      setReflections(prev => prev.map(r => {
          if (r.id === editingId) {
              return {
                  ...r,
                  content: editContent,
                  learning: editLearning,
                  preventiveMeasure: editPreventive
              }
          }
          return r;
      }));
      setEditingId(null);
  };

  const deleteReflection = (id: string) => {
      setReflections(prev => prev.filter(r => r.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="h-full p-6 md:p-8 flex flex-col overflow-y-auto custom-scrollbar bg-[#050508]"
    >
      <div className="mb-8">
         <h2 className="text-4xl font-bold text-white font-['Outfit'] tracking-tight">Logbook</h2>
         <p className="text-gray-500 mt-1">Daily operational records.</p>
      </div>

      {/* Input Area */}
      <div className="bg-[#121217] border border-white/10 rounded-3xl p-8 mb-12 shadow-lg">
        <div className="space-y-6">
            <div>
                <label className="text-xs uppercase font-bold text-gray-500 mb-2 block tracking-widest">Entry</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Log events, outcomes, and observations..."
                    className="w-full bg-white/5 border border-white/5 rounded-xl p-4 min-h-[100px] outline-none text-white placeholder-gray-600 focus:border-white/20 transition-colors font-medium"
                />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                     <label className="text-xs uppercase font-bold text-gray-500 mb-2 block tracking-widest">Data Point / Learning</label>
                     <input 
                        value={learning}
                        onChange={(e) => setLearning(e.target.value)}
                        placeholder="Key takeaway?"
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none text-white focus:border-white/20 transition-colors placeholder-gray-600"
                     />
                </div>
                <div>
                     <label className="text-xs uppercase font-bold text-gray-500 mb-2 block tracking-widest">Preventive Measure</label>
                     <input 
                        value={preventive}
                        onChange={(e) => setPreventive(e.target.value)}
                        placeholder="Actionable fix?"
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none text-white focus:border-white/20 transition-colors placeholder-gray-600"
                     />
                </div>
            </div>
            
            <div className="flex justify-end">
                <Button onClick={handlePost} disabled={!content.trim()}>
                    Commit Entry
                </Button>
            </div>
        </div>
      </div>

      {/* History */}
      <div className="space-y-6 pb-24">
          {reflections.map((ref) => (
              <motion.div 
                layout
                key={ref.id} 
                className="bg-[#121217] border border-white/10 rounded-2xl p-8 shadow-md group hover:border-white/20 transition-all"
              >
                  {editingId === ref.id ? (
                      /* Edit Mode View */
                      <div className="space-y-4">
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Editing Entry</span>
                          </div>
                          <textarea 
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-white/30"
                            rows={3}
                          />
                          <div className="grid grid-cols-2 gap-4">
                              <input 
                                value={editLearning}
                                onChange={(e) => setEditLearning(e.target.value)}
                                placeholder="Learning"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-white/30"
                              />
                              <input 
                                value={editPreventive}
                                onChange={(e) => setEditPreventive(e.target.value)}
                                placeholder="Preventive"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-white/30"
                              />
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
                              <Button variant="ghost" onClick={cancelEdit} className="text-xs">Cancel</Button>
                              <Button onClick={saveEdit} className="text-xs">Save Changes</Button>
                          </div>
                      </div>
                  ) : (
                      /* Display Mode View */
                      <div className="flex flex-col gap-4 relative">
                          <div className="flex justify-between items-start">
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{ref.date}</span>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                  <button onClick={() => startEdit(ref)} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white"><Edit3 size={16} /></button>
                                  <button onClick={() => deleteReflection(ref.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400"><X size={16} /></button>
                              </div>
                          </div>
                          <p className="text-gray-200 text-lg leading-relaxed font-medium">{ref.content}</p>
                          
                          {(ref.learning || ref.preventiveMeasure) && (
                              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5 mt-2">
                                  {ref.learning && (
                                      <div>
                                          <p className="text-gray-500 font-bold text-[10px] mb-1 tracking-wider">DATA POINT</p>
                                          <p className="text-gray-400 text-sm">{ref.learning}</p>
                                      </div>
                                  )}
                                  {ref.preventiveMeasure && (
                                       <div>
                                          <p className="text-gray-500 font-bold text-[10px] mb-1 tracking-wider">OPTIMIZATION</p>
                                          <p className="text-gray-400 text-sm">{ref.preventiveMeasure}</p>
                                      </div>
                                  )}
                              </div>
                          )}
                      </div>
                  )}
              </motion.div>
          ))}
      </div>
    </motion.div>
  );
};