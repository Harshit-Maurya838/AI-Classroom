import React from 'react';

const Card = ({
  children,
  className = '',
  onClick,
  hover = false,
  bordered = false
}) => {
  const hoverClasses = hover 
    ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer' 
    : '';
  
  const borderClasses = bordered
    ? 'border border-gray-200'
    : '';
  
  return (
    <div 
      className={`
        bg-white rounded-xl shadow-md overflow-hidden 
        ${hoverClasses} 
        ${borderClasses} 
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
