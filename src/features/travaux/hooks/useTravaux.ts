
import { useProject } from '@/contexts/ProjectContext';
import { Travail } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { filtrerTravauxParPiece } from '../utils/travauxUtils';

/**
 * Hook pour la gestion des travaux dans le projet
 */
export const useTravaux = () => {
  const { state, dispatch } = useProject();
  
  // Fonction pour récupérer les travaux d'une pièce spécifique
  const getTravauxForPiece = (pieceId: string) => {
    return filtrerTravauxParPiece(state.travaux, pieceId);
  };
  
  // Fonction pour ajouter un nouveau travail
  const addTravail = (travail: Omit<Travail, 'id'>) => {
    const newTravail = { ...travail, id: uuidv4() };
    
    dispatch({
      type: 'ADD_TRAVAIL',
      payload: newTravail
    });
    
    console.log('Travail added:', newTravail);
    
    toast({
      title: "Travail ajouté",
      description: `Le travail "${travail.description}" a été ajouté avec succès.`
    });
    
    return newTravail;
  };
  
  // Fonction pour mettre à jour un travail existant
  const updateTravail = (id: string, travail: Partial<Travail>) => {
    dispatch({
      type: 'UPDATE_TRAVAIL',
      payload: { id, travail: { ...travail, id } as Travail }
    });
    
    console.log('Travail updated:', id);
    
    toast({
      title: "Travail mis à jour",
      description: `Le travail a été mis à jour avec succès.`
    });
  };
  
  // Fonction pour supprimer un travail
  const deleteTravail = (id: string) => {
    dispatch({
      type: 'DELETE_TRAVAIL',
      payload: id
    });
    
    console.log('Travail deleted:', id);
    
    toast({
      title: "Travail supprimé",
      description: `Le travail a été supprimé avec succès.`
    });
  };
  
  return {
    travaux: state.travaux,
    getTravauxForPiece,
    addTravail,
    updateTravail,
    deleteTravail
  };
};
