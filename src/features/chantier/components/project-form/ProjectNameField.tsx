
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Wand } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectNameFieldProps {
  nomProjet: string;
  setNomProjet: (nom: string) => void;  // Add this prop
  onGenerateProjectName: () => void;
}

export const ProjectNameField: React.FC<ProjectNameFieldProps> = ({
  nomProjet,
  setNomProjet,  // Use this prop
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
  
  return (
    <div>
      <Label htmlFor="nomProjet">Nom du projet (généré automatiquement)</Label>
      <div className="flex gap-2">
        <Input 
          id="nomProjet" 
          value={nomProjet} 
          onChange={(e) => setNomProjet(e.target.value)}
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
