
import React from 'react';
import { NavLink } from './NavLink';

export const Navigation: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 mb-6">
      <nav className="flex flex-wrap gap-2 justify-center">
        <NavLink to="/">Saisie</NavLink>
        <NavLink to="/travaux">Travaux</NavLink>
        <NavLink to="/recapitulatif">Récapitulatif</NavLink>
        <NavLink to="/infos-chantier">Infos Chantier / Client</NavLink>
        <NavLink to="/parametres">Paramètres</NavLink>
      </nav>
    </div>
  );
};
