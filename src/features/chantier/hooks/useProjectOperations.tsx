import { useCallback } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';
import { ProjectMetadata } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAppState, AppState } from '@/hooks/useAppState'; // Importer AppState si nécessaire

/**
 * Hook centralisant toutes les opérations liées aux projets
 */
export const useProjectOperations = () => {
  const {
    loadProject,
    deleteCurrentProject,
    // Renommer mais ne pas utiliser cette fonction de sauvegarde du contexte
    saveProject: contextSaveProject,
    currentProjectId,
    projects,
    hasUnsavedChanges,
    isLoading,
    state,
    refreshProjects,
    // Fonction pour mettre à jour l\'ID du projet courant
    setCurrentProjectId,
    // Importation de la fonction updateSavedState pour mettre à jour l\'état de sauvegarde
    updateSavedState,
    // Fonction pour réinitialiser le projet
    createNewProject
  } = useProject();

  // Utiliser le hook d'état d'application pour mettre à jour le projet en cours
  const { updateCurrentProject, currentUser } = useAppState();

  /**
   * Vérifie si un numéro de devis existe déjà pour l'utilisateur courant.
   * @param devisNumber Le numéro de devis à vérifier.
   * @returns Promise<boolean> True si le numéro existe, false sinon.
   */
  const checkDevisNumberExists = useCallback(async (devisNumber: string): Promise<boolean> => {
    if (!currentUser) {
      console.error('Aucun utilisateur courant pour vérifier le numéro de devis.');
      // Dans ce cas, on considère qu'il n'existe pas pour éviter de bloquer,
      // mais une gestion d'erreur plus robuste pourrait être envisagée.
      return false;
    }
    if (!devisNumber) {
       // Si pas de numéro de devis, il n'existe pas (pour cette vérification spécifique)
       return false;
    }
    try {
      const { data, error } = await supabase
        .from('projects_save')
        .select('id')
        .eq('devis_number', devisNumber)
        .eq('user_id', currentUser.id) // Vérifier uniquement pour l'utilisateur courant
        .limit(1)
        .maybeSingle(); // Utiliser maybeSingle pour gérer le cas où 0 ou 1 résultat est trouvé

      if (error) {
        console.error('Erreur lors de la vérification du numéro de devis:', error);
        // En cas d'erreur, par sécurité, on peut considérer qu'il existe
        // pour éviter d'écraser un projet potentiel.
        toast.error('Erreur lors de la vérification de l\'existence du numéro de devis.');
        return true; // Consider it exists to be safe
      }

      // Si data n'est pas null, cela signifie qu'un enregistrement avec ce devis_number existe.
      return data !== null;

    } catch (error) {
      console.error('Exception lors de la vérification du numéro de devis:', error);
      toast.error('Une erreur inattendue est survenue lors de la vérification du numéro de devis.');
      return true; // Consider it exists to be safe
    }
  }, [currentUser]);


  /**
   * Fonction pour créer un nouveau projet vide et réinitialiser l\'état
   * Cette fonction est utilisée par le bouton \"Nouveau\" dans ProjectBar
   */
  const handleNewProject = useCallback(async () => {
    // Identifiant unique pour le toast de nouvelle projet
    const toastId = 'new-project';
    toast.loading('Création d\'un nouveau projet...', { id: toastId });

    try {
      // Réinitialiser l\'état du projet avec la fonction du contexte
      createNewProject();

      // Mettre à jour l\'ID de projet courant dans app_state à NULL
      if (currentUser) {
        const success = await updateCurrentProject(null);
        if (success) {
           toast.success('Nouveau projet créé', { id: toastId });
        } else {
           // Tenter une mise à jour directe si l'updateCurrentProject échoue
           const { error } = await supabase
             .from('app_state')
             .update({ current_project_id: null })
             .eq('user_id', currentUser.id);

           if (error) {
             console.error('Échec de la mise à jour directe de current_project_id à NULL:', error);
             toast.error('Erreur lors de la mise à jour de l\'état de l\'application.', { id: toastId });
           } else {
             toast.success('Nouveau projet créé', { id: toastId });
           }
        }
      } else {
         toast.success('Nouveau projet créé', { id: toastId });
      }

      // Après création ou chargement, on considère qu'il n'y a pas de changements non sauvegardés initialement
      updateSavedState(true); // Marquer comme sauvegardé

      return true;
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du projet:', error);
      toast.error('Une erreur est survenue lors de la réinitialisation du projet', { id: toastId });
      return false;
    }
  }, [createNewProject, updateCurrentProject, currentUser, updateSavedState]);


  /**
   * Charger un projet existant
   */
  const handleChargerProjet = useCallback(async (projetId: string) => {
     const toastId = 'loading-project';
     toast.loading('Chargement du projet...', { id: toastId });
    try {
      await loadProject(projetId);
      console.log('Projet chargé, mise à jour de current_project_id dans app_state:', projetId);

      // Mettre à jour l\'ID du projet en cours dans l\'état de l\'application
      if (currentUser) {
        const success = await updateCurrentProject(projetId);
        if (!success) {
          console.error('Échec de la mise à jour de current_project_id dans app_state');

          // Tentative de mise à jour directe
          try {
            const { error } = await supabase
              .from('app_state')
              .update({ current_project_id: projetId })
              .eq('user_id', currentUser.id);

            if (error) {
              console.error('Échec de la mise à jour directe:', error);
              toast.error('Erreur lors de la mise à jour de l\'état de l\'application après chargement.', { id: toastId });
            } else {
              console.log('Mise à jour directe réussie');
              toast.success('Projet chargé avec succès', { id: toastId });
            }
          } catch (e) {
            console.error('Exception lors de la mise à jour directe:', e);
            toast.error('Une erreur inattendue est survenue après le chargement du projet.', { id: toastId });
          }
        } else {
          console.log('Mise à jour de current_project_id réussie');
          toast.success('Projet chargé avec succès', { id: toastId });
        }
      } else {
         toast.success('Projet chargé avec succès', { id: toastId });
        console.error('Pas d\'utilisateur courant pour la mise à jour de app_state');
      }

      // Après chargement, on considère qu'il n'y a pas de changements non sauvegardés
      updateSavedState(true); // Marquer comme sauvegardé

    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Une erreur est survenue lors du chargement du projet', { id: toastId });
    }
  }, [loadProject, updateCurrentProject, currentUser, updateSavedState]);

  /**
   * Supprimer le projet actuel
   */
  const handleDeleteProject = useCallback(async () => {
     const toastId = 'deleting-project';
     toast.loading('Suppression du projet...', { id: toastId });
    try {
      await deleteCurrentProject();
      // Mettre à jour l\'ID du projet en cours dans l\'état de l\'application
      if (currentUser) {
        await updateCurrentProject(null);
      }
      toast.success('Projet supprimé avec succès', { id: toastId });
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      toast.error('Une erreur est survenue lors de la suppression du projet', { id: toastId });
      return false;
    }
  }, [deleteCurrentProject, updateCurrentProject, currentUser]);

  /**
   * Fonction centralisée de sauvegarde de projet (Enregistrer)
   * Gère l'UPDATE pour un projet existant ou l'INSERT initial.
   * Utilisée par le bouton "Enregistrer" et l'auto-sauvegarde.
   */
  const handleSaveProject = useCallback(async (projectInfo?: any) => {
    // Identifiant unique pour le toast de sauvegarde
    const toastId = 'saving-project';

    // Ne pas afficher de toast pour l'auto-sauvegarde (sauf erreur)
    const isAutoSave = projectInfo?.isAutoSave;

    try {
      if (!isAutoSave) {
        // Afficher un toast de chargement uniquement pour les sauvegardes manuelles
        toast.loading('Sauvegarde en cours...', { id: toastId });
      }

      // Vérifier que state existe
      if (!state) {
        console.error('Erreur: state est undefined dans handleSaveProject');
        if (!isAutoSave) {
          toast.error('Erreur lors de la sauvegarde du projet: état non disponible', { id: toastId });
        }
        return { success: false, error: 'État du projet non disponible' };
      }

       if (!currentUser) {
           const errorMsg = 'Aucun utilisateur connecté pour sauvegarder le projet.';
           console.error(errorMsg);
           if (!isAutoSave) {
                toast.error(errorMsg, { id: toastId });
           }
           return { success: false, error: errorMsg };
       }

      // Créer un objet metadata par défaut avec la structure appropriée
      const defaultMetadata: ProjectMetadata = {
        clientId: '',
        nomProjet: '',
        descriptionProjet: '',
        adresseChantier: '',
        occupant: '',
        infoComplementaire: '',
        dateDevis: '',
        devisNumber: ''
      };

      // Valider que le client ID est présent en utilisant le metadata approprié
      const metadata = state.metadata || defaultMetadata;
      const clientId = metadata.clientId || projectInfo?.client_id;

      if (!clientId) {
        const errorMsg = 'Veuillez sélectionner un client avant de sauvegarder le projet';
        if (!isAutoSave) {
            toast.error(errorMsg, { id: toastId });
        }
        return { success: false, error: errorMsg };
      }

      // Préparer les données du projet
      const combinedProjectInfo = {
        user_id: currentUser.id, // Assurez-vous que l'user_id est toujours présent
        client_id: clientId,
        name: metadata.nomProjet || projectInfo?.name || 'Projet sans nom',
        description: metadata.descriptionProjet || projectInfo?.description || '',
        address: metadata.adresseChantier || projectInfo?.address || '',
        occupant: metadata.occupant || projectInfo?.occupant || '',
        general_data: {
          infoComplementaire: metadata.infoComplementaire || projectInfo?.general_data?.infoComplementaire || '',
          dateDevis: metadata.dateDevis || projectInfo?.general_data?.dateDevis || new Date().toISOString().split('T')[0]
        },
        devis_number: metadata.devisNumber || projectInfo?.devis_number || '',
        project_data: {
          property: state.property || {
            type: 'Appartement',
            floors: 1,
            totalArea: 0,
            rooms: 0,
            ceilingHeight: 2.5,
          },
          rooms: state.rooms || [],
          travaux: state.travaux || [],
          metadata: metadata // Inclure toujours les metadata complets
        },
         // Supabase gère created_at et updated_at automatiquement si les colonnes existent
         // Mais pour "Enregistrer Sous", nous voudrons un nouveau created_at/updated_at
         // Ici, pour "Enregistrer", on laisse Supabase faire la mise à jour
      };


      if (!isAutoSave) {
        console.log('Données du projet avant sauvegarde (Enregistrer):', combinedProjectInfo);
      }

      let result;

      // Sauvegarde selon qu\'on modifie un projet existant ou qu\'on en crée un nouveau
      if (currentProjectId) {
        // Mise à jour du projet existant
        if (!isAutoSave) {
          console.log('Mise à jour du projet existant:', currentProjectId);
        }
        const { data, error } = await supabase
          .from('projects_save')
          .update(combinedProjectInfo)
          .eq('id', currentProjectId)
          .select();

        if (error) {
          console.error('Erreur lors de la mise à jour du projet:', error);
          if (!isAutoSave) {
            toast.error('Erreur lors de la mise à jour du projet', { id: toastId });
          }
          return { success: false, error: error.message };
        }

        if (!isAutoSave) {
          console.log('Projet mis à jour avec succès:', data);
          toast.success('Projet mis à jour avec succès', { id: toastId });
        }
        result = data;
      } else {
        // Création d'un nouveau projet (INSERT initial lors du premier "Enregistrer")
        if (!isAutoSave) {
          console.log('Création d\'un nouveau projet avec client_id:', clientId);
        }
        try {
          const { data, error } = await supabase
            .from('projects_save')
            .insert(combinedProjectInfo)
            .select();

          if (error) {
            console.error('Erreur lors de la création du projet (INSERT initial):', error);
            if (!isAutoSave) {
              toast.error('Erreur lors de la création du projet', { id: toastId });
            }
            return { success: false, error: error.message };
          }

          if (!isAutoSave) {
            console.log('Projet créé avec succès (INSERT initial):', data);
            toast.success('Projet créé avec succès', { id: toastId });
          }
          result = data;

          // Mettre à jour l'ID du projet courant pour éviter les doubles créations
          if (data && data[0] && data[0].id) {
            setCurrentProjectId(data[0].id);
             // Mettre à jour l'état de l'application avec le nouvel ID
            if (currentUser) {
               await updateCurrentProject(data[0].id);
            }
          }
        } catch (innerError: any) {
          console.error('Exception lors de la création du projet (INSERT initial):', innerError);
          if (!isAutoSave) {
            toast.error(`Erreur lors de la création du projet: ${innerError.message || 'Erreur inconnue'}`, { id: toastId });
          }
          return { success: false, error: innerError.message || 'Erreur inconnue' };
        }
      }

      // Mettre à jour l'état de sauvegarde pour indiquer que le projet est sauvegardé
      updateSavedState(true); // Marquer comme sauvegardé

      // Rafraîchir la liste des projets après la sauvegarde
      await refreshProjects();
      return { success: true, projectId: result && result[0] ? result[0].id : null };

    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement du projet (handleSaveProject):', error);
      if (!isAutoSave) {
        toast.error('Erreur lors de l\'enregistrement du projet', { id: toastId });
      }
      return { success: false, error: error.message || 'Erreur inconnue' };
    }
  }, [state, currentProjectId, refreshProjects, setCurrentProjectId, updateSavedState, updateCurrentProject, currentUser]);

  /**
   * Fonction pour enregistrer le projet sous un nouveau numéro de devis (Enregistrer Sous)
   * Crée toujours un nouvel enregistrement dans la base de données.
   */
  const handleSaveProjectAs = useCallback(async () => {
     const toastId = 'saving-project-as';
     toast.loading('Enregistrement sous...', { id: toastId });

     try {
        if (!state) {
           const errorMsg = 'Erreur: état du projet non disponible pour "Enregistrer Sous"';
           console.error(errorMsg);
           toast.error(errorMsg, { id: toastId });
           return { success: false, error: errorMsg };
        }

        if (!currentUser) {
           const errorMsg = 'Aucun utilisateur connecté pour "Enregistrer Sous".';
           console.error(errorMsg);
           toast.error(errorMsg, { id: toastId });
           return { success: false, error: errorMsg };
        }

        // Récupérer le numéro de devis actuel
        const currentDevisNumber = state.metadata?.devisNumber;

        if (!currentDevisNumber) {
             const errorMsg = 'Le numéro de devis est manquant. Veuillez définir un numéro avant d\'enregistrer sous.';
             console.error(errorMsg);
             toast.error(errorMsg, { id: toastId });
             return { success: false, error: errorMsg };
        }

        // --- Vérification d'existence du numéro de devis ---
        const devisNumberExists = await checkDevisNumberExists(currentDevisNumber);

        if (devisNumberExists) {
           const errorMsg = `Le numéro de devis "${currentDevisNumber}" existe déjà. Veuillez en choisir un autre pour "Enregistrer Sous".`;
           console.warn(errorMsg);
           toast.error(errorMsg, { id: toastId, duration: 5000 }); // Laisser le message plus longtemps
           return { success: false, error: errorMsg }; // Sortir sans sauvegarder
        }
        // --- Fin de vérification ---

        // Préparer les données du projet pour l'INSERT
        // Reprendre la structure de handleSaveProject mais forcer de nouvelles dates
        const defaultMetadata: ProjectMetadata = {
            clientId: '', nomProjet: '', descriptionProjet: '',
            adresseChantier: '', occupant: '', infoComplementaire: '',
            dateDevis: '', devisNumber: ''
        };
        const metadata = state.metadata || defaultMetadata;
        const clientId = metadata.clientId; // On devrait avoir un client ID valide ici grâce à la vérification dans handleSaveProject si un projet a déjà été sauvegardé, mais on le reprend de l'état.

        if (!clientId) {
            const errorMsg = 'Client non défini dans l\'état actuel du projet.';
             console.error(errorMsg);
             toast.error(errorMsg, { id: toastId });
             return { success: false, error: errorMsg };
        }


        const combinedProjectInfo = {
            user_id: currentUser.id,
            client_id: clientId,
            name: metadata.nomProjet || 'Projet sans nom (copie)', // Optionnel: ajouter "(copie)"
            description: metadata.descriptionProjet || '',
            address: metadata.adresseChantier || '',
            occupant: metadata.occupant || '',
            general_data: {
              infoComplementaire: metadata.infoComplementaire || '',
              dateDevis: metadata.dateDevis || new Date().toISOString().split('T')[0]
            },
            devis_number: currentDevisNumber, // Utiliser le numéro de devis vérifié
            project_data: {
                property: state.property || {
                    type: 'Appartement', floors: 1, totalArea: 0, rooms: 0, ceilingHeight: 2.5,
                },
                rooms: state.rooms || [],
                travaux: state.travaux || [],
                metadata: metadata // Inclure toujours les metadata complets
            },
            // Supabase ajoutera created_at et updated_at avec la date/heure actuelles pour le nouvel enregistrement
        };

        console.log('Données du projet avant sauvegarde (Enregistrer Sous):', combinedProjectInfo);

        // Effectuer l'INSERT du nouveau projet
        const { data, error } = await supabase
            .from('projects_save')
            .insert(combinedProjectInfo)
            .select(); // Sélectionner les données insérées pour récupérer le nouvel ID

        if (error) {
            console.error('Erreur lors de la création du projet ("Enregistrer Sous"):', error);
            toast.error('Erreur lors de l\'enregistrement sous.', { id: toastId });
            return { success: false, error: error.message };
        }

        console.log('Projet enregistré sous succès:', data);
        toast.success('Projet enregistré sous succès !', { id: toastId });

        // Mettre à jour l'ID du projet courant dans le contexte et l'état de l'application
        // pour que l'utilisateur continue de travailler sur la nouvelle copie.
        if (data && data[0] && data[0].id) {
           const newProjectId = data[0].id;
           setCurrentProjectId(newProjectId);
           if (currentUser) {
              await updateCurrentProject(newProjectId);
           }
            // Marquer comme sauvegardé (puisqu'on vient juste de l'enregistrer)
           updateSavedState(true);
        } else {
            // Ceci ne devrait pas arriver si select() réussit, mais par sécurité
             console.error('Impossible de récupérer le nouvel ID du projet après "Enregistrer Sous".');
             // L'état de sauvegarde peut être incertain ici.
        }


        // Rafraîchir la liste des projets après la sauvegarde
        await refreshProjects();

        return { success: true, projectId: data && data[0] ? data[0].id : null };

     } catch (error: any) {
        console.error('Erreur lors de l\'enregistrement sous (handleSaveProjectAs):', error);
        toast.error('Une erreur inattendue est survenue lors de l\'enregistrement sous.', { id: toastId });
        return { success: false, error: error.message || 'Erreur inconnue' };
     }

  }, [state, currentUser, refreshProjects, setCurrentProjectId, updateCurrentProject, updateSavedState, checkDevisNumberExists]); // Inclure checkDevisNumberExists dans les dépendances


  return {
    handleChargerProjet,
    handleDeleteProject,
    handleSaveProject,       // Pour le bouton "Enregistrer"
    handleSaveProjectAs,     // Pour le bouton "Enregistrer Sous"
    handleNewProject,
    currentProjectId,
    projects,
    hasUnsavedChanges,
    isLoading,
    projectState: state
  };
};
