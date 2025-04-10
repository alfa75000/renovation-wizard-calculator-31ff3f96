
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ProjectForm } from './ProjectForm';
import { ProjectState } from '@/types';

interface ProjectInfoSectionProps {
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
  hasUnsavedChanges: boolean;
  currentProjectId: string | null;
  onSaveProject: () => void;
  onDeleteProject: () => void;
  isLoading: boolean;
}

export const ProjectInfoSection: React.FC<ProjectInfoSectionProps> = ({
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
  hasUnsavedChanges,
  currentProjectId,
  onSaveProject,
  onDeleteProject,
  isLoading
}) => {
  return (
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
      />
    </div>
  );
};
