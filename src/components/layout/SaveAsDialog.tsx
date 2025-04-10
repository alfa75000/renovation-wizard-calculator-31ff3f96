
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
import { getDefaultClient } from '@/services/clientService';
import { toast } from 'sonner';

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
  const { state: clientsState, dispatch: clientsDispatch } = useClients();
  const { currentProjectId, projects } = useProject();
  
  const [clientId, setClientId] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [projectDate, setProjectDate] = useState<string>('');
  const [devisNumber, setDevisNumber] = useState<string>('');
  const [isGeneratingDevisNumber, setIsGeneratingDevisNumber] = useState<boolean>(false);
  
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setProjectDate(formattedDate);
  }, []);
  
  useEffect(() => {
    if (currentProjectId) {
      const currentProject = projects.find(p => p.id === currentProjectId);
      if (currentProject) {
        setClientId(currentProject.client_id || '');
        setProjectName(currentProject.name || '');
        setProjectDescription(currentProject.description || '');
        if (currentProject.devis_number) {
          setDevisNumber(currentProject.devis_number);
        }
      }
    }
  }, [currentProjectId, projects, open]);
  
  // Auto-generate project name when client, devis number, or description changes
  useEffect(() => {
    generateProjectName();
  }, [clientId, devisNumber, projectDescription, clientsState.clients]);
  
  // Function to generate project name based on available data
  const generateProjectName = () => {
    let newName = '';
    
    // Get client info if client is selected
    const client = clientsState.clients.find(c => c.id === clientId);
    const clientName = client ? `${client.nom} ${client.prenom || ''}`.trim() : 'Client à définir';
    
    // Add devis number if available
    if (devisNumber) {
      newName = `Devis n° ${devisNumber} - ${clientName}`;
    } else {
      newName = clientName;
    }
    
    // Add description if available, or use default
    const desc = projectDescription || 'Projet en cours';
    newName += desc.length > 40 
      ? ` - ${desc.substring(0, 40)}...` 
      : ` - ${desc}`;
    
    setProjectName(newName);
  };
  
  const handleGenerateDevisNumber = async () => {
    try {
      setIsGeneratingDevisNumber(true);
      const newDevisNumber = await generateDevisNumber();
      setDevisNumber(newDevisNumber);
      toast.success('Numéro de devis généré avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du numéro de devis:', error);
      toast.error('Erreur lors de la génération du numéro de devis');
    } finally {
      setIsGeneratingDevisNumber(false);
    }
  };
  
  const handleSaveProject = async () => {
    // If no client is selected, get or create a default client
    if (!clientId) {
      try {
        const defaultClient = await getDefaultClient();
        setClientId(defaultClient.id);
        
        // Ensure client exists in local state
        if (!clientsState.clients.some(c => c.id === defaultClient.id)) {
          clientsDispatch({ 
            type: 'ADD_CLIENT', 
            payload: defaultClient 
          });
        }
        
        toast.info('Client par défaut utilisé pour le projet');
      } catch (error) {
        console.error('Erreur lors de la récupération du client par défaut:', error);
        toast.error('Erreur lors de la récupération du client par défaut');
        return;
      }
    }
    
    // If no devis number, generate one
    if (!devisNumber) {
      try {
        const newDevisNumber = await generateDevisNumber();
        setDevisNumber(newDevisNumber);
      } catch (error) {
        console.error('Erreur lors de la génération automatique du numéro de devis:', error);
      }
    }
    
    // Use default description if none provided
    if (!projectDescription) {
      setProjectDescription('Projet en cours');
    }
    
    // Call the original save function
    onSaveProject();
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
          <Button onClick={handleSaveProject}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
