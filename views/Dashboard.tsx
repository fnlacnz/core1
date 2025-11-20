import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { UserState, AppView, Goal, Task } from '../types';
import { Clock, ChevronLeft, ChevronRight, Calendar, Moon, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '../components/Button';

interface DashboardProps {
  user: UserState;
  activeGoals: Goal[];
  tasks: Task[];
  setView: (view: AppView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, activeGoals, tasks, setView }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pixelsPerMinute, setPixelsPerMinute] = useState(2.0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    const isToday = selectedDate.toDateString() === new Date().toDateString();
    if (scrollRef.current && isToday) {
       const now = new Date();
       const minutesFromStart = (now.getHours() - 6) * 60 + now.getMinutes();
       scrollRef.current.scrollTop = Math.max(0, minutesFromStart * pixelsPerMinute - 200);
    }
    return () => clearInterval(timer);
  }, [selectedDate, pixelsPerMinute]);

  // Generate next 14 days for calendar
  const calendarDays = Array.from({ length: 14 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
  });

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // Time Grid Config
  const START_HOUR = 6;
  const END_HOUR = 24; 

  // Helper to calculate position
  const getPosition = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      const totalMinutes = (h - START_HOUR) * 60 + m;
      return totalMinutes * pixelsPerMinute;
  };

  // Current Time Indicator Logic
  const currentMinutes = (currentTime.getHours() - START_HOUR) * 60 + currentTime.getMinutes();
  const currentTop = currentMinutes * pixelsPerMinute;
  const isToday = selectedDate.toDateString() === currentTime.toDateString();

  // Filter tasks for selected date
  const dailyTasks = tasks.filter(t => {
      if (!t.startTime || t.completed) return false;
      if (t.date) return t.date === formatDate(selectedDate);
      return false;
  });

  // Collision Detection & Lane Logic
  const processedTasks = dailyTasks
    .sort((a, b) => getPosition(a.startTime!) - getPosition(b.startTime!))
    .map(task => ({
        ...task,
        top: getPosition(task.startTime!),
        bottom: getPosition(task.startTime!) + (task.duration * pixelsPerMinute),
        lane: 0,
        totalLanes: 1
    }));

  // Assign Lanes
  for (let i = 0; i < processedTasks.length; i++) {
      for (let j = 0; j < i; j++) {
          if (processedTasks[i].top < processedTasks[j].bottom) {
              // Overlap detected
              if (processedTasks[i].lane === processedTasks[j].lane) {
                  processedTasks[i].lane++;
              }
          }
      }
  }

  // Calculate Max Lanes per Cluster to determine width
  for (let i = 0; i < processedTasks.length; i++) {
      let maxLane = processedTasks[i].lane;
      // Check siblings in same overlap cluster
      for (let j = 0; j < processedTasks.length; j++) {
          if (i !== j && processedTasks[i].top < processedTasks[j].bottom && processedTasks[j].top < processedTasks[i].bottom) {
             maxLane = Math.max(maxLane, processedTasks[j].lane);
          }
      }
      processedTasks[i].totalLanes = maxLane + 1;
  }

  return (
    <div className="h-full flex flex-col p-6 md:p-8 pb-24 overflow-hidden bg-[#050508]">
       {/* Header */}
       <header className="flex justify-between items-end mb-8 shrink-0">
          <div>
             <h1 className="text-4xl font-bold text-white font-['Outfit'] tracking-tight">Overview</h1>
             <p className="text-gray-500 mt-1 font-['Space_Grotesk']">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
           <div className="flex gap-3 items-center">
               <div className="text-right hidden md:block mr-2">
                   <p className="text-2xl font-bold text-white font-['Space_Grotesk']">{user.tasksCompleted} Tasks</p>
                   <p className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Completed Today</p>
               </div>
               <Button onClick={() => setView(AppView.TASKS)}>+ Task</Button>
           </div>
       </header>

       {/* Calendar & Timeline Container */}
       <div className="flex-1 relative bg-[#0A0A0F] border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black">
           
           {/* Horizontal Date Picker */}
           <div className="h-24 border-b border-white/5 flex items-center px-6 bg-[#0A0A0F] shrink-0 overflow-x-auto custom-scrollbar z-20">
               <div className="flex gap-3 min-w-full">
                   {calendarDays.map((date) => {
                       const isSelected = date.toDateString() === selectedDate.toDateString();
                       const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                       
                       return (
                           <button
                                key={date.toString()}
                                onClick={() => setSelectedDate(date)}
                                className={`flex flex-col items-center justify-center min-w-[60px] h-[60px] rounded-xl transition-all border ${
                                    isSelected 
                                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                                    : 'bg-white/5 text-gray-500 border-transparent hover:bg-white/10 hover:text-white'
                                }`}
                           >
                               <span className="text-[10px] uppercase font-bold tracking-wider">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                               <span className={`text-lg font-['Space_Grotesk'] font-bold ${isWeekend && !isSelected ? 'text-gray-600' : ''}`}>
                                   {date.getDate()}
                               </span>
                           </button>
                       )
                   })}
               </div>
           </div>

            {/* Zoom Controls */}
            <div className="absolute top-28 right-6 z-30 flex gap-2">
               <button onClick={() => setPixelsPerMinute(Math.max(1, pixelsPerMinute - 0.5))} className="p-2 bg-[#121217] border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"><ZoomOut size={16} /></button>
               <button onClick={() => setPixelsPerMinute(Math.min(4, pixelsPerMinute + 0.5))} className="p-2 bg-[#121217] border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"><ZoomIn size={16} /></button>
            </div>

           {/* Timeline Scrollable Area */}
           <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#0A0A0F]">
               
               {/* Grid Lines */}
               {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => {
                   const hour = START_HOUR + i;
                   return (
                       <div key={hour} className="absolute w-full border-t border-white/5 flex items-center" style={{ top: i * 60 * pixelsPerMinute, height: 60 * pixelsPerMinute }}>
                           <span className="absolute left-4 -top-3 text-xs font-mono font-bold text-gray-700">
                               {hour}:00
                           </span>
                       </div>
                   )
               })}

               {/* Current Time Line (Only if Today) */}
               {isToday && currentTop > 0 && currentTop < (END_HOUR - START_HOUR) * 60 * pixelsPerMinute && (
                   <div className="absolute w-full flex items-center z-20 pointer-events-none" style={{ top: currentTop }}>
                       <div className="w-2.5 h-2.5 rounded-full bg-red-500 ml-[50px] ring-2 ring-black"></div>
                       <div className="h-[2px] flex-1 bg-red-500"></div>
                   </div>
               )}

               {/* Tasks Layer */}
               <div className="relative ml-[60px] mr-4 h-full">
                   {dailyTasks.length === 0 && (
                       <div className="absolute top-20 left-0 right-0 text-center text-gray-600">
                           <p className="font-['Space_Grotesk']">No tasks scheduled.</p>
                       </div>
                   )}

                   {/* Sleep Cycle Block */}
                   <div 
                       className="absolute left-0 right-0 z-0"
                       style={{ 
                           top: getPosition("23:00"),
                           height: (END_HOUR - 23) * 60 * pixelsPerMinute
                       }}
                   >
                       <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-indigo-950/30 border-t border-indigo-500/20 flex items-center justify-center rounded-t-2xl relative overflow-hidden opacity-100">
                           <div className="flex flex-col items-center gap-2 text-indigo-200/50 z-10">
                               <Moon size={24} />
                               <span className="font-['Space_Grotesk'] text-sm font-bold tracking-widest uppercase">Sleep Cycle</span>
                               <span className="text-[10px] opacity-50">23:00 - 06:00</span>
                           </div>
                       </div>
                   </div>

                   {/* Render Tasks with Overlap Logic */}
                   {processedTasks.map(task => {
                       const height = Math.max(task.duration * pixelsPerMinute, 30);
                       const width = `${100 / task.totalLanes}%`;
                       const left = `${(task.lane / task.totalLanes) * 100}%`;
                       
                       const linkedGoal = activeGoals.find(g => g.id === task.goalId);
                       
                       // Solid colors for Dark style
                       const colors = [
                           'bg-blue-600 text-white border-blue-500',
                           'bg-orange-600 text-white border-orange-500',
                           'bg-emerald-600 text-white border-emerald-500',
                           'bg-purple-600 text-white border-purple-500',
                           'bg-gray-800 text-white border-gray-600'
                       ];
                       // Deterministic color based on title length or id
                       const colorIndex = task.title.length % colors.length;
                       const colorClass = colors[colorIndex];

                       return (
                           <motion.div
                               key={task.id}
                               initial={{ opacity: 0, scale: 0.95 }}
                               animate={{ opacity: 1, scale: 1 }}
                               className={`absolute rounded-lg p-3 border shadow-lg overflow-hidden hover:z-40 hover:scale-[1.02] transition-all cursor-pointer group flex flex-col justify-center ${colorClass}`}
                               style={{ 
                                   top: task.top, 
                                   height,
                                   width: `calc(${width} - 8px)`, // Gap
                                   left 
                               }}
                               onClick={() => setView(AppView.TASKS)}
                           >
                               <p className="font-bold text-xs md:text-sm line-clamp-1 leading-tight">{task.title}</p>
                               {height > 40 && (
                                   <div className="flex items-center gap-2 mt-1 opacity-80">
                                       <p className="text-[10px] flex items-center gap-1">
                                            <Clock size={10} /> {task.startTime} ({task.duration}m)
                                        </p>
                                        {linkedGoal && (
                                            <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 bg-black/20 rounded">
                                                {linkedGoal.title.substring(0, 3)}
                                            </span>
                                        )}
                                   </div>
                               )}
                           </motion.div>
                       )
                   })}
                   
                   {/* Spacer */}
                   <div style={{ height: (END_HOUR - START_HOUR) * 60 * pixelsPerMinute }} />
               </div>
           </div>
       </div>
    </div>
  );
};