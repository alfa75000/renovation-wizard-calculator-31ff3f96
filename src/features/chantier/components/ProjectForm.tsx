
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash, RefreshCw, Wand } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '@/contexts/ClientsContext';
import { ClientDetails } from './ClientDetails';
import { toast } from 'sonner';
import { generateDevisNumber } from '@/services/devisService';

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
  const navigate = useNavigate();
  const { state: clientsState } = useClients();
  const [isGeneratingDevisNumber, setIsGeneratingDevisNumber] = useState<boolean>(false);
  const [isGeneratingProjectName, setIsGeneratingProjectName] = useState<boolean>(false);
  
  // Effect to update project name when client, devis number or description changes
  useEffect(() => {
    if (clientId || devisNumber || descriptionProjet) {
      console.log("Critical field changed, updating project name...");
      onGenerateProjectName();
    }
  }, [clientId, devisNumber, descriptionProjet, onGenerateProjectName]);
  
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
  
  const handleGenerateProjectName = async () => {
    try {
      setIsGeneratingProjectName(true);
      onGenerateProjectName();
      toast.success('Nom du projet généré avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du nom du projet:', error);
      toast.error('Erreur lors de la génération du nom du projet');
    } finally {
      setIsGeneratingProjectName(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="client">Client</Label>
        <Select 
          value={clientId} 
          onValueChange={(value) => setClientId(value)}
        >
          <SelectTrigger id="client" className="w-full">
            <SelectValue placeholder="Sélectionner un client" />
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
      
      {clientId && <ClientDetails clientId={clientId} />}
      
      <div>
        <Label htmlFor="devisNumber">Numéro du devis</Label>
        <div className="flex gap-2">
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
            title="Générer un numéro de devis"
          >
            <RefreshCw className={`h-4 w-4 ${isGeneratingDevisNumber ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="nomProjet">Nom du projet (généré automatiquement)</Label>
        <div className="flex gap-2">
          <Input 
            id="nomProjet" 
            value={nomProjet} 
            readOnly
            className="bg-gray-50 flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={handleGenerateProjectName}
            disabled={isGeneratingProjectName}
            title="Générer automatiquement le nom du projet"
          >
            <Wand className={`h-4 w-4 ${isGeneratingProjectName ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="descriptionProjet">Description du projet (100 caractères max)</Label>
        <Textarea 
          id="descriptionProjet" 
          value={descriptionProjet} 
          onChange={(e) => {
            if (e.target.value.length <= 100) {
              setDescriptionProjet(e.target.value);
            }
          }}
          placeholder="Description détaillée des travaux"
          rows={2}
          maxLength={100}
        />
        <div className="text-xs text-gray-500 text-right mt-1">
          {descriptionProjet.length}/100 caractères
        </div>
      </div>
      
      <div>
        <Label htmlFor="dateDevis">Date du devis</Label>
        <div className="relative">
          <Input 
            id="dateDevis" 
            type="date" 
            value={dateDevis} 
            onChange={(e) => setDateDevis(e.target.value)}
          />
          <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="adresseChantier">Adresse du chantier</Label>
        <Input 
          id="adresseChantier" 
          value={adresseChantier} 
          onChange={(e) => setAdresseChantier(e.target.value)}
          placeholder="Ex: 15 rue de la Paix, 75001 Paris" 
        />
      </div>
      
      <div>
        <Label htmlFor="occupant">Occupant</Label>
        <Input 
          id="occupant" 
          value={occupant} 
          onChange={(e) => setOccupant(e.target.value)}
          placeholder="Nom de l'occupant si différent du client"
        />
      </div>
      
      <div>
        <Label htmlFor="infoComplementaire">Informations complémentaires</Label>
        <Textarea 
          id="infoComplementaire" 
          value={infoComplementaire} 
          onChange={(e) => setInfoComplementaire(e.target.value)}
          placeholder="Autres informations importantes"
          rows={3}
        />
      </div>
      
      <div className="pt-4 flex flex-wrap gap-4">
        {currentProjectId && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Trash className="h-4 w-4" />
                Supprimer projet
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce projet ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Toutes les données du projet seront définitivement supprimées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={onDeleteProject}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        
        <Button 
          variant="default" 
          onClick={onSaveProject}
          className="ml-auto"
          disabled={isLoading}
        >
          Enregistrer
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/travaux')}
        >
          Aller aux travaux
        </Button>
      </div>
    </div>
  );
};
