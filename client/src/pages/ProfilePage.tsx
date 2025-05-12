import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePlan } from '../context/PlanContext';
import { User, Book, FileText, Award, Clock, CheckCircle, Settings, LogOut } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { currentPlan, getAttendancePercentage } = usePlan();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Not Logged In</h1>
            <p className="text-gray-600">
              Please log in to view your profile.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  const getCompletedTasksCount = () => {
    if (!currentPlan) return 0;
    
    return currentPlan.days.reduce((acc, day) => {
      return acc + day.tasks.filter(task => task.completed).length;
    }, 0);
  };
  
  const getTotalTasksCount = () => {
    if (!currentPlan) return 0;
    
    return currentPlan.days.reduce((acc, day) => {
      return acc + day.tasks.length;
    }, 0);
  };
  
  const getCompletedDaysCount = () => {
    if (!currentPlan) return 0;
    
    return currentPlan.days.filter(day => day.completed).length;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Profile
          </h1>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <User className="h-5 w-5" />
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {activeTab === 'profile' ? (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="bg-blue-100 rounded-full p-4 mb-4 md:mb-0 md:mr-6">
                  <User className="h-16 w-16 text-blue-600" />
                </div>
                
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-800">{currentUser.username}</h2>
                  <p className="text-gray-600">{currentUser.email}</p>
                  
                  {currentPlan && (
                    <div className="mt-3 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      <Book className="h-4 w-4 mr-1" />
                      Learning: {currentPlan.topic}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 md:mt-0 md:ml-auto">
                  <button
                    onClick={logout}
                    className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            {currentPlan && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Completed Tasks */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="font-semibold text-gray-800">Completed Tasks</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-800">{getCompletedTasksCount()}</span>
                    <span className="ml-1 text-gray-500">/ {getTotalTasksCount()}</span>
                  </div>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${getTotalTasksCount() > 0 ? (getCompletedTasksCount() / getTotalTasksCount()) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Attendance */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-semibold text-gray-800">Attendance</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-800">{getAttendancePercentage()}%</span>
                  </div>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getAttendancePercentage() >= 75 ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${getAttendancePercentage()}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Days Completed */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 text-amber-500 mr-2" />
                    <h3 className="font-semibold text-gray-800">Days Completed</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-800">{getCompletedDaysCount()}</span>
                    <span className="ml-1 text-gray-500">/ {currentPlan.days.length}</span>
                  </div>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full" 
                      style={{ width: `${(getCompletedDaysCount() / currentPlan.days.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Learning History */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                Learning History
              </h2>
              
              {currentPlan ? (
                <div className="space-y-4">
                  <div className="flex items-start border-l-2 border-blue-500 pl-4 pb-6">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Book className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-800">{currentPlan.topic}</h3>
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {currentPlan.level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Started on {new Date(currentPlan.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-2 text-sm">
                        <span className="text-green-600 font-medium">{getCompletedTasksCount()}</span>
                        <span className="text-gray-600"> tasks completed out of </span>
                        <span className="text-gray-700 font-medium">{getTotalTasksCount()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-center text-gray-600 italic text-sm">
                    Previous learning plans will appear here
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    You haven't started any learning plans yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    defaultValue={currentUser.username}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    defaultValue={currentUser.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled
                  />
                </div>
                
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
            
            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive updates about your progress</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 border-2 border-gray-300 rounded-full">
                    <input type="checkbox" id="email-toggle" className="sr-only" defaultChecked />
                    <span className="block absolute left-0 top-0 bottom-0 rounded-full w-1/2 h-full transform translate-x-full bg-blue-600"></span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Daily Reminders</h3>
                    <p className="text-sm text-gray-600">Reminder to complete your daily tasks</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 border-2 border-gray-300 rounded-full">
                    <input type="checkbox" id="reminder-toggle" className="sr-only" defaultChecked />
                    <span className="block absolute left-0 top-0 bottom-0 rounded-full w-1/2 h-full transform translate-x-full bg-blue-600"></span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Test Notifications</h3>
                    <p className="text-sm text-gray-600">Notifications about upcoming tests</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 border-2 border-gray-300 rounded-full">
                    <input type="checkbox" id="test-toggle" className="sr-only" defaultChecked />
                    <span className="block absolute left-0 top-0 bottom-0 rounded-full w-1/2 h-full transform translate-x-full bg-blue-600"></span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Save Notification Settings
                </button>
              </div>
            </div>
            
            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-red-500">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Danger Zone</h2>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <h3 className="font-medium text-red-800 mb-1">Delete Account</h3>
                  <p className="text-sm text-red-700 mb-3">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;