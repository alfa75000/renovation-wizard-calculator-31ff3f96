
import { useState, useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { useClients } from '@/contexts/ClientsContext';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { generateDevisNumber, findDefaultClientId } from '@/services/devisService';

export const useChantierForm = () => {
  const { 
    state: projectState, 
    isLoading,
    projects, 
    currentProjectId,
    hasUnsavedChanges,
    loadProject,
    deleteCurrentProject,
    saveProject
  } = useProject();
  
  const [clientId, setClientId] = useState<string>('');
  const [nomProjet, setNomProjet] = useState<string>('');
  const [descriptionProjet, setDescriptionProjet] = useState<string>('');
  const [adresseChantier, setAdresseChantier] = useState<string>('');
  const [occupant, setOccupant] = useState<string>('');
  const [infoComplementaire, setInfoComplementaire] = useState<string>('');
  const [dateDevis, setDateDevis] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [devisNumber, setDevisNumber] = useState<string>('');
  const [isFirstRoom, setIsFirstRoom] = useState<boolean>(true);
  
  const { state: clientsState } = useClients();
  const clientSelectionne = clientsState.clients.find(c => c.id === clientId);
  
  // Surveiller l'ajout de la première pièce
  useEffect(() => {
    const checkFirstRoomAdded = async () => {
      // Si nous avons une première pièce ajoutée et que c'est la première fois qu'on le détecte
      if (projectState?.rooms?.length === 1 && isFirstRoom) {
        setIsFirstRoom(false); // Ne plus exécuter cette logique pour les futures mises à jour
        console.log("Première pièce détectée - initialisation des champs");
        
        // Si pas de client sélectionné, sélectionner "Client à définir"
        if (!clientId) {
          const defaultClientId = await findDefaultClientId();
          if (defaultClientId) {
            setClientId(defaultClientId);
            console.log("Client par défaut sélectionné:", defaultClientId);
          }
        }
        
        // Si pas de numéro de devis, en générer un automatiquement
        if (!devisNumber) {
          try {
            const newDevisNumber = await generateDevisNumber();
            setDevisNumber(newDevisNumber);
            console.log("Numéro de devis généré:", newDevisNumber);
          } catch (error) {
            console.error("Erreur lors de la génération du numéro de devis:", error);
          }
        }
        
        // Si pas de description, utiliser "Projet en cours"
        if (!descriptionProjet) {
          setDescriptionProjet("Projet en cours");
          console.log("Description par défaut ajoutée");
        }
        
        toast.info("Informations du projet initialisées automatiquement");
      }
      
      // Réinitialiser le flag si aucune pièce n'est présente
      if (projectState?.rooms?.length === 0 && !isFirstRoom) {
        setIsFirstRoom(true);
      }
    };
    
    checkFirstRoomAdded();
  }, [projectState?.rooms, clientId, devisNumber, descriptionProjet, isFirstRoom]);
  
  // Charger les données du projet quand le projet courant change
  useEffect(() => {
    if (currentProjectId) {
      const currentProject = projects.find(p => p.id === currentProjectId);
      if (currentProject) {
        setClientId(currentProject.client_id || '');
        setNomProjet(currentProject.name || '');
        setDescriptionProjet(currentProject.description || '');
        setAdresseChantier(currentProject.address || '');
        setOccupant(currentProject.occupant || '');
        if (currentProject.devis_number) {
          setDevisNumber(currentProject.devis_number);
        }
      }
    }
  }, [currentProjectId, projects]);
  
  // Mettre à jour le nom du projet quand certains champs changent
  useEffect(() => {
    if (clientSelectionne && descriptionProjet) {
      const clientName = `${clientSelectionne.nom} ${clientSelectionne.prenom || ''}`.trim();
      let newName = '';
      
      if (devisNumber) {
        newName = `Devis n° ${devisNumber} - ${clientName}`;
      } else {
        newName = clientName;
      }
      
      if (descriptionProjet) {
        newName += descriptionProjet.length > 40 
          ? ` - ${descriptionProjet.substring(0, 40)}...` 
          : ` - ${descriptionProjet}`;
      }
      
      setNomProjet(newName);
      console.log("Nom de projet généré:", newName);
    }
  }, [devisNumber, clientSelectionne, descriptionProjet]);
  
  const handleChargerProjet = async (projetId: string) => {
    try {
      await loadProject(projetId);
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Une erreur est survenue lors du chargement du projet');
    }
  };
  
  const handleDeleteProject = async () => {
    try {
      await deleteCurrentProject();
      setClientId('');
      setNomProjet('');
      setDescriptionProjet('');
      setAdresseChantier('');
      setOccupant('');
      setInfoComplementaire('');
      setDevisNumber('');
      setIsFirstRoom(true);
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      toast.error('Une erreur est survenue lors de la suppression du projet');
    }
  };
  
  const handleSaveProject = async () => {
    if (!clientId) {
      toast.error('Veuillez sélectionner un client');
      return;
    }
    
    try {
      await saveProject();
      toast.success('Projet enregistré avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du projet:', error);
      toast.error('Erreur lors de l\'enregistrement du projet');
    }
  };

  return {
    projectState,
    isLoading,
    projects,
    currentProjectId,
    hasUnsavedChanges,
    clientId,
    setClientId,
    nomProjet,
    setNomProjet,
    descriptionProjet,
    setDescriptionProjet,
    adresseChantier,
    setAdresseChantier,
    occupant,
    setOccupant,
    infoComplementaire,
    setInfoComplementaire,
    dateDevis,
    setDateDevis,
    devisNumber,
    setDevisNumber,
    handleChargerProjet,
    handleDeleteProject,
    handleSaveProject
  };
};
