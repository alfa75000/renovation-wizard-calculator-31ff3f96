
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Travail, Piece } from '@/types';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from '@/hooks/use-toast';
import { useTravauxTypes } from '@/contexts/TravauxTypesContext';

export const useTravaux = () => {
  const { state, dispatch } = useProject();
  const { state: typesState } = useTravauxTypes();

  const [pieceSelectionnee, setPieceSelectionnee] = useState<string | null>(null);
  const [travailAModifier, setTravailAModifier] = useState<Travail | null>(null);
  const navigate = useNavigate();

  // Mise à jour du state quand les pièces changent
  useEffect(() => {
    if (state.rooms.length > 0 && !pieceSelectionnee) {
      setPieceSelectionnee(state.rooms[0].id);
    } else if (state.rooms.length === 0) {
      setPieceSelectionnee(null);
    } else if (pieceSelectionnee && !state.rooms.find(room => room.id === pieceSelectionnee)) {
      // Si la pièce sélectionnée n'existe plus
      setPieceSelectionnee(state.rooms[0]?.id || null);
    }
  }, [state.rooms, pieceSelectionnee]);

  // Liste des pièces transformées pour l'interface
  const pieces = state.rooms.map(room => ({
    id: room.id,
    nom: room.customName || room.name,
    type: room.type,
    surface: Number(room.surface),
    surfaceMurs: Number(room.wallSurfaceRaw),
    plinthes: Number(room.totalPlinthLength),
    surfacePlinthes: Number(room.totalPlinthSurface),
    surfaceMenuiseries: Number(room.totalMenuiserieSurface),
    surfaceNetMurs: Number(room.netWallSurface),
    menuiseries: room.menuiseries
  }));

  // Sélection d'une pièce
  const selectionnerPiece = (pieceId: string) => {
    console.log("Sélection de la pièce:", pieceId);
    setPieceSelectionnee(pieceId);
    // Ne pas réinitialiser le travail à modifier si on change vers la pièce qui contient ce travail
    if (travailAModifier && travailAModifier.pieceId !== pieceId) {
      resetTravailAModifier();
    }
  };

  // Réinitialiser le travail en cours d'édition
  const resetTravailAModifier = () => {
    console.log("Réinitialisation du travail à modifier");
    setTravailAModifier(null);
  };

  // Obtenir la pièce sélectionnée
  const getPieceSelectionnee = () => {
    if (!pieceSelectionnee) return null;
    return pieces.find(piece => piece.id === pieceSelectionnee) || null;
  };

  // Ajouter ou modifier un travail
  const ajouterTravail = (travail: Omit<Travail, 'id'>) => {
    // Si on a un travail à modifier, on le modifie au lieu d'en ajouter un nouveau
    if (travailAModifier) {
      console.log("Modification du travail existant:", travailAModifier.id);
      const updatedTravail = {
        ...travail,
        id: travailAModifier.id
      };
      
      dispatch({ 
        type: 'UPDATE_TRAVAIL',
        payload: { id: travailAModifier.id, travail: updatedTravail }
      });
      
      toast({
        title: "Travail modifié",
        description: `Les modifications ont été enregistrées`,
      });
      
      resetTravailAModifier();
      return;
    }
    
    // C'est un nouveau travail
    const newTravail = {
      ...travail,
      id: uuidv4()
    };
    
    dispatch({ type: 'ADD_TRAVAIL', payload: newTravail });
    toast({
      title: "Travail ajouté",
      description: `${travail.typeTravauxLabel} - ${travail.sousTypeLabel} ajouté à la pièce ${travail.pieceName}`,
    });
  };

  // Charger un travail pour l'édition
  const preparerModificationTravail = (travail: Travail) => {
    console.log("Préparation pour modifier le travail:", travail);
    setTravailAModifier(travail);
    
    // Si c'est une autre pièce, on change la sélection de pièce
    if (travail.pieceId !== pieceSelectionnee) {
      setPieceSelectionnee(travail.pieceId);
    }
    
    toast({
      title: "Mode édition activé",
      description: `Vous pouvez maintenant modifier le travail`,
    });
  };

  // Supprimer un travail
  const supprimerTravail = (id: string) => {
    // Si on supprime le travail en cours d'édition, on réinitialise l'état
    if (travailAModifier && travailAModifier.id === id) {
      resetTravailAModifier();
    }
    
    dispatch({ type: 'DELETE_TRAVAIL', payload: id });
    toast({
      title: "Travail supprimé",
      description: "Le travail a été supprimé avec succès",
    });
  };

  // Obtenir les travaux pour une pièce spécifique
  const travauxParPiece = (pieceId: string) => {
    return state.travaux.filter(travail => 
      travail.pieceId === pieceId
    );
  };

  // Enregistrer les travaux
  const enregistrerTravaux = () => {
    // Les travaux sont déjà enregistrés automatiquement par le contexte
    toast({
      title: "Travaux enregistrés",
      description: "Tous les travaux ont été enregistrés avec succès",
    });
  };

  // Naviguer vers la page de récapitulatif
  const naviguerVersRecapitulatif = () => {
    navigate('/recapitulatif');
  };

  // Réinitialiser le projet
  const resetProject = () => {
    dispatch({ type: 'RESET_PROJECT' });
    toast({
      title: "Projet réinitialisé",
      description: "Toutes les données ont été effacées",
    });
  };

  // Récupérer le prix unitaire et l'unité d'un sous-type
  const getSousTypeInfo = (typeId: string, sousTypeId: string) => {
    const typeFound = typesState.types.find(type => type.id === typeId);
    if (!typeFound) return { prixUnitaire: 0, unite: "Unité" };
    
    const sousTypeFound = typeFound.sousTypes.find(st => st.id === sousTypeId);
    if (!sousTypeFound) return { prixUnitaire: 0, unite: "Unité" };
    
    return {
      prixUnitaire: sousTypeFound.prixUnitaire,
      unite: sousTypeFound.unite
    };
  };

  return {
    pieces,
    pieceSelectionnee,
    selectionnerPiece,
    getPieceSelectionnee,
    ajouterTravail,
    preparerModificationTravail,
    supprimerTravail,
    travauxParPiece,
    enregistrerTravaux,
    naviguerVersRecapitulatif,
    resetProject,
    getSousTypeInfo,
    travaux: state.travaux,
    travailAModifier,
    resetTravailAModifier
  };
};
