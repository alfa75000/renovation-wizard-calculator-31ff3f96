
import { useState, useEffect } from 'react';
import { sousTravaux } from '../components/SousTypeSelect';

// Types pour la gestion du catalogue de travaux
export interface TypeTravaux {
  id: string;
  label: string;
  icon: string;
}

export interface SousTypeTravaux {
  id: string;
  label: string;
  prixUnitaire: number;
  unite: string;
  description?: string;
}

export interface CatalogueTravaux {
  typesTravaux: TypeTravaux[];
  sousTravaux: Record<string, SousTypeTravaux[]>;
}

// Mock du hook pour gérer le catalogue de travaux
// Cette version sera remplacée plus tard par une version connectée à la base de données
export const useCatalogueTravauxMock = () => {
  const [catalogue, setCatalogue] = useState<CatalogueTravaux>({
    typesTravaux: [
      { id: "murs", label: "Revêtement murs", icon: "Paintbrush" },
      { id: "plafond", label: "Revêtement plafond", icon: "Paintbrush" },
      { id: "sol", label: "Revêtement sol", icon: "Wrench" },
      { id: "menuiseries", label: "Menuiseries", icon: "Hammer" },
      { id: "electricite", label: "Electricité", icon: "SquarePen" },
      { id: "plomberie", label: "Plomberie", icon: "SquarePen" },
      { id: "platrerie", label: "Plâtrerie", icon: "SquarePen" },
      { id: "maconnerie", label: "Maçonnerie", icon: "SquarePen" },
      { id: "autre", label: "Autre", icon: "Wrench" }
    ],
    sousTravaux: sousTravaux
  });

  // Ajouter un nouveau type de travaux
  const ajouterTypeTravaux = (nouveauType: Omit<TypeTravaux, 'id'>) => {
    const id = nouveauType.label.toLowerCase().replace(/\s+/g, '-');
    
    setCatalogue(prev => ({
      ...prev,
      typesTravaux: [
        ...prev.typesTravaux,
        { ...nouveauType, id }
      ],
      sousTravaux: {
        ...prev.sousTravaux,
        [id]: []
      }
    }));

    return id;
  };

  // Modifier un type de travaux existant
  const modifierTypeTravaux = (id: string, typeModifie: Partial<TypeTravaux>) => {
    setCatalogue(prev => ({
      ...prev,
      typesTravaux: prev.typesTravaux.map(type => 
        type.id === id ? { ...type, ...typeModifie } : type
      )
    }));
  };

  // Supprimer un type de travaux
  const supprimerTypeTravaux = (id: string) => {
    setCatalogue(prev => {
      const { [id]: sousTypesASupprimer, ...resteSousTravaux } = prev.sousTravaux;
      
      return {
        typesTravaux: prev.typesTravaux.filter(type => type.id !== id),
        sousTravaux: resteSousTravaux
      };
    });
  };

  // Ajouter un sous-type de travaux
  const ajouterSousTypeTravaux = (typeTravauxId: string, nouveauSousType: Omit<SousTypeTravaux, 'id'>) => {
    const id = nouveauSousType.label.toLowerCase().replace(/\s+/g, '-');
    
    setCatalogue(prev => ({
      ...prev,
      sousTravaux: {
        ...prev.sousTravaux,
        [typeTravauxId]: [
          ...(prev.sousTravaux[typeTravauxId] || []),
          { ...nouveauSousType, id }
        ]
      }
    }));

    return id;
  };

  // Modifier un sous-type de travaux existant
  const modifierSousTypeTravaux = (typeTravauxId: string, sousTypeId: string, sousTypeModifie: Partial<SousTypeTravaux>) => {
    setCatalogue(prev => ({
      ...prev,
      sousTravaux: {
        ...prev.sousTravaux,
        [typeTravauxId]: (prev.sousTravaux[typeTravauxId] || []).map(sousType => 
          sousType.id === sousTypeId ? { ...sousType, ...sousTypeModifie } : sousType
        )
      }
    }));
  };

  // Supprimer un sous-type de travaux
  const supprimerSousTypeTravaux = (typeTravauxId: string, sousTypeId: string) => {
    setCatalogue(prev => ({
      ...prev,
      sousTravaux: {
        ...prev.sousTravaux,
        [typeTravauxId]: (prev.sousTravaux[typeTravauxId] || []).filter(
          sousType => sousType.id !== sousTypeId
        )
      }
    }));
  };

  return {
    catalogue,
    ajouterTypeTravaux,
    modifierTypeTravaux,
    supprimerTypeTravaux,
    ajouterSousTypeTravaux,
    modifierSousTypeTravaux,
    supprimerSousTypeTravaux
  };
};
