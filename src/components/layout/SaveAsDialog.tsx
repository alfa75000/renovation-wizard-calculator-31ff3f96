
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
import { generateDevisNumber } from '@/services/devisService';
import { toast } from 'sonner';

interface SaveAsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveProject: () => void;
  // Ajouter les nouvelles props pour la synchronisation
  clientId: string;
  projectDescription: string;
  devisNumber: string;
  setClientId: (id: string) => void;
  setProjectDescription: (desc: string) => void;
  setDevisNumber: (num: string) => void;
}

export const SaveAsDialog: React.FC<SaveAsDialogProps> = ({
  open,
  onOpenChange,
  onSaveProject,
  clientId,
  projectDescription,
  devisNumber,
  setClientId,
  setProjectDescription,
  setDevisNumber
}) => {
  const { state: clientsState } = useClients();
  const { currentProjectId, projects } = useProject();
  
  const [projectName, setProjectName] = useState<string>('');
  const [projectDate, setProjectDate] = useState<string>('');
  const [isGeneratingDevisNumber, setIsGeneratingDevisNumber] = useState<boolean>(false);
  
  // Initialiser la date au format actuel
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setProjectDate(formattedDate);
  }, []);
  
  // Synchroniser avec les données du projet actuel si disponible
  useEffect(() => {
    if (open && currentProjectId) {
      const currentProject = projects.find(p => p.id === currentProjectId);
      if (currentProject) {
        // Ne pas mettre à jour les valeurs déjà définies dans la page InfosChantier
        // car elles sont maintenant passées en props
      }
    }
  }, [currentProjectId, projects, open]);
  
  // Effet pour générer le nom du projet en fonction des autres champs
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
      setDevisNumber(newDevisNumber); // Mettre à jour via la prop
      
      toast.success('Numéro de devis généré avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du numéro de devis:', error);
      toast.error('Erreur lors de la génération du numéro de devis');
    } finally {
      setIsGeneratingDevisNumber(false);
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
          <Button onClick={onSaveProject}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
