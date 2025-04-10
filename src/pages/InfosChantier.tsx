
import React from 'react';
import { Layout } from '@/components/Layout';
import { ProjectInfoSection } from '@/features/chantier/components/ProjectInfoSection';
import { ProjectSidebar } from '@/features/chantier/components/ProjectSidebar';
import { useChantierForm } from '@/features/chantier/hooks/useChantierForm';

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
    handleChargerProjet,
    handleDeleteProject,
    handleSaveProject
  } = useChantierForm();
  
  return (
    <Layout
      title="Infos Chantier / Client"
      subtitle="Gérez les informations du projet et du client"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ProjectInfoSection
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
        
        <ProjectSidebar
          projects={projects}
          currentProjectId={currentProjectId}
          projectState={projectState}
          isLoading={isLoading}
          hasUnsavedChanges={hasUnsavedChanges}
          onSelectProject={handleChargerProjet}
        />
      </div>
    </Layout>
  );
};

export default InfosChantier;
