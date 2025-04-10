
import React, { useEffect } from 'react';
import { ClientSelection } from './project-form/ClientSelection';
import { DevisInfoForm } from './project-form/DevisInfoForm';
import { ProjectNameField } from './project-form/ProjectNameField';
import { ProjectDescriptionField } from './project-form/ProjectDescriptionField';
import { ProjectAddressFields } from './project-form/ProjectAddressFields';
import { ProjectActionButtons } from './project-form/ProjectActionButtons';

interface ProjectFormProps {
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
  onGenerateProjectName: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
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
  isLoading,
  onGenerateProjectName
}) => {
  // Effect to update project name when client, devis number or description changes
  useEffect(() => {
    if (clientId || devisNumber || descriptionProjet) {
      console.log("Critical field changed, updating project name...");
      onGenerateProjectName();
    }
  }, [clientId, devisNumber, descriptionProjet, onGenerateProjectName]);
  
  return (
    <div className="space-y-6">
      <ClientSelection
        clientId={clientId}
        setClientId={setClientId}
      />
      
      <DevisInfoForm
        devisNumber={devisNumber}
        setDevisNumber={setDevisNumber}
        dateDevis={dateDevis}
        setDateDevis={setDateDevis}
      />
      
      <ProjectNameField
        nomProjet={nomProjet}
        onGenerateProjectName={onGenerateProjectName}
      />
      
      <ProjectDescriptionField
        descriptionProjet={descriptionProjet}
        setDescriptionProjet={setDescriptionProjet}
      />
      
      <ProjectAddressFields
        adresseChantier={adresseChantier}
        setAdresseChantier={setAdresseChantier}
        occupant={occupant}
        setOccupant={setOccupant}
        infoComplementaire={infoComplementaire}
        setInfoComplementaire={setInfoComplementaire}
      />
      
      <ProjectActionButtons
        currentProjectId={currentProjectId}
        isLoading={isLoading}
        onSaveProject={onSaveProject}
        onDeleteProject={onDeleteProject}
      />
    </div>
  );
};
