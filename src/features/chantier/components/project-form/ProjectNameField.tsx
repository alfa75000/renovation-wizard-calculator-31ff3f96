
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Wand } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectNameFieldProps {
  nomProjet: string;
  setNomProjet: (nom: string) => void;
  onGenerateProjectName: () => Promise<string | void>;
}

export const ProjectNameField: React.FC<ProjectNameFieldProps> = ({
  nomProjet,
  setNomProjet,
  onGenerateProjectName
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [localNomProjet, setLocalNomProjet] = useState<string>(nomProjet);
  
  // Synchroniser l'état local avec les props à chaque changement
  useEffect(() => {
    setLocalNomProjet(nomProjet);
  }, [nomProjet]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalNomProjet(newValue);
    // Propager immédiatement la valeur au parent
    setNomProjet(newValue);
  };
  
  const handleGenerateProjectName = async () => {
    try {
      setIsGenerating(true);
      const generatedName = await onGenerateProjectName();
      
      if (typeof generatedName === 'string') {
        setLocalNomProjet(generatedName);
        setNomProjet(generatedName); // S'assurer que la valeur est propagée
      } else if (nomProjet) {
        // Si le nom existe déjà, synchroniser avec l'état local
        setLocalNomProjet(nomProjet);
      }
      
      toast.success('Nom du projet généré avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du nom du projet:', error);
      toast.error('Erreur lors de la génération du nom du projet');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div>
      <Label htmlFor="nomProjet">Nom du projet (généré automatiquement)</Label>
      <div className="flex gap-2">
        <Input 
          id="nomProjet" 
          value={localNomProjet} 
          onChange={handleInputChange}
          readOnly={false}
          className="bg-white flex-1"
          placeholder="Se génère automatiquement à l'ajout de la première pièce"
        />
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={handleGenerateProjectName}
          disabled={isGenerating}
          title="Générer automatiquement le nom du projet"
        >
          <Wand className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};
