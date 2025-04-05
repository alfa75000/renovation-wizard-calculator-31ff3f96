
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Travail, Piece } from '@/types';
import { useProject } from '@/contexts/ProjectContext';
import { arrondir2Decimales } from '@/lib/utils';

// Fonction utilitaire pour normaliser les pièces
const normaliserPieces = (pieces: any[]): Piece[] => {
  return pieces.map(piece => {
    return {
      id: piece.id,
      nom: piece.name || 
           (piece.type && piece.customName ? `${piece.type} ${piece.customName}` : null) ||
           (piece.type ? `${piece.type}` : null) ||
           "Pièce sans nom",
      surface: parseFloat(piece.surface || "0"),
      surfaceMurs: parseFloat(piece.netWallSurface || piece.wallSurfaceRaw || "0"),
      plinthes: parseFloat(piece.totalPlinthLength || "0"),
      surfacePlinthes: parseFloat(piece.totalPlinthSurface || "0"),
      surfaceMenuiseries: parseFloat(piece.totalMenuiserieSurface || "0"),
      surfaceNetMurs: parseFloat(piece.netWallSurface || "0"),
      menuiseries: (piece.menuiseries || []).map((m: any) => ({
        id: m.id,
        nom: m.name,
        type: m.type?.toLowerCase() || "",
        largeur: parseFloat(m.largeur || m.width || "0"),
        hauteur: parseFloat(m.hauteur || m.height || "0"),
        surface: parseFloat(m.surface || "0"),
        quantity: m.quantity || 1
      }))
    };
  });
};

export const useTravaux = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useProject();
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [pieceSelectionnee, setPieceSelectionnee] = useState<number | null>(null);
  const [editingTravail, setEditingTravail] = useState<string | null>(null);

  // Charger les pièces depuis les données du contexte
  useEffect(() => {
    const piecesSauvegardees = state.rooms;
    if (piecesSauvegardees && piecesSauvegardees.length > 0) {
      const piecesNormalisees = normaliserPieces(piecesSauvegardees);
      setPieces(piecesNormalisees);
      
      // Si aucune pièce n'est sélectionnée mais qu'il y a des pièces disponibles,
      // sélectionner la première pièce par défaut
      if (pieceSelectionnee === null && piecesNormalisees.length > 0) {
        setPieceSelectionnee(Number(piecesNormalisees[0].id));
      }
    } else {
      // S'il n'y a pas de pièces, réinitialiser la sélection
      setPieces([]);
      setPieceSelectionnee(null);
    }
  }, [state.rooms, pieceSelectionnee]);

  // Sélectionner une pièce
  const selectionnerPiece = (pieceId: number) => {
    setPieceSelectionnee(pieceId);
    setEditingTravail(null);
  };

  // Obtenir la pièce sélectionnée
  const getPieceSelectionnee = () => {
    return pieces.find(p => Number(p.id) === pieceSelectionnee) || null;
  };

  // Ajouter un travail
  const ajouterTravail = (nouveauTravail: Omit<Travail, 'id'>) => {
    const travail: Travail = {
      ...nouveauTravail,
      id: Date.now().toString()
    };

    dispatch({ type: 'ADD_TRAVAIL', payload: travail });

    toast.success(`${travail.typeTravauxLabel}: ${travail.sousTypeLabel} ajouté pour ${travail.pieceName}`);
  };

  // Modifier un travail existant
  const modifierTravail = (travail: Travail) => {
    setPieceSelectionnee(travail.pieceId);
    setEditingTravail(travail.id);
    
    // Supprimer l'ancien travail
    supprimerTravail(travail.id);
  };

  // Supprimer un travail
  const supprimerTravail = (id: string) => {
    dispatch({ type: 'DELETE_TRAVAIL', payload: id });
    
    toast.success("Travail supprimé avec succès");
  };

  // Obtenir tous les travaux pour une pièce spécifique
  const travauxParPiece = (pieceId: number) => {
    return state.travaux.filter(t => t.pieceId === pieceId);
  };

  // Calculer le total des travaux
  const calculerTotal = () => {
    return arrondir2Decimales(
      state.travaux.reduce((total, travail) => {
        return total + (travail.quantite * travail.prixUnitaire);
      }, 0)
    );
  };

  // Enregistrer explicitement les travaux (même si c'est déjà fait dans le context)
  const enregistrerTravaux = () => {
    // Les travaux sont déjà enregistrés via le contexte, mais on peut ajouter une confirmation
    toast.success("Travaux enregistrés avec succès");
  };

  // Naviguer vers la page récapitulative
  const naviguerVersRecapitulatif = () => {
    navigate('/recapitulatif');
  };

  // Réinitialiser le projet
  const resetProject = () => {
    dispatch({ type: 'RESET_PROJECT' });
    navigate('/');
    
    toast.success("Projet réinitialisé avec succès");
  };

  return {
    pieces,
    pieceSelectionnee,
    travaux: state.travaux,
    editingTravail,
    selectionnerPiece,
    getPieceSelectionnee,
    ajouterTravail,
    modifierTravail,
    supprimerTravail,
    travauxParPiece,
    calculerTotal,
    enregistrerTravaux,
    naviguerVersRecapitulatif,
    resetProject
  };
};
