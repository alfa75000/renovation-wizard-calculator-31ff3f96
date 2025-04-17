import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { PdfSettings, PdfSettingsSchema } from '@/services/pdf/config/pdfSettingsTypes';

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
  pdf_settings?: PdfSettings;
};

export const useAppState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [appState, setAppState] = useState<AppState | null>(null);

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
          const defaultState: Omit<AppState, 'id'> = {
            user_id: userId,
            current_project_id: null,
            auto_save_options: {
              enabled: false,
              saveOnRoomAdd: false,
              saveOnWorkAdd: true
            }
          };
          
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

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersList = await loadUsers();
        setUsers(usersList);
        
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

  const switchUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const selectedUser = users.find(u => u.id === userId);
      if (!selectedUser) {
        toast.error('Utilisateur non trouvé');
        return false;
      }
      
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

  const updateAutoSaveOptions = useCallback(async (options: AutoSaveOptions) => {
    if (!appState || !currentUser) {
      console.error("Tentative de mise à jour des options d'auto-sauvegarde sans utilisateur ou état d'application");
      return false;
    }
    
    try {
      setAppState(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          auto_save_options: options
        };
      });
      
      const { error } = await supabase
        .from('app_state')
        .update({ 
          auto_save_options: options
        })
        .eq('user_id', currentUser.id);
      
      if (error) {
        console.error('Erreur lors de la mise à jour des options d\'auto-sauvegarde:', error);
        toast.error('Erreur lors de la mise à jour des options d\'auto-sauvegarde');
        
        const freshState = await loadAppState(currentUser.id);
        if (freshState) {
          setAppState(freshState);
        }
        
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Exception lors de la mise à jour des options d\'auto-sauvegarde:', error);
      toast.error('Erreur lors de la mise à jour des options d\'auto-sauvegarde');
      
      const freshState = await loadAppState(currentUser.id);
      if (freshState) {
        setAppState(freshState);
      }
      
      return false;
    }
  }, [appState, currentUser, loadAppState]);

  const updateCurrentProject = useCallback(async (projectId: string | null) => {
    if (!currentUser) {
      console.error("Tentative de mise à jour du projet en cours sans utilisateur");
      return false;
    }
    
    try {
      setAppState(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          current_project_id: projectId
        };
      });
      
      const { error } = await supabase
        .from('app_state')
        .update({ current_project_id: projectId })
        .eq('user_id', currentUser.id);
      
      if (error) {
        console.error('Erreur lors de la mise à jour du projet en cours:', error);
        toast.error('Erreur lors de la mise à jour du projet en cours');
        
        const freshState = await loadAppState(currentUser.id);
        if (freshState) {
          setAppState(freshState);
        }
        
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Exception lors de la mise à jour du projet en cours:', error);
      toast.error('Erreur lors de la mise à jour du projet en cours');
      
      const freshState = await loadAppState(currentUser.id);
      if (freshState) {
        setAppState(freshState);
      }
      
      return false;
    }
  }, [currentUser, loadAppState]);

  const updatePdfSettings = useCallback(async (settings: PdfSettings) => {
    if (!appState || !currentUser) {
      console.error("Tentative de mise à jour des paramètres PDF sans utilisateur ou état d'application");
      return false;
    }
    
    try {
      setAppState(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          pdf_settings: settings
        };
      });
      
      const { error } = await supabase
        .from('app_state')
        .update({ pdf_settings: settings })
        .eq('user_id', currentUser.id);
      
      if (error) {
        console.error('Erreur lors de la mise à jour des paramètres PDF:', error);
        toast.error('Erreur lors de la mise à jour des paramètres PDF');
        
        const freshState = await loadAppState(currentUser.id);
        if (freshState) {
          setAppState(freshState);
        }
        
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Exception lors de la mise à jour des paramètres PDF:', error);
      toast.error('Erreur lors de la mise à jour des paramètres PDF');
      
      const freshState = await loadAppState(currentUser.id);
      if (freshState) {
        setAppState(freshState);
      }
      
      return false;
    }
  }, [appState, currentUser, loadAppState]);

  return {
    isLoading,
    currentUser,
    users,
    appState,
    switchUser,
    updateAutoSaveOptions,
    updateCurrentProject,
    updatePdfSettings
  };
};
