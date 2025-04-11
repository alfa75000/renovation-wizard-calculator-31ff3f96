
import { useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Room, Travail } from '@/types';
import { useProject } from '@/contexts/ProjectContext';
import { useProjectOperations } from '@/features/chantier/hooks/useProjectOperations';

/**
 * Hook qui gère l'enregistrement automatique du projet en fonction des options
 * configurées par l'utilisateur et des événements du projet
 */
export const useAutoSave = () => {
  const { state, currentProjectId } = useProject();
  const { handleSaveProject } = useProjectOperations();
  
  // Récupérer les options d'enregistrement automatique depuis le localStorage
  const [autoSaveOptions] = useLocalStorage('autoSaveOptions', {
    enabled: false,
    saveOnRoomAdd: false,
    saveOnWorkAdd: true
  });
  
  // Références pour suivre les modifications
  const prevRoomsRef = useRef<Room[]>([]);
  const prevTravauxRef = useRef<Travail[]>([]);
  
  // Effet pour surveiller les changements dans les pièces
  useEffect(() => {
    // Vérifier si l'enregistrement auto est activé et si un projet existe
    if (!autoSaveOptions.enabled || !currentProjectId) {
      // Mettre à jour les références même si on ne sauvegarde pas
      prevRoomsRef.current = [...state.rooms];
      return;
    }
    
    // Vérifier si l'option de sauvegarde lors de l'ajout de pièce est activée
    if (autoSaveOptions.saveOnRoomAdd) {
      // Si le nombre de pièces a augmenté, c'est qu'on a ajouté une pièce
      if (state.rooms.length > prevRoomsRef.current.length) {
        console.log('Auto-save: Nouvelle pièce détectée, sauvegarde automatique...');
        handleSaveProject();
      }
    }
    
    // Mettre à jour la référence
    prevRoomsRef.current = [...state.rooms];
  }, [state.rooms, autoSaveOptions, currentProjectId, handleSaveProject]);
  
  // Effet pour surveiller les changements dans les travaux
  useEffect(() => {
    // Vérifier si l'enregistrement auto est activé et si un projet existe
    if (!autoSaveOptions.enabled || !currentProjectId) {
      // Mettre à jour les références même si on ne sauvegarde pas
      prevTravauxRef.current = [...state.travaux];
      return;
    }
    
    // Vérifier si l'option de sauvegarde lors de l'ajout de travaux est activée
    if (autoSaveOptions.saveOnWorkAdd) {
      // Si le nombre de travaux a augmenté, c'est qu'on a ajouté un travail
      if (state.travaux.length > prevTravauxRef.current.length) {
        console.log('Auto-save: Nouveau travail détecté, sauvegarde automatique...');
        handleSaveProject();
      }
    }
    
    // Mettre à jour la référence
    prevTravauxRef.current = [...state.travaux];
  }, [state.travaux, autoSaveOptions, currentProjectId, handleSaveProject]);
  
  return {
    autoSaveEnabled: autoSaveOptions.enabled && !!currentProjectId
  };
};
