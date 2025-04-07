
import { useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Travail, Room } from '@/types';
import { useProject } from '@/contexts/ProjectContext';
import { useTravauxTypes } from '@/contexts/TravauxTypesContext';
import { v4 as uuidv4 } from 'uuid';

export const useTravaux = () => {
  const { state: projectState } = useProject();
  const { state: travauxTypesState } = useTravauxTypes();
  
  // Stocker les travaux par ID de pièce
  const [travaux, setTravaux] = useLocalStorage<Travail[]>('travaux', []);
  
  // Fonction pour ajouter un travail
  const addTravail = (travailData: Omit<Travail, 'id'>) => {
    // Générer un ID unique
    const newTravail: Travail = {
      ...travailData,
      id: uuidv4(),
    };
    
    setTravaux((prevTravaux) => [...prevTravaux, newTravail]);
    return newTravail;
  };
  
  // Fonction pour mettre à jour un travail
  const updateTravail = (id: string, travailData: Partial<Travail>) => {
    setTravaux((prevTravaux) =>
      prevTravaux.map((travail) =>
        travail.id === id ? { ...travail, ...travailData } : travail
      )
    );
  };
  
  // Fonction pour supprimer un travail
  const deleteTravail = (id: string) => {
    setTravaux((prevTravaux) => prevTravaux.filter((travail) => travail.id !== id));
  };
  
  // Fonction pour obtenir les travaux d'une pièce
  const getTravauxForPiece = (pieceId: string): Travail[] => {
    return travaux.filter((travail) => travail.pieceId === pieceId);
  };
  
  // Fonction pour obtenir tous les travaux
  const getAllTravaux = (): Travail[] => {
    return travaux;
  };
  
  // Fonction pour obtenir le détail complet d'un travail (avec les infos du type et sous-type)
  const getTravailDetails = (travailId: string) => {
    const travail = travaux.find((t) => t.id === travailId);
    if (!travail) return null;
    
    const typeTravaux = travauxTypesState.types.find((type) => type.id === travail.typeTravauxId);
    const sousType = typeTravaux?.sousTypes.find((st) => st.id === travail.sousTypeId);
    
    return {
      travail,
      typeTravaux,
      sousType,
    };
  };
  
  // Fonction pour calculer le total des travaux
  const calculerTotalTravaux = (): number => {
    return travaux.reduce(
      (total, travail) => total + travail.quantite * (travail.prixFournitures + travail.prixMainOeuvre),
      0
    );
  };
  
  // Fonction pour calculer le total des travaux par pièce
  const calculerTotalTravauxParPiece = (pieceId: string): number => {
    return getTravauxForPiece(pieceId).reduce(
      (total, travail) => total + travail.quantite * (travail.prixFournitures + travail.prixMainOeuvre),
      0
    );
  };
  
  // Nettoyage des travaux orphelins (pièces supprimées)
  useEffect(() => {
    const pieceIds = projectState.rooms.map((room) => room.id);
    const travauxOrphelins = travaux.filter((travail) => !pieceIds.includes(travail.pieceId));
    
    if (travauxOrphelins.length > 0) {
      setTravaux((prevTravaux) => 
        prevTravaux.filter((travail) => pieceIds.includes(travail.pieceId))
      );
    }
  }, [projectState.rooms, travaux, setTravaux]);
  
  return {
    travaux,
    addTravail,
    updateTravail,
    deleteTravail,
    getTravauxForPiece,
    getAllTravaux,
    getTravailDetails,
    calculerTotalTravaux,
    calculerTotalTravauxParPiece,
  };
};
