
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type AutoSaveOptions = {
  enabled: boolean;
  saveOnRoomAdd: boolean;
  saveOnWorkAdd: boolean;
};

export type AppUser = {
  id: string;
  username: string;
  role: string;
};

export type AppState = {
  id?: string;
  user_id: string;
  current_project_id: string | null;
  auto_save_options: AutoSaveOptions;
};

export const useAppState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [appState, setAppState] = useState<AppState | null>(null);

  // Charger tous les utilisateurs
  const loadUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .order('username');
      
      if (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        toast.error('Erreur lors du chargement des utilisateurs');
        return [];
      }
      
      return data as AppUser[];
    } catch (error) {
      console.error('Exception lors du chargement des utilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
      return [];
    }
  }, []);

  // Charger l'état de l'application pour un utilisateur spécifique
  const loadAppState = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('app_state')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Aucun état trouvé pour cet utilisateur, on en crée un par défaut
          const defaultState: Omit<AppState, 'id'> = {
            user_id: userId,
            current_project_id: null,
            auto_save_options: {
              enabled: false,
              saveOnRoomAdd: false,
              saveOnWorkAdd: true
            }
          };
          
          // Insérer ce nouvel état dans la base de données
          const { data: newData, error: insertError } = await supabase
            .from('app_state')
            .insert(defaultState)
            .select()
            .single();
          
          if (insertError) {
            console.error('Erreur lors de la création de l\'état par défaut:', insertError);
            return null;
          }
          
          return newData as AppState;
        }
        
        console.error('Erreur lors du chargement de l\'état de l\'application:', error);
        return null;
      }
      
      return data as AppState;
    } catch (error) {
      console.error('Exception lors du chargement de l\'état de l\'application:', error);
      return null;
    }
  }, []);

  // Charger les utilisateurs au démarrage
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersList = await loadUsers();
        setUsers(usersList);
        
        // Par défaut, sélectionner l'Admin ou le premier utilisateur
        const adminUser = usersList.find(u => u.username === 'Admin');
        const defaultUser = adminUser || usersList[0];
        
        if (defaultUser) {
          setCurrentUser(defaultUser);
          const state = await loadAppState(defaultUser.id);
          if (state) {
            setAppState(state);
          }
        }
      } catch (error) {
        console.error('Erreur initiale:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [loadUsers, loadAppState]);

  // Changer d'utilisateur
  const switchUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const selectedUser = users.find(u => u.id === userId);
      if (!selectedUser) {
        toast.error('Utilisateur non trouvé');
        return false;
      }
      
      // Charger l'état de l'application pour cet utilisateur
      const state = await loadAppState(userId);
      if (state) {
        setAppState(state);
        setCurrentUser(selectedUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors du changement d\'utilisateur:', error);
      toast.error('Erreur lors du changement d\'utilisateur');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [users, loadAppState]);

  // Mettre à jour les options d'auto-sauvegarde
  const updateAutoSaveOptions = useCallback(async (options: AutoSaveOptions) => {
    if (!appState || !currentUser) {
      console.error("Tentative de mise à jour des options d'auto-sauvegarde sans utilisateur ou état d'application");
      return false;
    }
    
    try {
      console.log('Mise à jour des options d\'auto-sauvegarde dans la base de données:', options);
      
      // Utiliser explicitement last_updated_at pour forcer la mise à jour
      const now = new Date().toISOString();
      
      // Persister d'abord les changements dans l'état local avant l'appel API
      setAppState(prev => prev ? { 
        ...prev, 
        auto_save_options: options,
        last_updated_at: now
      } : null);
      
      const { data, error } = await supabase
        .from('app_state')
        .update({ 
          auto_save_options: options,
          last_updated_at: now
        })
        .eq('user_id', currentUser.id)
        .select();
      
      if (error) {
        console.error('Erreur lors de la mise à jour des options d\'auto-sauvegarde:', error);
        toast.error('Erreur lors de la mise à jour des options d\'auto-sauvegarde');
        return false;
      }
      
      console.log('Options d\'auto-sauvegarde mises à jour avec succès:', data);
      return true;
    } catch (error) {
      console.error('Exception lors de la mise à jour des options d\'auto-sauvegarde:', error);
      toast.error('Erreur lors de la mise à jour des options d\'auto-sauvegarde');
      return false;
    }
  }, [appState, currentUser]);

  // Mettre à jour le projet en cours
  const updateCurrentProject = useCallback(async (projectId: string | null) => {
    if (!currentUser) {
      console.error("Tentative de mise à jour du projet en cours sans utilisateur");
      return false;
    }
    
    try {
      console.log('Mise à jour du projet en cours dans la base de données:', { 
        userId: currentUser.id, 
        projectId
      });
      
      // Utiliser explicitement last_updated_at pour forcer la mise à jour
      const now = new Date().toISOString();
      
      // Persister d'abord les changements dans l'état local avant l'appel API
      setAppState(prev => {
        const updated = prev ? { 
          ...prev, 
          current_project_id: projectId,
          last_updated_at: now
        } : null;
        console.log('État local mis à jour:', updated);
        return updated;
      });
      
      const { data, error } = await supabase
        .from('app_state')
        .update({ 
          current_project_id: projectId,
          last_updated_at: now
        })
        .eq('user_id', currentUser.id)
        .select();
      
      if (error) {
        console.error('Erreur lors de la mise à jour du projet en cours:', error);
        toast.error('Erreur lors de la mise à jour du projet en cours');
        return false;
      }
      
      console.log('Mise à jour réussie de current_project_id dans app_state:', data);
      return true;
    } catch (error) {
      console.error('Exception lors de la mise à jour du projet en cours:', error);
      toast.error('Erreur lors de la mise à jour du projet en cours');
      return false;
    }
  }, [currentUser]);

  return {
    isLoading,
    currentUser,
    users,
    appState,
    switchUser,
    updateAutoSaveOptions,
    updateCurrentProject
  };
};
