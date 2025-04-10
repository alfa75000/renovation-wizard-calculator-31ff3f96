
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
  onSaveProject: () => Promise<boolean>;
  onDeleteProject: () => Promise<void>;
  isLoading: boolean;
  onGenerateProjectName: () => Promise<string | void>;
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
  // Effet pour sauvegarder automatiquement les changements de formulaire
  // après un délai d'inactivité (uniquement si un projet est déjà chargé)
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (currentProjectId && hasUnsavedChanges) {
        console.log("Sauvegarde automatique des modifications de formulaire...");
        onSaveProject().then(success => {
          if (success) {
            console.log("Modifications sauvegardées automatiquement");
          }
        });
      }
    }, 2000); // 2 secondes d'inactivité avant sauvegarde

    return () => clearTimeout(saveTimeout);
  }, [
    clientId,
    nomProjet,
    descriptionProjet,
    adresseChantier,
    occupant,
    devisNumber,
    currentProjectId,
    hasUnsavedChanges,
    onSaveProject
  ]);
  
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
        setNomProjet={setNomProjet}
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
