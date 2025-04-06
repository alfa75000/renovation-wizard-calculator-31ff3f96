
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types pour les catégories et sous-catégories de travaux
export interface SousTypeTravauxItem {
  id: string;
  label: string;
  prixUnitaire: number;
  prixFournitures?: number;
  prixMainOeuvre?: number;
  unite: string;
  description?: string;
  surfaceReference?: string;
}

export interface TypeTravauxItem {
  id: string;
  label: string;
  icon: string;
  sousTypes: SousTypeTravauxItem[];
}

// État global pour les types de travaux
interface TravauxTypesState {
  types: TypeTravauxItem[];
}

// Actions possibles pour le reducer
type TravauxTypesAction =
  | { type: 'SET_TYPES'; payload: TypeTravauxItem[] }
  | { type: 'ADD_TYPE'; payload: TypeTravauxItem }
  | { type: 'UPDATE_TYPE'; payload: { id: string; type: Partial<TypeTravauxItem> } }
  | { type: 'DELETE_TYPE'; payload: string }
  | { type: 'ADD_SOUS_TYPE'; payload: { typeId: string; sousType: SousTypeTravauxItem } }
  | { type: 'UPDATE_SOUS_TYPE'; payload: { typeId: string; id: string; sousType: Partial<SousTypeTravauxItem> } }
  | { type: 'DELETE_SOUS_TYPE'; payload: { typeId: string; id: string } }
  | { type: 'RESET_TYPES' };

// Données initiales par défaut
const defaultTypes: TypeTravauxItem[] = [
  {
    id: "murs",
    label: "Revêtement murs",
    icon: "Paintbrush",
    sousTypes: [
      { id: "lessivage-travaux", label: "Lessivage pour travaux", prixUnitaire: 2.2, prixFournitures: 0.8, prixMainOeuvre: 1.4, unite: "M²", surfaceReference: "SurfaceNetteMurs", description: "Lessivage des murs pour préparer les travaux" },
      { id: "lessivage-soigne", label: "Lessivage soigné en conservation", prixUnitaire: 3.5, prixFournitures: 1.2, prixMainOeuvre: 2.3, unite: "M²", surfaceReference: "SurfaceNetteMurs", description: "Lessivage soigné des murs à conserver" },
      { id: "grattage", label: "Grattage, ouverture des fissures", prixUnitaire: 5, prixFournitures: 1, prixMainOeuvre: 4, unite: "M²", surfaceReference: "SurfaceNetteMurs", description: "Grattage et ouverture des fissures pour préparation" },
      { id: "rebouchage", label: "Rebouchage, ponçage", prixUnitaire: 20, prixFournitures: 8, prixMainOeuvre: 12, unite: "M²", surfaceReference: "SurfaceNetteMurs", description: "Rebouchage des fissures et des trous, ponçage" },
      { id: "enduit-repassage", label: "Enduit repassé, ponçage", prixUnitaire: 25, prixFournitures: 10, prixMainOeuvre: 15, unite: "M²", surfaceReference: "SurfaceNetteMurs", description: "Application d'enduit repassé et ponçage" },
      { id: "toile-renfort", label: "Toile de renfort anti-fissures", prixUnitaire: 15, prixFournitures: 9, prixMainOeuvre: 6, unite: "M²", surfaceReference: "SurfaceNetteMurs", description: "Pose de toile de renfort pour prévenir les fissures" },
      { id: "bande-calicot", label: "Bande Calicot anti-fissure", prixUnitaire: 10, prixFournitures: 4, prixMainOeuvre: 6, unite: "Ml", surfaceReference: "LineaireNet", description: "Pose de bande calicot sur les fissures" },
      { id: "toile-verre", label: "Toile de verre à peindre", prixUnitaire: 18, prixFournitures: 10, prixMainOeuvre: 8, unite: "M²", surfaceReference: "SurfaceNetteMurs", description: "Pose de toile de verre à peindre" },
      { id: "peinture-acrylique", label: "Peinture type acrylique", prixUnitaire: 30, prixFournitures: 12, prixMainOeuvre: 18, unite: "M²", surfaceReference: "SurfaceNetteMurs", description: "Peinture acrylique avec préparation" },
      { id: "peinture-glycero", label: "Peinture type glycéro", prixUnitaire: 35, prixFournitures: 15, prixMainOeuvre: 20, unite: "M²", surfaceReference: "SurfaceNetteMurs", description: "Peinture glycérophtalique avec préparation" },
      { id: "vernis", label: "Vernis", prixUnitaire: 40, prixFournitures: 20, prixMainOeuvre: 20, unite: "M²", surfaceReference: "SurfaceNetteMurs", description: "Application de vernis protecteur" },
      { id: "enduit-decoratif", label: "Enduit décoratif", prixUnitaire: 45, prixFournitures: 25, prixMainOeuvre: 20, unite: "M²", surfaceReference: "SurfaceNetteMurs", description: "Application d'enduit décoratif" },
      { id: "papier-peint", label: "Papier peint", prixUnitaire: 22, prixFournitures: 12, prixMainOeuvre: 10, unite: "M²", surfaceReference: "SurfaceNetteMurs", description: "Pose de papier peint avec préparation" },
      { id: "faience", label: "Faïence / Carrelage", prixUnitaire: 80, prixFournitures: 40, prixMainOeuvre: 40, unite: "M²", surfaceReference: "SurfaceNetteMurs", description: "Pose de faïence murale ou carrelage" },
      { id: "lambris", label: "Lambris", prixUnitaire: 60, prixFournitures: 35, prixMainOeuvre: 25, unite: "M²", surfaceReference: "SurfaceNetteMurs", description: "Pose de lambris" },
      { id: "autre", label: "Autre", prixUnitaire: 0, prixFournitures: 0, prixMainOeuvre: 0, unite: "M²", surfaceReference: "SurfaceNetteMurs" }
    ]
  },
  {
    id: "plafond",
    label: "Revêtement plafond",
    icon: "Paintbrush",
    sousTypes: [
      { id: "lessivage-travaux", label: "Lessivage pour travaux", prixUnitaire: 2.5, prixFournitures: 0.8, prixMainOeuvre: 1.7, unite: "M²", surfaceReference: "SurfaceNettePlafond", description: "Lessivage du plafond pour préparation" },
      { id: "rebouchage", label: "Rebouchage, ponçage", prixUnitaire: 22, prixFournitures: 8, prixMainOeuvre: 14, unite: "M²", surfaceReference: "SurfaceNettePlafond", description: "Rebouchage des fissures et trous, ponçage" },
      { id: "peinture-acrylique", label: "Peinture type acrylique", prixUnitaire: 32, prixFournitures: 12, prixMainOeuvre: 20, unite: "M²", surfaceReference: "SurfaceNettePlafond", description: "Peinture acrylique pour plafond" },
      { id: "peinture-glycero", label: "Peinture type glycéro", prixUnitaire: 21, prixFournitures: 5, prixMainOeuvre: 16, unite: "M²", surfaceReference: "SurfaceNettePlafond", description: "Peinture glycérophtalique pour plafond" },
      { id: "autre", label: "Autre", prixUnitaire: 0, prixFournitures: 0, prixMainOeuvre: 0, unite: "M²", surfaceReference: "SurfaceNettePlafond" }
    ]
  },
  {
    id: "sol",
    label: "Revêtement sol",
    icon: "Wrench",
    sousTypes: [
      { id: "depose-ancien", label: "Dépose ancien revêtement", prixUnitaire: 15, prixFournitures: 2, prixMainOeuvre: 13, unite: "M²", surfaceReference: "SurfaceNetteSol", description: "Dépose et évacuation de l'ancien revêtement" },
      { id: "preparation", label: "Préparation support", prixUnitaire: 25, prixFournitures: 8, prixMainOeuvre: 17, unite: "M²", surfaceReference: "SurfaceNetteSol", description: "Préparation du support (ragréage, etc.)" },
      { id: "carrelage", label: "Carrelage", prixUnitaire: 90, prixFournitures: 45, prixMainOeuvre: 45, unite: "M²", surfaceReference: "SurfaceNetteSol", description: "Fourniture et pose de carrelage avec joints" },
      { id: "parquet", label: "Parquet", prixUnitaire: 85, prixFournitures: 50, prixMainOeuvre: 35, unite: "M²", surfaceReference: "SurfaceNetteSol", description: "Fourniture et pose de parquet" },
      { id: "stratifie", label: "Stratifié", prixUnitaire: 65, prixFournitures: 40, prixMainOeuvre: 25, unite: "M²", surfaceReference: "SurfaceNetteSol", description: "Fourniture et pose de stratifié avec sous-couche" },
      { id: "moquette", label: "Moquette", prixUnitaire: 45, prixFournitures: 25, prixMainOeuvre: 20, unite: "M²", surfaceReference: "SurfaceNetteSol", description: "Fourniture et pose de moquette" },
      { id: "linoleum", label: "Linoléum", prixUnitaire: 40, prixFournitures: 22, prixMainOeuvre: 18, unite: "M²", surfaceReference: "SurfaceNetteSol", description: "Fourniture et pose de linoléum" },
      { id: "beton-cire", label: "Béton ciré", prixUnitaire: 120, prixFournitures: 60, prixMainOeuvre: 60, unite: "M²", surfaceReference: "SurfaceNetteSol", description: "Fourniture et application de béton ciré" },
      { id: "autre", label: "Autre", prixUnitaire: 0, prixFournitures: 0, prixMainOeuvre: 0, unite: "M²", surfaceReference: "SurfaceNetteSol" }
    ]
  },
  {
    id: "menuiseries",
    label: "Menuiseries",
    icon: "Hammer",
    sousTypes: [
      { id: "depose-porte", label: "Dépose porte", prixUnitaire: 50, prixFournitures: 5, prixMainOeuvre: 45, unite: "Ens.", surfaceReference: "Unite", description: "Dépose de porte existante" },
      { id: "depose-fenetre", label: "Dépose fenêtre", prixUnitaire: 70, prixFournitures: 8, prixMainOeuvre: 62, unite: "Ens.", surfaceReference: "Unite", description: "Dépose de fenêtre existante" },
      { id: "pose-porte", label: "Pose porte", prixUnitaire: 180, prixFournitures: 120, prixMainOeuvre: 60, unite: "Ens.", surfaceReference: "Unite", description: "Fourniture et pose de porte intérieure" },
      { id: "pose-porte-fenetre", label: "Pose porte-fenêtre", prixUnitaire: 280, prixFournitures: 200, prixMainOeuvre: 80, unite: "Ens.", surfaceReference: "Unite", description: "Fourniture et pose de porte-fenêtre" },
      { id: "pose-fenetre", label: "Pose fenêtre", prixUnitaire: 250, prixFournitures: 180, prixMainOeuvre: 70, unite: "Ens.", surfaceReference: "Unite", description: "Fourniture et pose de fenêtre" },
      { id: "peinture-menuiserie", label: "Peinture menuiserie", prixUnitaire: 45, prixFournitures: 15, prixMainOeuvre: 30, unite: "M²", surfaceReference: "SurfaceMenuiseries", description: "Peinture de menuiseries bois" },
      { id: "autre", label: "Autre", prixUnitaire: 0, prixFournitures: 0, prixMainOeuvre: 0, unite: "Unité", surfaceReference: "Unite" }
    ]
  },
  {
    id: "menuiseries-existantes",
    label: "Menuiseries existantes",
    icon: "Home",
    sousTypes: [
      { id: "peinture", label: "Peinture", prixUnitaire: 40, prixFournitures: 15, prixMainOeuvre: 25, unite: "M²", surfaceReference: "SurfaceMenuiseries", description: "Peinture de la menuiserie" },
      { id: "vernis", label: "Vernis", prixUnitaire: 45, prixFournitures: 18, prixMainOeuvre: 27, unite: "M²", surfaceReference: "SurfaceMenuiseries", description: "Vernis de la menuiserie" },
      { id: "reparation", label: "Réparation", prixUnitaire: 80, prixFournitures: 30, prixMainOeuvre: 50, unite: "Unité", surfaceReference: "Unite", description: "Réparation de la menuiserie" },
      { id: "remplacement", label: "Remplacement", prixUnitaire: 300, prixFournitures: 200, prixMainOeuvre: 100, unite: "Unité", surfaceReference: "Unite", description: "Remplacement de la menuiserie" },
      { id: "autre", label: "Autre", prixUnitaire: 0, prixFournitures: 0, prixMainOeuvre: 0, unite: "Unité", surfaceReference: "Unite" }
    ]
  },
  {
    id: "electricite",
    label: "Electricité",
    icon: "SquarePen",
    sousTypes: [
      { id: "interrupteur", label: "Pose interrupteur", prixUnitaire: 40, prixFournitures: 15, prixMainOeuvre: 25, unite: "Unité", surfaceReference: "Unite", description: "Fourniture et pose d'interrupteur" },
      { id: "prise", label: "Pose prise", prixUnitaire: 45, prixFournitures: 15, prixMainOeuvre: 30, unite: "Unité", surfaceReference: "Unite", description: "Fourniture et pose de prise de courant" },
      { id: "luminaire", label: "Pose luminaire", prixUnitaire: 70, prixFournitures: 25, prixMainOeuvre: 45, unite: "Unité", surfaceReference: "Unite", description: "Fourniture et pose de luminaire" },
      { id: "tableau", label: "Tableau électrique", prixUnitaire: 350, prixFournitures: 200, prixMainOeuvre: 150, unite: "Unité", surfaceReference: "Unite", description: "Fourniture et pose de tableau électrique" },
      { id: "autre", label: "Autre", prixUnitaire: 0, prixFournitures: 0, prixMainOeuvre: 0, unite: "Unité", surfaceReference: "Unite" }
    ]
  },
  {
    id: "plomberie",
    label: "Plomberie",
    icon: "SquarePen",
    sousTypes: [
      { id: "evacuation", label: "Évacuation", prixUnitaire: 120, prixFournitures: 50, prixMainOeuvre: 70, unite: "Ml", surfaceReference: "LineaireNet", description: "Pose de tuyaux d'évacuation" },
      { id: "alimentation", label: "Alimentation", prixUnitaire: 140, prixFournitures: 60, prixMainOeuvre: 80, unite: "Ml", surfaceReference: "LineaireNet", description: "Pose de tuyaux d'alimentation" },
      { id: "sanitaire", label: "Sanitaire", prixUnitaire: 180, prixFournitures: 100, prixMainOeuvre: 80, unite: "Unité", surfaceReference: "Unite", description: "Fourniture et pose d'équipement sanitaire" },
      { id: "autre", label: "Autre", prixUnitaire: 0, prixFournitures: 0, prixMainOeuvre: 0, unite: "Unité", surfaceReference: "Unite" }
    ]
  },
  {
    id: "platrerie",
    label: "Plâtrerie",
    icon: "SquarePen",
    sousTypes: [
      { id: "cloison", label: "Cloison placo", prixUnitaire: 85, prixFournitures: 35, prixMainOeuvre: 50, unite: "M²", surfaceReference: "SurfaceNetteMurs", description: "Fourniture et pose de cloison en plaques de plâtre" },
      { id: "doublage", label: "Doublage", prixUnitaire: 75, prixFournitures: 30, prixMainOeuvre: 45, unite: "M²", surfaceReference: "SurfaceNetteMurs", description: "Doublage de murs en plaques de plâtre" },
      { id: "faux-plafond", label: "Faux plafond", prixUnitaire: 90, prixFournitures: 40, prixMainOeuvre: 50, unite: "M²", surfaceReference: "SurfaceNettePlafond", description: "Fourniture et pose de faux plafond" },
      { id: "autre", label: "Autre", prixUnitaire: 0, prixFournitures: 0, prixMainOeuvre: 0, unite: "M²", surfaceReference: "SurfaceNetteMurs" }
    ]
  },
  {
    id: "maconnerie",
    label: "Maçonnerie",
    icon: "SquarePen",
    sousTypes: [
      { id: "ouverture", label: "Création ouverture", prixUnitaire: 450, prixFournitures: 150, prixMainOeuvre: 300, unite: "Forfait", surfaceReference: "Forfait", description: "Création d'ouverture dans mur porteur avec linteau" },
      { id: "demolition", label: "Démolition", prixUnitaire: 250, prixFournitures: 50, prixMainOeuvre: 200, unite: "M3", surfaceReference: "Volume", description: "Démolition de maçonnerie avec évacuation" },
      { id: "autre", label: "Autre", prixUnitaire: 0, prixFournitures: 0, prixMainOeuvre: 0, unite: "Forfait", surfaceReference: "Forfait" }
    ]
  },
  {
    id: "autre",
    label: "Autre",
    icon: "Wrench",
    sousTypes: [
      { id: "autre", label: "Personnalisé", prixUnitaire: 0, prixFournitures: 0, prixMainOeuvre: 0, unite: "Unité", surfaceReference: "Unite" }
    ]
  }
];

// État initial
const initialState: TravauxTypesState = {
  types: []
};

// Fonction reducer pour gérer les modifications d'état
const travauxTypesReducer = (
  state: TravauxTypesState,
  action: TravauxTypesAction
): TravauxTypesState => {
  switch (action.type) {
    case 'SET_TYPES':
      return {
        ...state,
        types: action.payload
      };
    case 'ADD_TYPE':
      return {
        ...state,
        types: [...state.types, action.payload]
      };
    case 'UPDATE_TYPE':
      return {
        ...state,
        types: state.types.map(type =>
          type.id === action.payload.id
            ? { ...type, ...action.payload.type }
            : type
        )
      };
    case 'DELETE_TYPE':
      return {
        ...state,
        types: state.types.filter(type => type.id !== action.payload)
      };
    case 'ADD_SOUS_TYPE':
      return {
        ...state,
        types: state.types.map(type =>
          type.id === action.payload.typeId
            ? {
                ...type,
                sousTypes: [...type.sousTypes, action.payload.sousType]
              }
            : type
        )
      };
    case 'UPDATE_SOUS_TYPE':
      return {
        ...state,
        types: state.types.map(type =>
          type.id === action.payload.typeId
            ? {
                ...type,
                sousTypes: type.sousTypes.map(sousType =>
                  sousType.id === action.payload.id
                    ? { ...sousType, ...action.payload.sousType }
                    : sousType
                )
              }
            : type
        )
      };
    case 'DELETE_SOUS_TYPE':
      return {
        ...state,
        types: state.types.map(type =>
          type.id === action.payload.typeId
            ? {
                ...type,
                sousTypes: type.sousTypes.filter(
                  sousType => sousType.id !== action.payload.id
                )
              }
            : type
        )
      };
    case 'RESET_TYPES':
      localStorage.removeItem('travauxTypes');
      return {
        ...initialState,
        types: defaultTypes
      };
    default:
      return state;
  }
};

// Création du contexte
const TravauxTypesContext = createContext<{
  state: TravauxTypesState;
  dispatch: React.Dispatch<TravauxTypesAction>;
}>({
  state: initialState,
  dispatch: () => null
});

// Hook personnalisé pour utiliser le contexte
export const useTravauxTypes = () => {
  const context = useContext(TravauxTypesContext);
  if (!context) {
    throw new Error(
      "useTravauxTypes doit être utilisé à l'intérieur d'un TravauxTypesProvider"
    );
  }
  return context;
};

// Provider du contexte
export const TravauxTypesProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [state, dispatch] = useReducer(travauxTypesReducer, initialState);

  // Chargement initial des données depuis localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedTypes = localStorage.getItem('travauxTypes');
        
        if (savedTypes) {
          dispatch({ type: 'SET_TYPES', payload: JSON.parse(savedTypes) });
        } else {
          // Si aucune donnée n'est trouvée, utilisez les données par défaut
          dispatch({ type: 'SET_TYPES', payload: defaultTypes });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des types de travaux:', error);
        dispatch({ type: 'SET_TYPES', payload: defaultTypes });
      }
    };

    loadData();
  }, []);

  // Sauvegarde des données dans localStorage quand elles changent
  useEffect(() => {
    if (state.types.length > 0) {
      localStorage.setItem('travauxTypes', JSON.stringify(state.types));
    }
  }, [state.types]);

  return (
    <TravauxTypesContext.Provider value={{ state, dispatch }}>
      {children}
    </TravauxTypesContext.Provider>
  );
};

// Exporter la liste des types de surfaces de référence
export const surfacesReference = [
  { id: "SurfaceNetteSol", label: "Surface Nette du Sol" },
  { id: "SurfaceNettePlafond", label: "Surface Nette du Plafond" },
  { id: "LineaireNet", label: "Linéaire Net de la pièce" },
  { id: "SurfaceNetteMurs", label: "Surface Nette des murs" },
  { id: "SurfaceBruteSol", label: "Surface Brute du sol" },
  { id: "SurfaceBrutePlafond", label: "Surface Brute du Plafond" },
  { id: "LineaireBrut", label: "Linéaire Brut de la pièce" },
  { id: "SurfaceBruteMurs", label: "Surface Brute des murs" },
  { id: "SurfaceNetteFacades", label: "Surface Nette des Façades" },
  { id: "SurfaceBruteFacades", label: "Surface Brute des Façades" },
  { id: "SurfaceNetteToiture", label: "Surface Nette de la toiture" },
  { id: "SurfaceBruteToiture", label: "Surface Brute de la toiture" },
  { id: "SurfaceMenuiseries", label: "Surface des Menuiseries" },
  { id: "Volume", label: "Volume (M3)" },
  { id: "Unite", label: "Unité" },
  { id: "Forfait", label: "Forfait" }
];
