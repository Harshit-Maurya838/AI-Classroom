import React from 'react';
import { CheckCircle, Book, FileQuestion, Video, RefreshCw } from 'lucide-react';

const TaskCard = ({ task, onComplete }) => {
  const getIcon = () => {
    switch (task.type) {
      case 'Lesson':
        return task.videoUrl ? <Video size={24} className="text-blue-500" /> : <Book size={24} className="text-blue-500" />;
      case 'MCQ':
        return <FileQuestion size={24} className="text-purple-500" />;
      case 'Interview':
        return <FileQuestion size={24} className="text-amber-500" />;
      case 'Revision':
        return <RefreshCw size={24} className="text-green-500" />;
      default:
        return <Book size={24} className="text-blue-500" />;
    }
  };

  const getTaskTypeColor = () => {
    switch (task.type) {
      case 'Lesson':
        return 'bg-blue-100 text-blue-800';
      case 'MCQ':
        return 'bg-purple-100 text-purple-800';
      case 'Interview':
        return 'bg-amber-100 text-amber-800';
      case 'Revision':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-4 shadow-sm ${task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="pt-1">{getIcon()}</div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${getTaskTypeColor()}`}>
                {task.type}
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>

            {task.videoUrl && (
              <div className="mt-3 w-full">
                <iframe
                  width="100%"
                  height="180"
                  src={task.videoUrl}
                  title={task.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-md"
                ></iframe>
              </div>
            )}

            {task.content && (
              <div className="mt-3">
                <p className="text-gray-700 text-sm">{task.content}</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onComplete}
          disabled={task.completed}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
            task.completed
              ? 'bg-green-100 text-green-700 cursor-default'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {task.completed ? (
            <>
              <CheckCircle size={16} className="mr-1" />
              Completed
            </>
          ) : (
            'Mark Complete'
          )}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
