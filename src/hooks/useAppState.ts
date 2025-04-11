
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
      console.log('Chargement de l\'état de l\'application pour l\'utilisateur:', userId);
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
          
          console.log('Nouvel état d\'application créé:', newData);
          return newData as AppState;
        }
        
        console.error('Erreur lors du chargement de l\'état de l\'application:', error);
        return null;
      }
      
      console.log('État de l\'application chargé:', data);
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

  // Mettre à jour les options d'auto-sauvegarde de manière fiable
  const updateAutoSaveOptions = useCallback(async (options: AutoSaveOptions) => {
    if (!appState || !currentUser) {
      console.error("Tentative de mise à jour des options d'auto-sauvegarde sans utilisateur ou état d'application");
      return false;
    }
    
    try {
      console.log('Mise à jour des options d\'auto-sauvegarde dans la base de données:', options);
      
      // Mettre à jour l'état local immédiatement pour une réactivité de l'UI
      setAppState(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          auto_save_options: options
        };
      });
      
      // Persister dans la base de données
      const { error } = await supabase
        .from('app_state')
        .update({ 
          auto_save_options: options,
          last_updated_at: new Date().toISOString()
        })
        .eq('user_id', currentUser.id);
      
      if (error) {
        console.error('Erreur lors de la mise à jour des options d\'auto-sauvegarde:', error);
        
        // Restaurer l'état précédent en cas d'erreur
        toast.error('Erreur lors de la mise à jour des options d\'auto-sauvegarde');
        
        // Recharger l'état depuis la base de données pour être sûr
        const freshState = await loadAppState(currentUser.id);
        if (freshState) {
          setAppState(freshState);
        }
        
        return false;
      }
      
      console.log('Options d\'auto-sauvegarde mises à jour avec succès');
      return true;
    } catch (error) {
      console.error('Exception lors de la mise à jour des options d\'auto-sauvegarde:', error);
      toast.error('Erreur lors de la mise à jour des options d\'auto-sauvegarde');
      
      // Recharger l'état depuis la base de données pour être sûr
      const freshState = await loadAppState(currentUser.id);
      if (freshState) {
        setAppState(freshState);
      }
      
      return false;
    }
  }, [appState, currentUser, loadAppState]);

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
      
      // Mettre à jour l'état local immédiatement avant l'appel API
      setAppState(prev => {
        if (!prev) return null;
        const updated = { 
          ...prev, 
          current_project_id: projectId
        };
        console.log('État local mis à jour:', updated);
        return updated;
      });
      
      const { error } = await supabase
        .from('app_state')
        .update({ 
          current_project_id: projectId,
          last_updated_at: new Date().toISOString()
        })
        .eq('user_id', currentUser.id);
      
      if (error) {
        console.error('Erreur lors de la mise à jour du projet en cours:', error);
        
        // Restaurer l'état précédent en cas d'échec
        toast.error('Erreur lors de la mise à jour du projet en cours');
        
        // Recharger l'état depuis la base de données pour être sûr
        const freshState = await loadAppState(currentUser.id);
        if (freshState) {
          setAppState(freshState);
        }
        
        return false;
      }
      
      console.log('Mise à jour réussie de current_project_id dans app_state');
      return true;
    } catch (error) {
      console.error('Exception lors de la mise à jour du projet en cours:', error);
      toast.error('Erreur lors de la mise à jour du projet en cours');
      
      // Recharger l'état depuis la base de données pour être sûr
      const freshState = await loadAppState(currentUser.id);
      if (freshState) {
        setAppState(freshState);
      }
      
      return false;
    }
  }, [currentUser, loadAppState]);

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
