
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Estimateur de Rénovation</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:underline">Accueil</Link></li>
            <li><Link to="/travaux" className="hover:underline">Travaux</Link></li>
            <li><Link to="/recapitulatif" className="hover:underline">Récapitulatif</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
