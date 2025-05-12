export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // Note: In a real app, you'd never store plain text passwords
}

export interface StudyPlan {
  id: string;
  userId: string;
  topic: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  timePerDay: number; // in minutes
  duration: number; // in days
  lockedAmount: number;
  createdAt: Date;
  days: DayPlan[];
}

export interface DayPlan {
  day: number;
  completed: boolean;
  attendanceMarked: boolean;
  tasks: Task[];
}

export interface Task {
  id: string;
  type: 'Lesson' | 'MCQ' | 'Interview' | 'Revision';
  title: string;
  description: string;
  completed: boolean;
  content?: string;
  videoUrl?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  revisionDates: Date[];
}

export interface Test {
  id: string;
  title: string;
  description: string;
  questions: MCQQuestion[];
  dueDate: Date;
  completed: boolean;
  score?: number;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
}

export interface Interview {
  id: string;
  title: string;
  description: string;
  questions: string[];
  dueDate: Date;
  completed: boolean;
  feedback?: string;
}

export interface Wallet {
  userId: string;
  lockedAmount: number;
  attendancePercentage: number;
  refundStatus: 'Pending' | 'Eligible' | 'Ineligible' | 'Refunded';
}