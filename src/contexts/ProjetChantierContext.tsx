
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { ProjetChantierState, ProjetChantier, ProjetChantierAction } from '@/types';
import { useProject } from './ProjectContext';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { saveProject, loadProject, getProjects, deleteProject, generateDefaultProjectName } from '@/services/projectService';

// État initial
const initialState: ProjetChantierState = {
  projets: [],
  projetActif: null,
};

// Créer le contexte
const ProjetChantierContext = createContext<{
  state: ProjetChantierState;
  dispatch: React.Dispatch<ProjetChantierAction>;
  sauvegarderProjet: (projetData: Partial<ProjetChantier>) => Promise<void>;
  chargerProjet: (projetId: string) => Promise<void>;
  genererNomFichier: (projet: Partial<ProjetChantier>, nomClient?: string) => string;
  nouveauProjet: () => void;
  supprimerProjet: (projetId: string) => Promise<void>;
  rafraichirListeProjets: () => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  sauvegarderProjet: async () => {},
  chargerProjet: async () => {},
  genererNomFichier: () => '',
  nouveauProjet: () => {},
  supprimerProjet: async () => {},
  rafraichirListeProjets: async () => {},
});

// Reducer pour gérer les actions
function projetChantierReducer(state: ProjetChantierState, action: ProjetChantierAction): ProjetChantierState {
  try {
    switch (action.type) {
      case 'ADD_PROJET': {
        const newProjet = {
          ...action.payload,
          id: action.payload.id || uuidv4(),
        };
        return {
          ...state,
          projets: Array.isArray(state.projets) ? [...state.projets, newProjet] : [newProjet],
        };
      }
      
      case 'UPDATE_PROJET': {
        const { id, projet } = action.payload;
        // Vérifier que projets est un tableau
        if (!Array.isArray(state.projets)) {
          console.error('state.projets n\'est pas un tableau:', state.projets);
          return {
            ...state,
            projets: []
          };
        }
        return {
          ...state,
          projets: state.projets.map((p) => (p.id === id ? { ...p, ...projet } : p)),
          projetActif: state.projetActif?.id === id ? { ...state.projetActif, ...projet } : state.projetActif,
        };
      }
      
      case 'DELETE_PROJET': {
        // Vérifier que projets est un tableau
        if (!Array.isArray(state.projets)) {
          console.error('state.projets n\'est pas un tableau:', state.projets);
          return {
            ...state,
            projets: []
          };
        }
        return {
          ...state,
          projets: state.projets.filter((projet) => projet.id !== action.payload),
          projetActif: state.projetActif?.id === action.payload ? null : state.projetActif,
        };
      }
        
      case 'SET_PROJET_ACTIF': {
        const projetId = action.payload;
        // Vérifier que projets est un tableau
        if (!Array.isArray(state.projets)) {
          console.error('state.projets n\'est pas un tableau:', state.projets);
          return {
            ...state,
            projets: [],
            projetActif: null
          };
        }
        const projetActif = projetId ? state.projets.find(p => p.id === projetId) || null : null;
        return {
          ...state,
          projetActif,
        };
      }
      
      case 'LOAD_PROJETS':
        // Vérifier que la charge utile est un tableau
        if (!Array.isArray(action.payload)) {
          console.error('LOAD_PROJETS: action.payload n\'est pas un tableau:', action.payload);
          return {
            ...state,
            projets: []
          };
        }
        return {
          ...state,
          projets: action.payload,
        };
        
      case 'RESET_PROJETS':
        return initialState;
      
      default:
        return state;
    }
  } catch (error) {
    console.error('Erreur dans projetChantierReducer:', error);
    return {
      ...state,
      projets: Array.isArray(state.projets) ? state.projets : []
    };
  }
}

// Provider component
export const ProjetChantierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state: projectState, dispatch: projectDispatch } = useProject();
  
  // Initialiser le state
  const [state, dispatch] = useReducer(projetChantierReducer, initialState);
  
  // Charger la liste des projets au démarrage
  const rafraichirListeProjets = useCallback(async () => {
    try {
      const projets = await getProjects();
      
      // Convertir les projets Supabase en format ProjetChantier
      const formattedProjets: ProjetChantier[] = projets.map(p => ({
        id: p.id,
        nom: p.name,
        adresse: p.address || '',
        codePostal: p.postal_code || '',
        ville: p.city || '',
        clientId: p.client_id || '',
        dateDebut: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : format(new Date(), 'yyyy-MM-dd'),
        dateFin: '',
        description: p.description || '',
        statut: 'en_cours',
        montantTotal: 0,
        nomProjet: p.name,
        occupant: p.occupant || '',
        infoComplementaire: p.additional_info || ''
      }));
      
      dispatch({
        type: 'LOAD_PROJETS',
        payload: formattedProjets
      });
    } catch (error) {
      console.error('Erreur lors du chargement de la liste des projets:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des projets.",
        variant: "destructive"
      });
    }
  }, []);
  
  // Charger la liste des projets au démarrage
  useEffect(() => {
    rafraichirListeProjets();
  }, [rafraichirListeProjets]);

  // Fonction pour sauvegarder ou mettre à jour un projet
  const sauvegarderProjet = async (projetData: Partial<ProjetChantier>) => {
    try {
      const dateModification = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      
      const updatedProjetData = {
        ...projetData,
        dateModification
      };
      
      if (state.projetActif) {
        // Mise à jour du projet existant
        const projectInfo = {
          ...state.projetActif,
          ...updatedProjetData
        };
        
        const projectId = await saveProject(projectState, projectInfo);
        
        if (projectId) {
          // Mettre à jour la liste des projets
          dispatch({
            type: 'UPDATE_PROJET',
            payload: {
              id: state.projetActif.id,
              projet: {
                ...state.projetActif,
                ...updatedProjetData,
                projectData: { ...projectState }
              },
            },
          });
          
          // Mettre à jour le projet actif
          dispatch({
            type: 'SET_PROJET_ACTIF',
            payload: state.projetActif.id
          });
          
          toast({
            title: "Projet mis à jour",
            description: "Le projet a été mis à jour avec succès",
          });
        }
      } else {
        // Création d'un nouveau projet
        const newProjet: ProjetChantier = {
          id: uuidv4(),
          nom: projetData.nomProjet || generateDefaultProjectName(),
          adresse: projetData.adresse || '',
          codePostal: projetData.codePostal || '',
          ville: projetData.ville || '',
          clientId: projetData.clientId || '',
          dateDebut: format(new Date(), 'yyyy-MM-dd'),
          dateFin: '',
          description: projetData.description || '',
          statut: 'en_attente',
          montantTotal: 0,
          dateModification,
          nomProjet: projetData.nomProjet || generateDefaultProjectName(),
          occupant: projetData.occupant || '',
          infoComplementaire: projetData.infoComplementaire || '',
          ...projetData,
        };
        
        const projectId = await saveProject(projectState, newProjet);
        
        if (projectId) {
          newProjet.id = projectId;
          
          dispatch({
            type: 'ADD_PROJET',
            payload: {
              ...newProjet,
              projectData: { ...projectState }
            },
          });
          
          // Définir le nouveau projet comme projet actif
          dispatch({
            type: 'SET_PROJET_ACTIF',
            payload: projectId
          });
          
          toast({
            title: "Projet créé",
            description: "Le nouveau projet a été créé avec succès",
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du projet:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du projet",
        variant: "destructive",
      });
    }
  };

  // Fonction pour charger un projet existant
  const chargerProjet = async (projetId: string) => {
    try {
      const result = await loadProject(projetId);
      
      if (result) {
        const { projectState: loadedProjectState, projetInfo } = result;
        
        // Mettre à jour le contexte de projet
        projectDispatch({
          type: 'LOAD_PROJECT',
          payload: loadedProjectState
        });
        
        // Mettre à jour le projet actif
        dispatch({
          type: 'SET_PROJET_ACTIF',
          payload: projetId
        });
        
        toast({
          title: "Projet chargé",
          description: `Le projet "${projetInfo.nom}" a été chargé avec succès.`
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement du projet:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement du projet",
        variant: "destructive",
      });
    }
  };
  
  // Fonction pour supprimer un projet
  const supprimerProjet = async (projetId: string) => {
    try {
      const success = await deleteProject(projetId);
      
      if (success) {
        // Mettre à jour la liste des projets
        dispatch({
          type: 'DELETE_PROJET',
          payload: projetId
        });
        
        // Si le projet supprimé était le projet actif, réinitialiser
        if (state.projetActif?.id === projetId) {
          nouveauProjet();
        }
        
        toast({
          title: "Projet supprimé",
          description: "Le projet a été supprimé avec succès."
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du projet:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du projet",
        variant: "destructive",
      });
    }
  };

  // Fonction pour générer un nom de fichier
  const genererNomFichier = (projet: Partial<ProjetChantier>, nomClient?: string) => {
    const date = format(new Date(), 'yyyyMMdd');
    const nomProjet = projet.nomProjet || 'nouveau-projet';
    const client = nomClient || 'client';
    
    return `Devis_${date}_${client}_${nomProjet}`.replace(/\s+/g, '_');
  };

  // Fonction pour initialiser un nouveau projet
  const nouveauProjet = () => {
    try {
      // Réinitialiser le projet actif
      dispatch({
        type: 'SET_PROJET_ACTIF',
        payload: null
      });
      
      // Réinitialiser le contexte de projet
      projectDispatch({
        type: 'RESET_PROJECT'
      });
      
      toast({
        title: "Nouveau projet",
        description: "Un nouveau projet a été initialisé."
      });
    } catch (error) {
      console.error("Erreur lors de l'initialisation d'un nouveau projet:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'initialisation d'un nouveau projet",
        variant: "destructive",
      });
    }
  };

  return (
    <ProjetChantierContext.Provider value={{ 
      state, 
      dispatch, 
      sauvegarderProjet, 
      chargerProjet, 
      genererNomFichier,
      nouveauProjet,
      supprimerProjet,
      rafraichirListeProjets
    }}>
      {children}
    </ProjetChantierContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useProjetChantier = () => {
  const context = useContext(ProjetChantierContext);
  if (!context) {
    throw new Error('useProjetChantier doit être utilisé à l\'intérieur d\'un ProjetChantierProvider');
  }
  return context;
};
