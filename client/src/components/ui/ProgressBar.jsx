import React from 'react';

const ProgressBar = ({
  value,
  max = 100,
  height = 'md',
  color = 'blue',
  showPercentage = false,
  animated = true,
  label
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4'
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-600'
  };

  const animationClass = animated ? 'transition-all duration-500 ease-out' : '';

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-medium text-gray-700">{percentage}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${heightClasses[height]}`}>
        <div
          className={`rounded-full ${colorClasses[color]} ${heightClasses[height]} ${animationClass}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {!label && showPercentage && (
        <div className="mt-1 text-right">
          <span className="text-xs font-medium text-gray-500">{percentage}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
