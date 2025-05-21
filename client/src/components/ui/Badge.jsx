import React from 'react';

const Badge = ({
  children,
  color = 'blue',
  size = 'md',
  variant = 'filled',
  rounded = false
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  };

  const roundedClass = rounded ? 'rounded-full' : 'rounded';

  const colorStyles = {
    filled: {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      purple: 'bg-purple-100 text-purple-800',
      gray: 'bg-gray-100 text-gray-800'
    },
    outlined: {
      blue: 'border border-blue-500 text-blue-500',
      green: 'border border-green-500 text-green-500',
      red: 'border border-red-500 text-red-500',
      yellow: 'border border-yellow-500 text-yellow-500',
      purple: 'border border-purple-500 text-purple-500',
      gray: 'border border-gray-500 text-gray-500'
    },
    subtle: {
      blue: 'text-blue-600',
      green: 'text-green-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      purple: 'text-purple-600',
      gray: 'text-gray-600'
    }
  };

  return (
    <span
      className={`
        inline-block font-medium
        ${sizeClasses[size]}
        ${colorStyles[variant][color]}
        ${roundedClass}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
