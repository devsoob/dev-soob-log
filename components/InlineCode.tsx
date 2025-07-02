import React from 'react';

interface InlineCodeProps {
  children: React.ReactNode;
  className?: string;
}

const InlineCode: React.FC<InlineCodeProps> = ({ children, className = '' }) => {
  return (
    <code className={`notion-inline-code ${className}`}>
      {children}
    </code>
  );
};

export default InlineCode; 