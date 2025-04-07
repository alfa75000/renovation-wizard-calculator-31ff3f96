
import { useProject } from '@/contexts/ProjectContext';
import { Travail } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const useTravaux = () => {
  const { state, dispatch } = useProject();
  
  const getTravauxForPiece = (pieceId: string) => {
    return state.travaux.filter(travail => travail.pieceId === pieceId);
  };
  
  const addTravail = (travail: Omit<Travail, 'id'>) => {
    dispatch({
      type: 'ADD_TRAVAIL',
      payload: { ...travail, id: uuidv4() }
    });
  };
  
  const updateTravail = (id: string, travail: Travail) => {
    dispatch({
      type: 'UPDATE_TRAVAIL',
      payload: { id, travail }
    });
  };
  
  const deleteTravail = (id: string) => {
    dispatch({
      type: 'DELETE_TRAVAIL',
      payload: id
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
