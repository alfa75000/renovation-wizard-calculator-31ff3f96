
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import sousTravaux from '../data/sousTravaux';

export const useCatalogueTravauxMock = () => {
  // Types de travaux
  const travauxTypes = [
    { id: "murs", label: "Murs" },
    { id: "plafond", label: "Plafond" },
    { id: "sol", label: "Sol" },
    { id: "menuiseries", label: "Menuiseries" },
    { id: "electricite", label: "Electricité" },
    { id: "plomberie", label: "Plomberie" },
    { id: "platrerie", label: "Plâtrerie" },
    { id: "maconnerie", label: "Maçonnerie" },
    { id: "autre", label: "Autre" }
  ];

  const [types] = useState(travauxTypes);
  
  // Obtenir les sous-types pour un type donné
  const getSousTypes = (typeId: string) => {
    if (typeId in sousTravaux) {
      return sousTravaux[typeId as keyof typeof sousTravaux];
    }
    return [];
  };

  // Générer un ID unique
  const generateId = () => uuidv4();

  return {
    types,
    getSousTypes,
    generateId,
  };
};
