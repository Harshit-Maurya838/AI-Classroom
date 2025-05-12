import React, { createContext, useState, useContext, useEffect } from 'react';
import { StudyPlan, DayPlan, Task } from '../types';
import { generateMockStudyPlan } from '../utils/mockData';
import { useAuth } from './AuthContext';

interface PlanContextType {
  currentPlan: StudyPlan | null;
  createPlan: (topic: string, level: 'Beginner' | 'Intermediate' | 'Advanced', timePerDay: number, duration: number, lockedAmount: number) => void;
  getCurrentDay: () => DayPlan | null;
  markTaskComplete: (dayIndex: number, taskId: string) => void;
  markAttendance: (dayIndex: number) => void;
  getAttendancePercentage: () => number;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Load plan from localStorage
    if (currentUser) {
      const storedPlan = localStorage.getItem(`plan-${currentUser.id}`);
      if (storedPlan) {
        setCurrentPlan(JSON.parse(storedPlan));
      }
    }
  }, [currentUser]);

  const createPlan = (
    topic: string,
    level: 'Beginner' | 'Intermediate' | 'Advanced',
    timePerDay: number,
    duration: number,
    lockedAmount: number
  ) => {
    if (!currentUser) return;
    
    const newPlan = generateMockStudyPlan(
      topic,
      level,
      timePerDay,
      duration,
      lockedAmount,
      currentUser.id
    );
    
    setCurrentPlan(newPlan);
    localStorage.setItem(`plan-${currentUser.id}`, JSON.stringify(newPlan));
  };

  const getCurrentDay = (): DayPlan | null => {
    if (!currentPlan) return null;
    
    const planStartDate = new Date(currentPlan.createdAt);
    const currentDate = new Date();
    
    // Calculate days since plan started
    const diffTime = Math.abs(currentDate.getTime() - planStartDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Get the current day's plan (0-indexed in the array)
    const currentDayIndex = diffDays - 1;
    
    // If we're within the plan duration, return that day's plan
    if (currentDayIndex >= 0 && currentDayIndex < currentPlan.days.length) {
      return currentPlan.days[currentDayIndex];
    }
    
    // If we're past the plan, return the last day
    if (currentDayIndex >= currentPlan.days.length) {
      return currentPlan.days[currentPlan.days.length - 1];
    }
    
    // Fallback to day 1
    return currentPlan.days[0];
  };

  const markTaskComplete = (dayIndex: number, taskId: string) => {
    if (!currentPlan || !currentUser) return;
    
    const updatedPlan = { ...currentPlan };
    const day = updatedPlan.days[dayIndex];
    
    if (!day) return;
    
    // Find the task and mark it complete
    const taskIndex = day.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      day.tasks[taskIndex].completed = true;
    }
    
    // Check if all tasks are completed
    const allTasksCompleted = day.tasks.every(task => task.completed);
    if (allTasksCompleted) {
      day.completed = true;
    }
    
    setCurrentPlan(updatedPlan);
    localStorage.setItem(`plan-${currentUser.id}`, JSON.stringify(updatedPlan));
  };

  const markAttendance = (dayIndex: number) => {
    if (!currentPlan || !currentUser) return;
    
    const updatedPlan = { ...currentPlan };
    const day = updatedPlan.days[dayIndex];
    
    if (!day) return;
    
    day.attendanceMarked = true;
    
    setCurrentPlan(updatedPlan);
    localStorage.setItem(`plan-${currentUser.id}`, JSON.stringify(updatedPlan));
  };

  const getAttendancePercentage = (): number => {
    if (!currentPlan) return 0;
    
    const daysWithAttendance = currentPlan.days.filter(day => day.attendanceMarked).length;
    const totalDaysElapsed = Math.min(
      currentPlan.days.length,
      Math.ceil(
        Math.abs(new Date().getTime() - new Date(currentPlan.createdAt).getTime()) / 
        (1000 * 60 * 60 * 24)
      )
    );
    
    return totalDaysElapsed === 0 ? 0 : Math.round((daysWithAttendance / totalDaysElapsed) * 100);
  };

  return (
    <PlanContext.Provider value={{ 
      currentPlan, 
      createPlan, 
      getCurrentDay, 
      markTaskComplete, 
      markAttendance,
      getAttendancePercentage
    }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = (): PlanContextType => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};