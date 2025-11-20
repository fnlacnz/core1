
export enum AppView {
  LOGIN = 'LOGIN',
  OVERVIEW = 'OVERVIEW', // Formerly Dashboard
  GOALS = 'GOALS', // Formerly Big Picture
  TASKS = 'TASKS', // Formerly Planner
  REFLECTIONS = 'REFLECTIONS'
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number; // Calculated % based on linked tasks
  color: string;
  deadline: string; // ISO Date
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  goalId?: string; // Link to Goal
  importance: number; // 1-10
  urgency: number; // 1-10
  priorityScore: number; // Calculated (Importance + Urgency)
  duration: number; // minutes
  startTime?: string; // HH:mm format for scheduling
  date?: string; // YYYY-MM-DD format
  subtasks: Subtask[];
}

export interface UserState {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  focusMinutes: number;
  tasksCompleted: number;
  title: string;
  xp: number;
}

export interface Reflection {
  id: string;
  date: string;
  content: string;
  learning: string;
  preventiveMeasure: string;
}

export type AmbientSound = 'Silence' | 'Rain' | 'Forest' | 'Space' | 'Cafe' | 'Ocean';

export interface SkillNode {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
  level: number;
  maxLevel: number;
  status: 'locked' | 'unlocked' | 'mastered';
  cost: number;
  connections: string[];
}

export interface GuildMember {
  id: string;
  name: string;
  avatar: string;
  tasksCompleted: number;
  status: string;
  isUser?: boolean;
}
