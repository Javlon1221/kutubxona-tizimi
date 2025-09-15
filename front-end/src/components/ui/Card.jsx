import React from 'react';

const Card = ({ 
  children, 
  className = '',
  hover = false,
  gradient = false,
  glass = false,
  ...props 
}) => {
  const baseClasses = 'card';
  const hoverClasses = hover ? 'hover:shadow-medium hover:scale-[1.02]' : '';
  const gradientClasses = gradient ? 'bg-gradient-to-br from-white to-gray-50' : '';
  const glassClasses = glass ? 'glass' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${glassClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', gradient = false }) => {
  const titleClasses = gradient ? 'gradient-text' : 'text-gray-900';
  return (
    <h3 className={`text-xl font-bold ${titleClasses} ${className}`}>
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-600 leading-relaxed ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between pt-6 border-t border-gray-200/50 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
