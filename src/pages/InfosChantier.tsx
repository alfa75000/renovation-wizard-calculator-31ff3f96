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
import { generateDevisNumber } from '@/services/devisService';

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
  
  const { state: clientsState } = useClients();
  
  // Trouver l'ID du client "Client à définir"
  const getDefaultClientId = (): string => {
    console.log("Recherche du client par défaut...");
    const defaultClient = clientsState.clients.find(c => c.nom === "Client à définir");
    console.log("Client par défaut trouvé:", defaultClient);
    return defaultClient ? defaultClient.id : '';
  };
  
  useEffect(() => {
    if (currentProjectId) {
      const currentProject = projects.find(p => p.id === currentProjectId);
      if (currentProject) {
        console.log("Chargement du projet courant:", currentProject);
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
  
  // Cette fonction génère le nom du projet en se basant sur le client, le numéro de devis et la description
  const generateProjectName = async () => {
    console.log("Génération du nom de projet en cours...");
    
    // Si pas de clientId sélectionné, définir le client par défaut
    let updatedClientId = clientId;
    if (!clientId) {
      const defaultClientId = getDefaultClientId();
      if (defaultClientId) {
        setClientId(defaultClientId);
        updatedClientId = defaultClientId;
        console.log("Client par défaut sélectionné:", defaultClientId);
      } else {
        console.error("Impossible de trouver le client par défaut");
        return;
      }
    }
    
    // Si pas de numéro de devis, en générer un
    let updatedDevisNumber = devisNumber;
    if (!devisNumber) {
      try {
        updatedDevisNumber = await generateDevisNumber();
        setDevisNumber(updatedDevisNumber);
        console.log("Numéro de devis généré:", updatedDevisNumber);
      } catch (error) {
        console.error("Erreur lors de la génération du numéro de devis:", error);
        return;
      }
    }
    
    // Si pas de description, utiliser "Projet en cours"
    let updatedDescription = descriptionProjet;
    if (!descriptionProjet) {
      updatedDescription = "Projet en cours";
      setDescriptionProjet(updatedDescription);
      console.log("Description par défaut utilisée:", updatedDescription);
    }
    
    // Récupérer le client sélectionné
    const selectedClient = clientsState.clients.find(c => c.id === updatedClientId);
    if (!selectedClient) {
      console.error("Client non trouvé");
      return;
    }
    
    // Générer le nom du projet
    const clientName = `${selectedClient.nom} ${selectedClient.prenom || ''}`.trim();
    let newName = '';
    
    if (updatedDevisNumber) {
      newName = `Devis n° ${updatedDevisNumber} - ${clientName}`;
    } else {
      newName = clientName;
    }
    
    if (updatedDescription) {
      newName += updatedDescription.length > 40 
        ? ` - ${updatedDescription.substring(0, 40)}...` 
        : ` - ${updatedDescription}`;
    }
    
    console.log("Nouveau nom de projet généré:", newName);
    setNomProjet(newName);
  };
  
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
      // Si le nom du projet est vide, le générer automatiquement
      if (!nomProjet) {
        await generateProjectName();
      }
      
      await saveProject();
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
            onGenerateProjectName={generateProjectName}
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
