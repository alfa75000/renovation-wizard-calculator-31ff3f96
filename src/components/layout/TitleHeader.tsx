
import React from 'react';

interface TitleHeaderProps {
  title?: string;
  subtitle?: string;
}

export const TitleHeader: React.FC<TitleHeaderProps> = ({ title, subtitle }) => {
  if (!title && !subtitle) return null;
  
  return (
    <div className="flex flex-col items-center justify-center mb-4 bg-blue-600 text-white p-6 rounded-lg max-w-6xl mx-auto mt-4">
      {title && <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>}
      {subtitle && <p className="mt-2 text-lg">{subtitle}</p>}
    </div>
  );
};
