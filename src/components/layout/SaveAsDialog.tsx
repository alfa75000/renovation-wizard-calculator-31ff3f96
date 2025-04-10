
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { RefreshCw } from 'lucide-react';
import { useClients } from '@/contexts/ClientsContext';
import { useProject } from '@/contexts/ProjectContext';
import { generateDevisNumber } from '@/services/projectService';
import { toast } from 'sonner';
import { useProjectOperations } from '@/features/chantier/hooks/useProjectOperations';

interface SaveAsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveProject: () => void;
}

export const SaveAsDialog: React.FC<SaveAsDialogProps> = ({
  open,
  onOpenChange,
  onSaveProject
}) => {
  const { state: clientsState } = useClients();
  const { state, dispatch } = useProject();
  const { handleSaveProject } = useProjectOperations();
  
  // Initialiser les états locaux avec les valeurs du contexte global
  const [clientId, setClientId] = useState<string>(state.metadata.clientId || '');
  const [projectName, setProjectName] = useState<string>(state.metadata.nomProjet || '');
  const [projectDescription, setProjectDescription] = useState<string>(state.metadata.descriptionProjet || '');
  const [projectDate, setProjectDate] = useState<string>(state.metadata.dateDevis || '');
  const [devisNumber, setDevisNumber] = useState<string>(state.metadata.devisNumber || '');
  const [isGeneratingDevisNumber, setIsGeneratingDevisNumber] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Synchroniser les champs avec les données du projet courant dès l'ouverture du modal
  useEffect(() => {
    if (open) {
      setClientId(state.metadata.clientId || '');
      setProjectDescription(state.metadata.descriptionProjet || '');
      setProjectName(state.metadata.nomProjet || '');
      setDevisNumber(state.metadata.devisNumber || '');
      
      // Utiliser la date du projet si elle existe, sinon la date du jour
      if (state.metadata.dateDevis) {
        setProjectDate(state.metadata.dateDevis);
      } else {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setProjectDate(formattedDate);
      }
    }
  }, [open, state.metadata]);
  
  // Générer le nom du projet automatiquement quand le client ou la description change
  useEffect(() => {
    if (clientId && (devisNumber || projectDescription)) {
      const client = clientsState.clients.find(c => c.id === clientId);
      if (client) {
        const clientName = `${client.nom} ${client.prenom || ''}`.trim();
        let newName = '';
        
        if (devisNumber) {
          newName = `Devis n° ${devisNumber} - ${clientName}`;
        } else {
          newName = clientName;
        }
        
        if (projectDescription) {
          newName += projectDescription.length > 40 
            ? ` - ${projectDescription.substring(0, 40)}...` 
            : ` - ${projectDescription}`;
        }
        
        setProjectName(newName);
      }
    }
  }, [devisNumber, clientId, projectDescription, clientsState.clients]);
  
  const handleGenerateDevisNumber = async () => {
    try {
      setIsGeneratingDevisNumber(true);
      const newDevisNumber = await generateDevisNumber();
      setDevisNumber(newDevisNumber);
      
      if (clientId) {
        const client = clientsState.clients.find(c => c.id === clientId);
        if (client) {
          const clientName = `${client.nom} ${client.prenom || ''}`.trim();
          let newName = `Devis n° ${newDevisNumber} - ${clientName}`;
          
          if (projectDescription) {
            newName += projectDescription.length > 40 
              ? ` - ${projectDescription.substring(0, 40)}...` 
              : ` - ${projectDescription}`;
          }
          
          setProjectName(newName);
        }
      }
      
      toast.success('Numéro de devis généré avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du numéro de devis:', error);
      toast.error('Erreur lors de la génération du numéro de devis');
    } finally {
      setIsGeneratingDevisNumber(false);
    }
  };
  
  // Fonction pour préparer les données du projet à sauvegarder
  const handleSaveProjectData = async () => {
    try {
      setIsSaving(true);
      
      // Mettre à jour le state global avec les valeurs du formulaire
      dispatch({
        type: 'UPDATE_METADATA',
        payload: {
          clientId,
          nomProjet: projectName,
          descriptionProjet: projectDescription,
          dateDevis: projectDate,
          devisNumber
        }
      });
      
      // Préparer les données du projet pour la sauvegarde, envoyé uniquement les métadonnées
      // et ne pas essayer d'accéder à state.property qui pourrait être undefined
      const projectData = {
        client_id: clientId,
        name: projectName,
        description: projectDescription,
        general_data: {
          dateDevis: projectDate,
          infoComplementaire: state.metadata.infoComplementaire || ''
        },
        devis_number: devisNumber,
        // Ajouter d'autres champs si nécessaire
        address: state.metadata.adresseChantier || '',
        occupant: state.metadata.occupant || ''
      };
      
      console.log('Données projet à sauvegarder:', projectData);
      
      // Sauvegarder le projet dans la base de données
      const result = await handleSaveProject(projectData);
      
      if (result) {
        toast.success('Projet enregistré avec succès');
        // Appeler la fonction de callback
        onSaveProject();
        // Fermer le modal
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du projet:', error);
      toast.error('Erreur lors de l\'enregistrement du projet');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enregistrer Sous</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="devisNumber" className="text-right">
              Numéro du devis
            </Label>
            <div className="col-span-3 flex gap-2">
              <Input
                id="devisNumber"
                value={devisNumber}
                onChange={(e) => setDevisNumber(e.target.value)}
                placeholder="Ex: 2504-1"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={handleGenerateDevisNumber}
                disabled={isGeneratingDevisNumber}
              >
                <RefreshCw className={`h-4 w-4 ${isGeneratingDevisNumber ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client-save" className="text-right">
              Client
            </Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger id="client-save" className="col-span-3">
                <SelectValue placeholder="Sélectionnez un client" />
              </SelectTrigger>
              <SelectContent>
                {clientsState.clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.nom} {client.prenom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="project-description" className="text-right">
              Description
            </Label>
            <Textarea
              id="project-description"
              className="col-span-3"
              placeholder="Description du projet (100 caractères max)"
              value={projectDescription}
              onChange={(e) => {
                if (e.target.value.length <= 100) {
                  setProjectDescription(e.target.value);
                }
              }}
              maxLength={100}
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="project-name-save" className="text-right">
              Nom du projet
            </Label>
            <Input
              id="project-name-save"
              className="col-span-3 bg-gray-50"
              value={projectName}
              readOnly
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date-start-save" className="text-right">
              Date de début
            </Label>
            <Input
              id="date-start-save"
              type="date"
              className="col-span-3"
              value={projectDate}
              onChange={(e) => setProjectDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSaveProjectData} disabled={isSaving}>
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
