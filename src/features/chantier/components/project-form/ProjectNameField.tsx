
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Wand, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectNameFieldProps {
  nomProjet: string;
  setNomProjet: (nom: string) => void;
  onGenerateProjectName: () => Promise<void>;
}

export const ProjectNameField: React.FC<ProjectNameFieldProps> = ({
  nomProjet,
  setNomProjet,
  onGenerateProjectName
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const handleGenerateProjectName = async () => {
    try {
      setIsGenerating(true);
      await onGenerateProjectName();
      toast.success('Nom du projet généré avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du nom du projet:', error);
      toast.error('Erreur lors de la génération du nom du projet');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomProjet(e.target.value);
  };
  
  return (
    <div>
      <Label htmlFor="nomProjet">Nom du projet</Label>
      <div className="flex gap-2">
        <Input 
          id="nomProjet" 
          value={nomProjet}
          onChange={handleNameChange}
          className="flex-1"
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
          {isGenerating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Wand className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
