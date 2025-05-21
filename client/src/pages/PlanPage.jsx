import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import ProgressCircle from '../components/ProgressCircle';

const PlanPage = () => {
  const { currentPlan, getAttendancePercentage } = usePlan();
  
  if (!currentPlan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">No Plan Found</h1>
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

  const getDaysCompletedPercentage = () => {
    const completedDays = currentPlan.days.filter(day => day.completed).length;
    return Math.round((completedDays / currentPlan.days.length) * 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Your Study Plan
        </h1>

        {/* Plan Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                Plan Overview
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Topic:</span>
                  <span className="font-medium text-gray-800">{currentPlan.topic}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium text-gray-800">{currentPlan.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-800">{currentPlan.duration} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Daily Time:</span>
                  <span className="font-medium text-gray-800">{currentPlan.timePerDay} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Locked Amount:</span>
                  <span className="font-medium text-gray-800">₹{currentPlan.lockedAmount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created On:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(currentPlan.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="flex space-x-6">
                <div className="flex flex-col items-center">
                  <ProgressCircle 
                    percentage={getDaysCompletedPercentage()} 
                    color="#3B82F6"
                    size={100}
                  >
                    <div className="text-center">
                      <span className="text-xl font-bold text-blue-600">{getDaysCompletedPercentage()}%</span>
                    </div>
                  </ProgressCircle>
                  <p className="mt-2 text-sm text-gray-600">Days Completed</p>
                </div>

                <div className="flex flex-col items-center">
                  <ProgressCircle 
                    percentage={getAttendancePercentage()} 
                    color="#10B981"
                    size={100}
                  >
                    <div className="text-center">
                      <span className="text-xl font-bold text-green-600">{getAttendancePercentage()}%</span>
                    </div>
                  </ProgressCircle>
                  <p className="mt-2 text-sm text-gray-600">Attendance</p>
                </div>
              </div>

              <Link
                to="/dashboard"
                className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Today's Tasks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Day-by-Day Plan */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="h-5 w-5 text-blue-600 mr-2" />
            Day-by-Day Plan
          </h2>

          <div className="space-y-4">
            {currentPlan.days.map((day) => (
              <div 
                key={day.day}
                className={`border rounded-lg p-4 ${
                  day.completed 
                    ? 'bg-green-50 border-green-200' 
                    : day.attendanceMarked 
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      day.completed 
                        ? 'bg-green-500 text-white' 
                        : day.attendanceMarked 
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {day.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        day.day
                      )}
                    </div>
                    <h3 className="font-medium text-gray-800">Day {day.day}</h3>
                  </div>

                  <div className="flex items-center">
                    {day.attendanceMarked && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Present
                      </span>
                    )}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Clock className="h-3 w-3 mr-1" />
                      {currentPlan.timePerDay} min
                    </span>
                  </div>
                </div>

                <div className="pl-11">
                  <ul className="space-y-1 text-sm text-gray-600">
                    {day.tasks.map((task, index) => (
                      <li key={index} className="flex items-center">
                        <span className={`w-4 h-4 rounded-full mr-2 ${
                          task.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}></span>
                        {task.title}
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          task.type === 'Lesson' ? 'bg-blue-100 text-blue-800' :
                          task.type === 'MCQ' ? 'bg-purple-100 text-purple-800' :
                          task.type === 'Interview' ? 'bg-amber-100 text-amber-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.type}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanPage;
