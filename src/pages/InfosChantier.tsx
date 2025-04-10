
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
import { getDefaultClient } from '@/services/clientService';
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
  
  // Chargement du client par défaut et du numéro de devis dès le démarrage
  useEffect(() => {
    const initialSetup = async () => {
      try {
        // 1. Charger le client par défaut si aucun client n'est sélectionné
        if (!clientId) {
          const defaultClient = await getDefaultClient();
          if (defaultClient && defaultClient.id) {
            setClientId(defaultClient.id);
            console.log('Client par défaut chargé automatiquement:', defaultClient.nom);
          }
        }
        
        // 2. Générer automatiquement un numéro de devis si nécessaire
        if (!devisNumber) {
          const newDevisNumber = await generateDevisNumber();
          setDevisNumber(newDevisNumber);
          console.log('Numéro de devis généré automatiquement:', newDevisNumber);
        }
        
        // 3. Définir la description par défaut si non définie
        if (!descriptionProjet) {
          setDescriptionProjet('Projet en cours');
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des données du projet:', error);
      }
    };
    
    initialSetup();
  }, []);
  
  // Synchronisation des données lorsqu'un projet est chargé
  useEffect(() => {
    if (currentProjectId) {
      const currentProject = projects.find(p => p.id === currentProjectId);
      if (currentProject) {
        setClientId(currentProject.client_id || '');
        setNomProjet(currentProject.name || '');
        setDescriptionProjet(currentProject.description || '');
        setAdresseChantier(currentProject.address || '');
        setOccupant(currentProject.occupant || '');
        setDevisNumber(currentProject.devis_number || '');
        console.log('Projet chargé dans InfosChantier:', currentProject);
      }
    }
  }, [currentProjectId, projects]);
  
  // Fonction pour charger un projet
  const handleChargerProjet = async (projetId: string) => {
    try {
      await loadProject(projetId);
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Une erreur est survenue lors du chargement du projet');
    }
  };
  
  // Fonction pour supprimer le projet actuel
  const handleDeleteProject = async () => {
    try {
      await deleteCurrentProject();
      // Réinitialiser les états locaux
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
  
  // Fonction pour sauvegarder le projet
  const handleSaveProject = async () => {
    try {
      // Vérifier que les données obligatoires sont présentes
      if (!clientId) {
        try {
          const defaultClient = await getDefaultClient();
          setClientId(defaultClient.id);
          toast.info('Client par défaut utilisé pour le projet');
        } catch (error) {
          console.error('Erreur lors de la récupération du client par défaut:', error);
          toast.error('Erreur lors de la récupération du client par défaut');
          return;
        }
      }
      
      // Si pas de numéro de devis, en générer un
      if (!devisNumber) {
        try {
          const newDevisNumber = await generateDevisNumber();
          setDevisNumber(newDevisNumber);
          toast.info('Numéro de devis généré automatiquement');
        } catch (error) {
          console.error('Erreur lors de la génération du numéro de devis:', error);
        }
      }
      
      // Si pas de description, utiliser la valeur par défaut
      if (!descriptionProjet) {
        setDescriptionProjet('Projet en cours');
      }
      
      // Sauvegarder le projet avec toutes les informations
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
