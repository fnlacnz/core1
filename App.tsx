import React, { useState } from 'react';
import { AuroraBackground } from './components/AuroraBackground';
import { Sidebar } from './components/Sidebar';
import { Navigation } from './components/Navigation';
import { SprintOverlay } from './components/SprintOverlay';
import { Login } from './views/Login';
import { Dashboard } from './views/Dashboard';
import { BigPicture } from './views/BigPicture';
import { Planner } from './views/Planner';
import { Reflections } from './views/Reflections';
import { AppView, UserState, Task, Goal, Reflection } from './types';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  // -- Authentication --
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // -- Global App State --
  const [currentView, setView] = useState<AppView>(AppView.OVERVIEW);
  const [isSprintOpen, setIsSprintOpen] = useState(false);
  
  // -- User Data (Starts at 0) --
  const [user, setUser] = useState<UserState>({
    id: 'user-1',
    name: "Operator",
    avatar: "👨‍🚀",
    streak: 0,
    focusMinutes: 0,
    tasksCompleted: 0,
    xp: 0,
    title: "Initiate"
  });

  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);

  // -- Logic: Task Management --
  const handleToggleTask = (taskId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const isCompleting = !task.completed;
      
      // 1. Update Task State
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: isCompleting } : t));

      // 2. Update User Stats
      setUser(prev => ({
          ...prev,
          tasksCompleted: isCompleting ? prev.tasksCompleted + 1 : Math.max(0, prev.tasksCompleted - 1),
      }));
  };

  const handleAddTask = (task: Task) => {
      setTasks(prev => [...prev, task]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleLogin = () => {
      setIsLoggedIn(true);
      setView(AppView.OVERVIEW);
  };

  const handleSprintComplete = (minutes: number) => {
      setUser(prev => ({
          ...prev,
          focusMinutes: prev.focusMinutes + minutes,
      }));
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.OVERVIEW:
        return <Dashboard user={user} activeGoals={goals} tasks={tasks} setView={setView} />;
      case AppView.GOALS:
        return <BigPicture goals={goals} tasks={tasks} setGoals={setGoals} />;
      case AppView.TASKS:
        return <Planner 
            tasks={tasks} 
            setTasks={setTasks} 
            goals={goals} 
            onToggleTask={handleToggleTask} 
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask} 
        />;
      case AppView.REFLECTIONS:
        return <Reflections reflections={reflections} setReflections={setReflections} />;
      default:
        return <Dashboard user={user} activeGoals={goals} tasks={tasks} setView={setView} />;
    }
  };

  return (
    <div className="relative w-full h-screen text-white font-sans selection:bg-white selection:text-black overflow-hidden flex bg-[#050508]">
      <AuroraBackground />
      
      {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
      ) : (
        <>
          {/* Sidebar */}
          <Sidebar 
            currentView={currentView} 
            setView={setView} 
            onToggleSprint={() => setIsSprintOpen(true)} 
          />
          
          {/* Mobile Navigation */}
          <div className="md:hidden">
             <Navigation currentView={currentView} setView={setView} />
          </div>
          
          {/* Main Content Area */}
          <main className="relative z-10 flex-1 h-full flex flex-col md:ml-64 transition-all duration-300">
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.01 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="h-full"
                >
                  {renderView()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          {/* Global Sprint Overlay */}
          <SprintOverlay 
            isOpen={isSprintOpen} 
            onClose={() => setIsSprintOpen(false)}
            onComplete={handleSprintComplete}
          />
        </>
      )}
    </div>
  );
};

export default App;