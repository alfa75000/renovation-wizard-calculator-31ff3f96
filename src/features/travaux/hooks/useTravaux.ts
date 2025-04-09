
import { useProject } from '@/contexts/ProjectContext';
import { Travail } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export const useTravaux = () => {
  const { state, dispatch } = useProject();
  
  const getTravauxForPiece = (pieceId: string) => {
    return state.travaux.filter(travail => travail.pieceId === pieceId);
  };
  
  const addTravail = (travail: Omit<Travail, 'id'>) => {
    const newTravail = { ...travail, id: uuidv4() };
    
    dispatch({
      type: 'ADD_TRAVAIL',
      payload: newTravail
    });
    
    toast({
      title: "Travail ajouté",
      description: `Le travail "${travail.description}" a été ajouté avec succès.`
    });
    
    return newTravail;
  };
  
  const updateTravail = (id: string, travail: Partial<Travail>) => {
    dispatch({
      type: 'UPDATE_TRAVAIL',
      payload: { id, travail: { ...travail, id } as Travail }
    });
    
    toast({
      title: "Travail mis à jour",
      description: `Le travail a été mis à jour avec succès.`
    });
  };
  
  const deleteTravail = (id: string) => {
    dispatch({
      type: 'DELETE_TRAVAIL',
      payload: id
    });
    
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
