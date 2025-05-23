import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, CheckCircle, UserCheck, Calendar, ArrowRight, Clock, Brain } from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import ProgressCircle from '../components/ProgressCircle';
// import TaskCard from '../components/TaskCard';
import AttendanceCamera from '../components/AttendanceCamera';
// import { plan } from "../utils/planmockdata.js";

// Import the plan data (assuming it's accessible here)
// If not, you should import it from your actual data source
import { plan } from "../utils/planmockdata.jsx";

const Dashboard = () => {
  const { currentPlan, getCurrentDay, markTaskComplete, markAttendance, getAttendancePercentage } = usePlan();
  const [currentDayPlan, setCurrentDayPlan] = useState(getCurrentDay());
  const [showAttendanceCamera, setShowAttendanceCamera] = useState(false);
  
  useEffect(() => {
    setCurrentDayPlan(getCurrentDay());
  }, [currentPlan, getCurrentDay]);
  
  const handleTaskComplete = (taskIndex) => {
    // This would need to be updated to work with your actual implementation
    console.log("Task completed:", taskIndex);
  };
  
  const handleAttendanceMarked = () => {
    if (currentDayPlan) {
      markAttendance(currentDayPlan.day - 1);
      setShowAttendanceCamera(false);
      // Update current day plan
      setCurrentDayPlan(getCurrentDay());
    }
  };
  
  // Calculate completed tasks percentage - using the original function for compatibility
  const getCompletedTasksPercentage = () => {
    if (!currentPlan) return 0;
    
    const totalTasks = currentPlan.days.reduce((acc, day) => acc + day.tasks.length, 0);
    const completedTasks = currentPlan.days.reduce((acc, day) => {
      return acc + day.tasks.filter(task => task.completed).length;
    }, 0);
    
    return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  };
  
  // Get day 1 from the plan data
  const day1 = plan.length > 0 ? plan[0] : null;
  
  if (!currentPlan && !day1) {
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Your Dashboard
        </h1>
        
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 flex items-center">
                <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                Day {day1 ? day1.day : 1}
              </h2>
              <button
                onClick={() => setShowAttendanceCamera(true)}
                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full hover:bg-green-200 transition-colors duration-200"
              >
                <UserCheck className="h-4 w-4 mr-1" />
                Mark Attendance
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Tasks:</span>
                <span className="font-medium text-gray-800">{day1 ? day1.tasks.length : 0}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Duration:</span>
                <span className="font-medium text-gray-800">
                  {day1 ? day1.tasks.reduce((total, task) => {
                    const duration = parseInt(task.duration);
                    return isNaN(duration) ? total : total + duration;
                  }, 0) : 0} min
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {showAttendanceCamera && (
          <div className="mb-8">
            <AttendanceCamera onAttendanceMarked={handleAttendanceMarked} />
          </div>
        )}
        
        {/* Today's Tasks - Using Day 1 data */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <ClipboardList className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Today's Tasks</h2>
          </div>
          
          {day1 && day1.tasks.length > 0 ? (
            <div className="space-y-4">
              {day1.tasks.map((task, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full mr-2 ${
                          task.type === 'lesson' ? 'bg-blue-100 text-blue-800' :
                          task.type === 'mcq' ? 'bg-purple-100 text-purple-800' :
                          task.type === 'technical-interview' ? 'bg-amber-100 text-amber-800' :
                          task.type === 'behavioral-interview' ? 'bg-pink-100 text-pink-800' :
                          task.type === 'system-design' ? 'bg-indigo-100 text-indigo-800' :
                          task.type === 'whiteboard-interview' ? 'bg-red-100 text-red-800' :
                          task.type === 'case-study' ? 'bg-green-100 text-green-800' :
                          task.type === 'mock-interview' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                        <h3 className="font-medium text-gray-800">{task.subtopic}</h3>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {task.duration}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleTaskComplete(index)}
                      className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <Brain className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{task.type === 'lesson' ? 'Study Material' : 'Practice Task'}</span>
                    </div>
                    
                    <Link
                      to={`/task/${index}`}
                      className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-md hover:bg-blue-100 transition-colors duration-200"
                    >
                      Start Task
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-600">No tasks scheduled for today.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
         
          
          <Link
            to="/tasks"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            View Full Plan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;