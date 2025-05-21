import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, CheckCircle, UserCheck, Calendar, ArrowRight } from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import ProgressCircle from '../components/ProgressCircle';
import TaskCard from '../components/TaskCard';
import AttendanceCamera from '../components/AttendanceCamera';

const Dashboard = () => {
  const { currentPlan, getCurrentDay, markTaskComplete, markAttendance, getAttendancePercentage } = usePlan();
  const [currentDayPlan, setCurrentDayPlan] = useState(getCurrentDay());
  const [showAttendanceCamera, setShowAttendanceCamera] = useState(false);

  useEffect(() => {
    setCurrentDayPlan(getCurrentDay());
  }, [currentPlan, getCurrentDay]);

  const handleTaskComplete = (taskId) => {
    if (currentDayPlan) {
      markTaskComplete(currentDayPlan.day - 1, taskId);
      setCurrentDayPlan(getCurrentDay());
    }
  };

  const handleAttendanceMarked = () => {
    if (currentDayPlan) {
      markAttendance(currentDayPlan.day - 1);
      setShowAttendanceCamera(false);
      setCurrentDayPlan(getCurrentDay());
    }
  };

  const getCompletedTasksPercentage = () => {
    if (!currentPlan) return 0;

    const totalTasks = currentPlan.days.reduce((acc, day) => acc + day.tasks.length, 0);
    const completedTasks = currentPlan.days.reduce((acc, day) => {
      return acc + day.tasks.filter(task => task.completed).length;
    }, 0);

    return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  };

  if (!currentPlan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to AI Classroom</h1>
            <p className="text-gray-600 mb-8">
              You don't have a study plan yet. Let's create one to start your learning journey!
            </p>
            <Link 
              to="/create-plan"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Create Study Plan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Progress */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
            <ProgressCircle percentage={getCompletedTasksPercentage()} color="#3B82F6">
              <div className="text-center">
                <span className="text-2xl font-bold text-blue-600">{getCompletedTasksPercentage()}%</span>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </ProgressCircle>
            <p className="mt-4 text-gray-600 text-sm text-center">
              Overall Progress: {getCompletedTasksPercentage()}% completed
            </p>
          </div>

          {/* Attendance */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
            <ProgressCircle percentage={getAttendancePercentage()} color="#10B981">
              <div className="text-center">
                <span className="text-2xl font-bold text-green-600">{getAttendancePercentage()}%</span>
                <p className="text-xs text-gray-500">Attendance</p>
              </div>
            </ProgressCircle>
            <p className="mt-4 text-gray-600 text-sm text-center">
              Attendance: {getAttendancePercentage()}% of days marked
            </p>
          </div>

          {/* Day Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-800">Current Day</h3>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Day {currentDayPlan?.day || 0}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Topic:</span>
              <span className="font-medium text-gray-800">{currentPlan.topic}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Level:</span>
              <span className="font-medium text-gray-800">{currentPlan.level}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm">Time Per Day:</span>
              <span className="font-medium text-gray-800">{currentPlan.timePerDay} min</span>
            </div>

            {/* Attendance Button */}
            {currentDayPlan && !currentDayPlan.attendanceMarked ? (
              <button
                onClick={() => setShowAttendanceCamera(true)}
                className="w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors duration-200"
              >
                <UserCheck className="mr-2 h-5 w-5" />
                Mark Attendance
              </button>
            ) : (
              <div className="flex items-center text-green-600 text-sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                Attendance already marked
              </div>
            )}
          </div>
        </div>

        {showAttendanceCamera && (
          <div className="mb-8">
            <AttendanceCamera onAttendanceMarked={handleAttendanceMarked} />
          </div>
        )}

        {/* Today's Tasks */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <ClipboardList className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Today's Tasks</h2>
          </div>

          {currentDayPlan && currentDayPlan.tasks.length > 0 ? (
            <div className="space-y-4">
              {currentDayPlan.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={() => handleTaskComplete(task.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-600">No tasks scheduled for today.</p>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Link
            to="/plan"
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            View Full Plan
          </Link>

          <Link
            to="/tasks"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            All Tasks
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
