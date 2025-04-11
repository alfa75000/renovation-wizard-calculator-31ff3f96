import React, { useEffect, useRef } from 'react';
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
  onGenerateProjectName: () => Promise<void>;
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
  // Référence pour suivre si le composant est monté
  const isMounted = useRef(true);
  
  // Référence pour suivre si les valeurs initiales ont déjà déclenché la génération du nom
  const initialValuesProcessed = useRef(false);
  
  // Référence pour stocker les valeurs précédentes
  const prevValues = useRef({
    clientId,
    devisNumber,
    descriptionProjet
  });
  
  // Effect pour générer le nom du projet seulement lors de changements significatifs
  useEffect(() => {
    // Éviter de lancer la génération si c'est juste le premier rendu
    if (!initialValuesProcessed.current) {
      initialValuesProcessed.current = true;
      
      // Générer un nom seulement si ces champs ont des valeurs mais que le nom est vide
      if ((clientId || devisNumber || descriptionProjet) && !nomProjet) {
        console.log("Premier chargement, génération du nom si nécessaire");
        onGenerateProjectName().catch(err => {
          console.error("Erreur lors de la génération initiale du nom du projet:", err);
        });
      }
      return;
    }
    
    // Vérifier si les valeurs ont réellement changé
    const hasClientChanged = clientId !== prevValues.current.clientId;
    const hasDevisNumberChanged = devisNumber !== prevValues.current.devisNumber;
    const hasDescriptionChanged = descriptionProjet !== prevValues.current.descriptionProjet;
    
    // Mettre à jour les valeurs précédentes
    prevValues.current = {
      clientId,
      devisNumber,
      descriptionProjet
    };
    
    // Générer le nom seulement si l'un des champs clés a changé
    if ((hasClientChanged || hasDevisNumberChanged || hasDescriptionChanged) && isMounted.current) {
      console.log("Champ critique modifié, mise à jour du nom du projet");
      onGenerateProjectName().catch(err => {
        console.error("Erreur lors de la génération du nom du projet:", err);
      });
    }
  }, [clientId, devisNumber, descriptionProjet, nomProjet, onGenerateProjectName]);
  
  // Nettoyage lors du d��montage du composant
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
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
        onDeleteProject={onDeleteProject}
      />
    </div>
  );
};
