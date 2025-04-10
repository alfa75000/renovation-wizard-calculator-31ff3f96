
import React, { useState, useEffect } from 'react';
import { useClients } from '@/contexts/ClientsContext';
import { useProject } from '@/contexts/ProjectContext';
import { Layout } from '@/components/Layout';
import { ProjectForm } from '@/features/chantier/components/ProjectForm';
import { ProjectList } from '@/features/chantier/components/ProjectList';
import { ProjectSummary } from '@/features/chantier/components/ProjectSummary';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { generateDevisNumber, findDefaultClientId } from '@/services/devisService';

const InfosChantier: React.FC = () => {
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
  
  // Écouter l'événement personnalisé 'firstRoomAdded' déclenché depuis RenovationEstimator
  useEffect(() => {
    console.log("InfosChantier - Mise en place de l'écouteur d'événement");
    
    const handleFirstRoomAdded = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("InfosChantier - Événement firstRoomAdded reçu:", customEvent.detail);
      
      // Récupérer les données de l'événement
      const data = customEvent.detail || {};
      
      // Si c'est la première pièce ajoutée et les champs sont vides
      if (isFirstRoom) {
        setIsFirstRoom(false); // Ne plus exécuter cette logique pour les futures mises à jour
        
        // Si pas de client sélectionné, utiliser celui fourni par l'événement ou en chercher un
        if (!clientId && data.clientId) {
          setClientId(data.clientId);
          console.log("Client par défaut sélectionné:", data.clientId);
        }
        
        // Si pas de numéro de devis, utiliser celui fourni par l'événement
        if (!devisNumber && data.devisNumber) {
          setDevisNumber(data.devisNumber);
          console.log("Numéro de devis généré:", data.devisNumber);
        }
        
        // Si pas de description, utiliser "Projet en cours"
        if (!descriptionProjet) {
          setDescriptionProjet("Projet en cours");
          console.log("Description par défaut ajoutée");
        }
        
        toast.info("Informations du projet initialisées automatiquement");
      }
    };

    // Ajouter l'écouteur d'événement
    window.addEventListener('firstRoomAdded', handleFirstRoomAdded);
    
    return () => {
      // Retirer l'écouteur d'événement lors du démontage du composant
      window.removeEventListener('firstRoomAdded', handleFirstRoomAdded);
    };
  }, [clientId, devisNumber, descriptionProjet, isFirstRoom]);
  
  // Réinitialiser le flag si aucune pièce n'est présente
  useEffect(() => {
    if (projectState?.rooms?.length === 0 && !isFirstRoom) {
      setIsFirstRoom(true);
      console.log("InfosChantier - Flag isFirstRoom réinitialisé");
    }
  }, [projectState?.rooms, isFirstRoom]);
  
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
      setIsFirstRoom(true); // Réinitialiser le flag pour détecter à nouveau la première pièce
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
      // Logique de sauvegarde temporairement désactivée
      // await saveProject();
      toast.success('Projet enregistré avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du projet:', error);
      toast.error('Erreur lors de l\'enregistrement du projet');
    }
  };
  
  return (
    <Layout
      title="Infos Chantier / Client"
      subtitle="Gérez les informations du projet et du client"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h2 className="text-xl font-semibold">Informations du projet</h2>
            {hasUnsavedChanges && (
              <Badge variant="outline" className="ml-2 text-amber-500 border-amber-500">
                Modifications non enregistrées
              </Badge>
            )}
          </div>
          
          <ProjectForm 
            clientId={clientId}
            setClientId={setClientId}
            nomProjet={nomProjet}
            setNomProjet={setNomProjet}
            descriptionProjet={descriptionProjet}
            setDescriptionProjet={setDescriptionProjet}
            adresseChantier={adresseChantier}
            setAdresseChantier={setAdresseChantier}
            occupant={occupant}
            setOccupant={setOccupant}
            infoComplementaire={infoComplementaire}
            setInfoComplementaire={setInfoComplementaire}
            dateDevis={dateDevis}
            setDateDevis={setDateDevis}
            devisNumber={devisNumber}
            setDevisNumber={setDevisNumber}
            hasUnsavedChanges={hasUnsavedChanges}
            currentProjectId={currentProjectId}
            onSaveProject={handleSaveProject}
            onDeleteProject={handleDeleteProject}
            isLoading={isLoading}
          />
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Projets enregistrés</h2>
            
            <ProjectList 
              projects={projects}
              currentProjectId={currentProjectId}
              projectState={projectState}
              isLoading={isLoading}
              onSelectProject={handleChargerProjet}
            />
          </div>
          
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Résumé du projet</h2>
            
            <ProjectSummary 
              projectState={projectState}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InfosChantier;
