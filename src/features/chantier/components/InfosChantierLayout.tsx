
import React from 'react';
import { Layout } from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { ProjectForm } from './ProjectForm';
import { ProjectList } from './ProjectList';
import { ProjectSummary } from './ProjectSummary';

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
  onGenerateProjectName: () => void;
  onSaveProject: () => void;
  onDeleteProject: () => void;
  onSelectProject: (projectId: string) => void;
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
  onSaveProject,
  onDeleteProject,
  onSelectProject
}) => {
  return (
    <Layout
      title="Infos Chantier / Client"
      subtitle="Gérez les informations du projet et du client"
      currentProjectName={nomProjet}
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
            onSaveProject={onSaveProject}
            onDeleteProject={onDeleteProject}
            isLoading={isLoading}
            onGenerateProjectName={onGenerateProjectName}
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
              onSelectProject={onSelectProject}
            />
          </div>
          
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Résumé du projet</h2>
            
            <ProjectSummary 
              projectState={projectState}
              hasUnsavedChanges={hasUnsavedChanges}
              currentProjectName={nomProjet}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};
