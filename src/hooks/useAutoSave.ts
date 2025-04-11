
import { useEffect, useRef } from 'react';
import { Room, Travail } from '@/types';
import { useProject } from '@/contexts/ProjectContext';
import { useProjectOperations } from '@/features/chantier/hooks/useProjectOperations';
import { useAppState } from './useAppState';

/**
 * Hook qui gère l'enregistrement automatique du projet en fonction des options
 * configurées par l'utilisateur et des événements du projet
 */
export const useAutoSave = () => {
  const { state, currentProjectId } = useProject();
  const { handleSaveProject } = useProjectOperations();
  const { appState } = useAppState();
  
  // Récupérer les options d'enregistrement automatique depuis l'état d'application
  const autoSaveOptions = appState?.auto_save_options || {
    enabled: false,
    saveOnRoomAdd: false,
    saveOnWorkAdd: true
  };
  
  // Références pour suivre les modifications
  const prevRoomsRef = useRef<Room[]>([]);
  const prevTravauxRef = useRef<Travail[]>([]);
  
  // Effet pour surveiller les changements dans les pièces
  useEffect(() => {
    // S'assurer que state existe
    if (!state || !currentProjectId || !autoSaveOptions.enabled || !autoSaveOptions.saveOnRoomAdd) {
      // Mettre à jour les références même si on ne sauvegarde pas
      if (state?.rooms) {
        prevRoomsRef.current = [...state.rooms];
      }
      return;
    }
    
    // Si le nombre de pièces a augmenté, c'est qu'on a ajouté une pièce
    if (state.rooms.length > prevRoomsRef.current.length) {
      console.log('Auto-save: Nouvelle pièce détectée, sauvegarde automatique...');
      handleSaveProject({ isAutoSave: true });
    }
    
    // Mettre à jour la référence
    prevRoomsRef.current = [...state.rooms];
  }, [state?.rooms, autoSaveOptions.enabled, autoSaveOptions.saveOnRoomAdd, currentProjectId, handleSaveProject]);
  
  // Effet pour surveiller les changements dans les travaux
  useEffect(() => {
    // S'assurer que state existe
    if (!state || !currentProjectId || !autoSaveOptions.enabled || !autoSaveOptions.saveOnWorkAdd) {
      // Mettre à jour les références même si on ne sauvegarde pas
      if (state?.travaux) {
        prevTravauxRef.current = [...state.travaux];
      }
      return;
    }
    
    // Si le nombre de travaux a augmenté, c'est qu'on a ajouté un travail
    if (state.travaux.length > prevTravauxRef.current.length) {
      console.log('Auto-save: Nouveau travail détecté, sauvegarde automatique...');
      handleSaveProject({ isAutoSave: true });
    }
    
    // Mettre à jour la référence
    prevTravauxRef.current = [...state.travaux];
  }, [state?.travaux, autoSaveOptions.enabled, autoSaveOptions.saveOnWorkAdd, currentProjectId, handleSaveProject]);
  
  return {
    autoSaveEnabled: autoSaveOptions.enabled && !!currentProjectId && !!state
  };
};
