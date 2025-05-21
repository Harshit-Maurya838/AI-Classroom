import React, { useState } from 'react';
import { usePlan } from '../context/PlanContext';
import TaskCard from '../components/TaskCard';
import { Calendar, Filter, X } from 'lucide-react';

const TasksPage = () => {
  const { currentPlan, markTaskComplete } = usePlan();
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  if (!currentPlan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">No Plan Found</h1>
            <p className="text-gray-600">
              You need to create a study plan first before you can see tasks.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const allTasks = currentPlan.days.flatMap(day => 
    day.tasks.map(task => ({
      ...task,
      dayIndex: day.day - 1,
      dayNumber: day.day,
    }))
  );

  const filteredTasks = allTasks.filter(task => {
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'pending' && task.completed) return false;
    if (typeFilter && task.type !== typeFilter) return false;
    return true;
  });

  const taskTypes = Array.from(new Set(allTasks.map(task => task.type)));

  const handleMarkComplete = (dayIndex, taskId) => {
    markTaskComplete(dayIndex, taskId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Tasks</h1>

          <div className="relative inline-block">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-1" />
              {filter === 'all' ? 'All Tasks' : filter === 'completed' ? 'Completed' : 'Pending'}
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setFilter('all');
                      setShowFilterMenu(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    All Tasks
                  </button>
                  <button
                    onClick={() => {
                      setFilter('completed');
                      setShowFilterMenu(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => {
                      setFilter('pending');
                      setShowFilterMenu(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Pending
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setTypeFilter(null)}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              typeFilter === null
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Types
          </button>

          {taskTypes.map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(typeFilter === type ? null : type)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                typeFilter === type
                  ? type === 'Lesson' ? 'bg-blue-100 text-blue-800' :
                    type === 'MCQ' ? 'bg-purple-100 text-purple-800' :
                    type === 'Interview' ? 'bg-amber-100 text-amber-800' :
                    'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
              {typeFilter === type && (
                <X className="h-3 w-3 ml-2" onClick={() => setTypeFilter(null)} />
              )}
            </button>
          ))}
        </div>

        {(filter !== 'all' || typeFilter) && (
          <div className="flex items-center mb-4 bg-gray-50 p-3 rounded-md">
            <span className="text-sm text-gray-600 mr-2">Active filters:</span>
            <div className="flex gap-2">
              {filter !== 'all' && (
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center">
                  {filter === 'completed' ? 'Completed' : 'Pending'}
                  <button className="ml-1" onClick={() => setFilter('all')}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {typeFilter && (
                <div className={`px-2 py-1 rounded-md text-xs flex items-center ${
                  typeFilter === 'Lesson' ? 'bg-blue-100 text-blue-800' :
                  typeFilter === 'MCQ' ? 'bg-purple-100 text-purple-800' :
                  typeFilter === 'Interview' ? 'bg-amber-100 text-amber-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {typeFilter}
                  <button className="ml-1" onClick={() => setTypeFilter(null)}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <button 
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setFilter('all');
                  setTypeFilter(null);
                }}
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div key={task.id} className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  Day {task.dayNumber}
                </div>
                <TaskCard
                  task={task}
                  onComplete={() => handleMarkComplete(task.dayIndex, task.id)}
                />
              </div>
            ))
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-600">No tasks found matching your filters.</p>
              <button
                onClick={() => {
                  setFilter('all');
                  setTypeFilter(null);
                }}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
