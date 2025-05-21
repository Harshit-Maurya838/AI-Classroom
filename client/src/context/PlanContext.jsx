import React, { createContext, useState, useContext, useEffect } from 'react';
import { generateMockStudyPlan } from '../utils/mockData';
import { useAuth } from './AuthContext';

const PlanContext = createContext(undefined);

export const PlanProvider = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const storedPlan = localStorage.getItem(`plan-${currentUser.id}`);
      if (storedPlan) {
        setCurrentPlan(JSON.parse(storedPlan));
      }
    }
  }, [currentUser]);

  const createPlan = (topic, level, timePerDay, duration, lockedAmount) => {
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

  const getCurrentDay = () => {
    if (!currentPlan) return null;

    const planStartDate = new Date(currentPlan.createdAt);
    const currentDate = new Date();

    const diffTime = Math.abs(currentDate.getTime() - planStartDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const currentDayIndex = diffDays;

    if (currentDayIndex >= 0 && currentDayIndex < currentPlan.days.length) {
      return currentPlan.days[currentDayIndex];
    }

    if (currentDayIndex >= currentPlan.days.length) {
      return currentPlan.days[currentPlan.days.length - 1];
    }

    return currentPlan.days[0];
  };

  const markTaskComplete = (dayIndex, taskId) => {
    if (!currentPlan || !currentUser) return;

    const updatedPlan = JSON.parse(JSON.stringify(currentPlan));
    const day = updatedPlan.days[dayIndex];

    if (!day) return;

    const taskIndex = day.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      day.tasks[taskIndex].completed = true;
    }

    const allTasksCompleted = day.tasks.every(task => task.completed);
    if (allTasksCompleted) {
      day.completed = true;
    }

    setCurrentPlan(updatedPlan);
    localStorage.setItem(`plan-${currentUser.id}`, JSON.stringify(updatedPlan));
  };

  const markAttendance = (dayIndex) => {
    if (!currentPlan || !currentUser) return;

    const updatedPlan = JSON.parse(JSON.stringify(currentPlan));
    const day = updatedPlan.days[dayIndex];

    if (!day) return;

    day.attendanceMarked = true;

    setCurrentPlan(updatedPlan);
    localStorage.setItem(`plan-${currentUser.id}`, JSON.stringify(updatedPlan));
  };

  const getAttendancePercentage = () => {
    if (!currentPlan) return 0;

    const daysWithAttendance = currentPlan.days.filter(day => day.attendanceMarked).length;

    const totalDaysElapsed = Math.min(
      currentPlan.days.length,
      Math.floor(
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

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};
