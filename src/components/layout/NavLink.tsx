
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

export const NavLink: React.FC<NavLinkProps> = ({ to, children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100';
  };
  
  return (
    <Link 
      to={to} 
      className={`px-4 py-2 rounded-md transition-colors ${isActive(to)}`}
    >
      {children}
    </Link>
  );
};
