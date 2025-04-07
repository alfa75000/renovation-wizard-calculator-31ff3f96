
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100';
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec titre et sous-titre optionnels */}
      {(title || subtitle) && (
        <div className="flex flex-col items-center justify-center mb-4 bg-blue-600 text-white p-6 rounded-lg max-w-6xl mx-auto mt-4">
          {title && <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>}
          {subtitle && <p className="mt-2 text-lg">{subtitle}</p>}
        </div>
      )}
      
      {/* Barre de navigation placée en dessous du titre */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <nav className="flex flex-wrap gap-2 justify-center">
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
      
      {/* Contenu principal */}
      <main className="max-w-6xl mx-auto px-4 pb-8">
        {children}
      </main>
    </div>
  );
};
