import React, { useEffect, useRef, useState } from 'react';
import { CompanySelection } from './project-form/CompanySelection';
import { ClientSelection } from './project-form/ClientSelection';
import { DevisInfoForm } from './project-form/DevisInfoForm';
import { ProjectNameField } from './project-form/ProjectNameField';
import { ProjectDescriptionField } from './project-form/ProjectDescriptionField';
import { ProjectAddressFields } from './project-form/ProjectAddressFields';
import { ProjectActionButtons } from './project-form/ProjectActionButtons';
import { ClientsDataField } from './project-form/ClientsDataField';
import { useClients } from '@/contexts/ClientsContext';
import { toast } from 'sonner';

interface ProjectFormProps {
  clientId: string;
  setClientId: (id: string) => void;
  companyId: string;
  setCompanyId: (id: string) => void;
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
  companyId,
  setCompanyId,
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
  const isMounted = useRef(true);
  const initialValuesProcessed = useRef(false);
  const prevValues = useRef({
    clientId,
    devisNumber,
    descriptionProjet
  });

  const [clientsData, setClientsData] = useState<string>('');
  
  const { state: clientsState, getClientTypeName } = useClients();

  useEffect(() => {
    if (!initialValuesProcessed.current) {
      initialValuesProcessed.current = true;
      
      if ((clientId || devisNumber || descriptionProjet) && !nomProjet) {
        console.log("Premier chargement, génération du nom si nécessaire");
        onGenerateProjectName().catch(err => {
          console.error("Erreur lors de la génération initiale du nom du projet:", err);
        });
      }
      return;
    }
    
    const hasClientChanged = clientId !== prevValues.current.clientId;
    const hasDevisNumberChanged = devisNumber !== prevValues.current.devisNumber;
    const hasDescriptionChanged = descriptionProjet !== prevValues.current.descriptionProjet;
    
    prevValues.current = {
      clientId,
      devisNumber,
      descriptionProjet
    };
    
    if ((hasClientChanged || hasDevisNumberChanged || hasDescriptionChanged) && isMounted.current) {
      console.log("Champ critique modifié, mise à jour du nom du projet");
      onGenerateProjectName().catch(err => {
        console.error("Erreur lors de la génération du nom du projet:", err);
      });
    }
  }, [clientId, devisNumber, descriptionProjet, nomProjet, onGenerateProjectName]);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleAddClientToList = () => {
    if (!clientId) {
      toast.error("Veuillez sélectionner un client d'abord");
      return;
    }

    const selectedClient = clientsState.clients.find(client => client.id === clientId);
    
    if (selectedClient) {
      const clientTypeLabel = selectedClient.typeClient 
        ? getClientTypeName(selectedClient.typeClient)
        : "Non spécifié";
        
      const clientName = `${clientTypeLabel} ${selectedClient.nom} ${selectedClient.prenom || ''}`.trim();
      const clientAddress = `${selectedClient.adresse || ''}-${selectedClient.codePostal || ''}-${selectedClient.ville || ''}`.replace(/^-+|-+$/g, '');
      
      const newClientData = `${clientName}\n${clientAddress}\n\n`;
      setClientsData(prev => prev + newClientData);
      
      toast.success("Client ajouté à la liste");
    } else {
      toast.error("Client non trouvé");
    }
  };
  
  return (
    <div className="space-y-6">
      <CompanySelection
        companyId={companyId}
        setCompanyId={setCompanyId}
      />
      
      <ClientSelection
        clientId={clientId}
        setClientId={setClientId}
        onAddClientToList={handleAddClientToList}
      />
      
      <ClientsDataField 
        clientsData={clientsData}
        setClientsData={setClientsData}
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
