
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100';
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-wrap gap-2">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-md transition-colors ${isActive('/')}`}
            >
              Saisie
            </Link>
            <Link 
              to="/travaux" 
              className={`px-4 py-2 rounded-md transition-colors ${isActive('/travaux')}`}
            >
              Travaux
            </Link>
            <Link 
              to="/recapitulatif" 
              className={`px-4 py-2 rounded-md transition-colors ${isActive('/recapitulatif')}`}
            >
              Récapitulatif
            </Link>
            <Link 
              to="/infos-chantier" 
              className={`px-4 py-2 rounded-md transition-colors ${isActive('/infos-chantier')}`}
            >
              Infos Chantier / Client
            </Link>
            <Link 
              to="/parametres" 
              className={`px-4 py-2 rounded-md transition-colors ${isActive('/parametres')}`}
            >
              Paramètres
            </Link>
          </nav>
        </div>
      </header>
      
      <main>
        {children}
      </main>
    </div>
  );
};
