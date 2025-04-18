
import React from 'react';
import { useProjectInfo } from '@/features/chantier/hooks/useProjectInfo';
import { InfosChantierLayout } from '@/features/chantier/components/InfosChantierLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client for this page
const queryClient = new QueryClient();

const InfosChantier: React.FC = () => {
  // Add company ID state with default value
  const [companyId, setCompanyId] = React.useState<string>("c949dd6d-52e8-41c4-99f8-6e84bf4695b9");
  
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
    clientsData,
    setClientsData,
    generateProjectName,
    generateProjectNameIfNeeded,
    shouldGenerateProjectName,
    handleChargerProjet,
    handleDeleteProject,
    handleSaveProject
  } = useProjectInfo();
  
  // Check if we have all necessary data before rendering the component
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <InfosChantierLayout
        clientId={clientId}
        setClientId={setClientId}
        companyId={companyId}
        setCompanyId={setCompanyId}
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
        clientsData={clientsData}
        setClientsData={setClientsData}
        projects={projects || []}
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
    </QueryClientProvider>
  );
};

export default InfosChantier;
