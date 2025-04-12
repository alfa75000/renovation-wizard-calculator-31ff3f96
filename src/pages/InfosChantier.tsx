
import React, { useEffect } from 'react';
import { useProjectInfo } from '@/features/chantier/hooks/useProjectInfo';
import { InfosChantierLayout } from '@/features/chantier/components/InfosChantierLayout';

const InfosChantier: React.FC = () => {
  const {
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
    generateProjectName,
    generateProjectNameIfNeeded,
    shouldGenerateProjectName,
    handleChargerProjet,
    handleDeleteProject,
    handleSaveProject,
    resetMetadataFields
  } = useProjectInfo();
  
  // Effect to ensure all fields are reset when currentProjectId is null (new project)
  useEffect(() => {
    if (currentProjectId === null && !projectState.metadata.clientId) {
      console.log("Réinitialisation des champs de métadonnées (InfosChantier)");
      resetMetadataFields();
    }
  }, [currentProjectId, projectState.metadata.clientId, resetMetadataFields]);
  
  return (
    <InfosChantierLayout
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
      projects={projects}
      currentProjectId={currentProjectId}
      projectState={projectState}
      isLoading={isLoading}
      hasUnsavedChanges={hasUnsavedChanges}
      onGenerateProjectName={generateProjectName}
      generateProjectNameIfNeeded={generateProjectNameIfNeeded}
      shouldGenerateProjectName={shouldGenerateProjectName}
      onSaveProject={handleSaveProject}
      onDeleteProject={handleDeleteProject}
      onSelectProject={handleChargerProjet}
    />
  );
};

export default InfosChantier;
