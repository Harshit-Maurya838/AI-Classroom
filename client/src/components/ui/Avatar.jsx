import React from 'react';

const Avatar = ({ src, alt = 'User avatar', size = 'md', name, status }) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  };

  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : name ? (
        <div
          className={`
            ${sizeClasses[size]}
            rounded-full
            bg-gray-200
            flex items-center justify-center
            font-medium text-gray-600
          `}
        >
          {getInitials(name)}
        </div>
      ) : (
        <div
          className={`
            ${sizeClasses[size]}
            rounded-full
            bg-gray-200
            flex items-center justify-center
          `}
        />
      )}

      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${statusClasses[status]}
            ${statusSizeClasses[size]}
            rounded-full
            ring-2 ring-white
          `}
        />
      )}
    </div>
  );
};

export default Avatar;
