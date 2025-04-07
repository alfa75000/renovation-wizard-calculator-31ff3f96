
import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100';
  };
  
  // Déterminer si nous sommes en mode développement
  // En production, cette valeur sera 'production'
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
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
          
          {/* Bouton de débogage uniquement en mode développement */}
          {isDevelopment && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/debug')}
              title="Mode Débogage"
              className="opacity-70 hover:opacity-100"
            >
              <Bug className="h-4 w-4" />
              <span className="sr-only">Débogage</span>
            </Button>
          )}
        </div>
      </header>
      
      <main>
        {children}
      </main>
    </div>
  );
};
