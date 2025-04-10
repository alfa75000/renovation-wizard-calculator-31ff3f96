
import React from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientDetails } from './ClientDetails';
import { ProjectForm } from './ProjectForm';
import { ProjectBar } from '@/components/layout/ProjectBar';
import { ProjectList } from './ProjectList';
import { ProjectSummary } from './ProjectSummary';
import { NewProjectDialog } from '@/components/layout/NewProjectDialog';
import { OpenProjectSheet } from '@/components/layout/OpenProjectSheet';
import { SaveAsDialog } from '@/components/layout/SaveAsDialog';
import { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';

interface InfosChantierLayoutProps {
  clientId: string;
  setClientId: (id: string) => void;
  nomProjet: string;
  setNomProjet: (nom: string) => void;
  descriptionProjet: string;
  setDescriptionProjet: (description: string) => void;
  adresseChantier: string;
  setAdresseChantier: (adresse: string) => void;
  occupant: string;
  setOccupant: (occupant: string) => void;
  infoComplementaire: string;
  setInfoComplementaire: (info: string) => void;
  dateDevis: string;
  setDateDevis: (date: string) => void;
  devisNumber: string;
  setDevisNumber: (number: string) => void;
  projects: any[];
  currentProjectId: string | null;
  projectState: any;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  onGenerateProjectName: () => Promise<string | void>;
  generateProjectNameIfNeeded: () => Promise<boolean>;
  shouldGenerateProjectName: () => boolean;
  onSaveProject: () => Promise<boolean>;
  onDeleteProject: () => Promise<void>;
  onSelectProject: (projectId: string) => Promise<void>;
}

export const InfosChantierLayout: React.FC<InfosChantierLayoutProps> = ({
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
  projects,
  currentProjectId,
  projectState,
  isLoading,
  hasUnsavedChanges,
  onGenerateProjectName,
  generateProjectNameIfNeeded,
  shouldGenerateProjectName,
  onSaveProject,
  onDeleteProject,
  onSelectProject
}) => {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isOpenProjectOpen, setIsOpenProjectOpen] = useState(false);
  const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);
  const { createNewProject } = useProject();
  
  const handleNewProject = () => {
    setIsNewProjectOpen(true);
  };
  
  const handleOpenProject = () => {
    setIsOpenProjectOpen(true);
  };
  
  const handleSaveAsProject = () => {
    setIsSaveAsOpen(true);
  };
  
  const handleSaveProject = async () => {
    // Vérifie si le nom du projet est vide et a besoin d'être généré
    if (shouldGenerateProjectName()) {
      await generateProjectNameIfNeeded();
    }
    
    // Ensuite sauvegarder le projet
    await onSaveProject();
  };

  // Gestion des props pour les dialogues
  const handleCreateProject = () => {
    createNewProject();
    setIsNewProjectOpen(false);
  };
  
  return (
    <Layout
      title="Informations du chantier et client"
      subtitle="Créez un nouveau projet ou modifiez un projet existant"
    >
      <ProjectBar
        onNewProject={handleNewProject}
        onOpenProject={handleOpenProject}
        onSaveProject={handleSaveProject}
        onSaveAsProject={handleSaveAsProject}
        projectDisplayName={nomProjet} // Utiliser le nom du projet actuel
      />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2">
          <Tabs defaultValue="infos" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="infos">Informations du projet</TabsTrigger>
              <TabsTrigger value="client">Détails du client</TabsTrigger>
            </TabsList>
            
            <TabsContent value="infos" className="p-4 border rounded-md">
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
                onSaveProject={onSaveProject}
                onDeleteProject={onDeleteProject}
                isLoading={isLoading}
                onGenerateProjectName={onGenerateProjectName}
              />
            </TabsContent>
            
            <TabsContent value="client" className="p-4 border rounded-md">
              <ClientDetails clientId={clientId} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <div className="border rounded-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4">Résumé du projet</h2>
            <ProjectSummary 
              projectState={projectState} 
              hasUnsavedChanges={hasUnsavedChanges}
              currentProjectName={nomProjet} // Pass the current project name
            />
          </div>
          
          <div className="border rounded-md p-4">
            <h2 className="text-lg font-semibold mb-4">Projets existants</h2>
            <ProjectList 
              projects={projects} 
              currentProjectId={currentProjectId}
              projectState={projectState}
              isLoading={isLoading}
              onSelectProject={onSelectProject}
            />
          </div>
        </div>
      </div>
      
      <NewProjectDialog 
        open={isNewProjectOpen} 
        onOpenChange={setIsNewProjectOpen}
        onCreateProject={handleCreateProject}
      />
      
      <OpenProjectSheet 
        open={isOpenProjectOpen} 
        onOpenChange={setIsOpenProjectOpen} 
      />
      
      <SaveAsDialog 
        open={isSaveAsOpen} 
        onOpenChange={setIsSaveAsOpen}
        onSaveProject={handleSaveProject}
      />
    </Layout>
  );
};
