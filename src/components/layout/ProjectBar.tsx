
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { FilePlus2, FolderOpen, Save, SaveAll, Check, AlertCircle } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ProjectBarProps {
  onNewProject: () => void;
  onOpenProject: () => void;
  onSaveProject: () => void;
  onSaveAsProject: () => void;
  projectDisplayName?: string;
  hasUnsavedChanges?: boolean;
}

export const ProjectBar: React.FC<ProjectBarProps> = ({
  onNewProject,
  onOpenProject,
  onSaveProject,
  onSaveAsProject,
  projectDisplayName,
  hasUnsavedChanges
}) => {
  const { currentProjectId, projects } = useProject();
  
  // Options d'enregistrement automatique - enabled est maintenant true par défaut
  const [autoSaveOptions, setAutoSaveOptions] = useLocalStorage('autoSaveOptions', {
    enabled: true,
    saveOnRoomAdd: false,
    saveOnWorkAdd: true
  });
  
  // Si aucun projectDisplayName n'est fourni, revenir au projet du contexte
  const displayName = projectDisplayName || (() => {
    const currentProject = projects.find(p => p.id === currentProjectId);
    return currentProject?.name || "Projet sans titre";
  })();

  // Fonction pour mettre à jour les options d'enregistrement automatique
  const handleAutoSaveOptionChange = (option: keyof typeof autoSaveOptions, value: boolean) => {
    setAutoSaveOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-2 mb-2 flex flex-col border-b">
      {/* Première ligne: boutons d'action et indicateur de sauvegarde */}
      <div className="flex flex-wrap items-center justify-between mb-3">
        <div className="flex space-x-2 mb-2 md:mb-0">
          <Button variant="outline" size="sm" onClick={onNewProject}>
            <FilePlus2 className="mr-1" size={16} />
            Nouveau
          </Button>
          <Button variant="outline" size="sm" onClick={onOpenProject}>
            <FolderOpen className="mr-1" size={16} />
            Ouvrir
          </Button>
          <Button 
            variant={hasUnsavedChanges ? "default" : "outline"} 
            size="sm" 
            onClick={onSaveProject}
          >
            <Save className="mr-1" size={16} />
            Enregistrer
          </Button>
          <Button variant="outline" size="sm" onClick={onSaveAsProject}>
            <SaveAll className="mr-1" size={16} />
            Enregistrer Sous
          </Button>
        </div>
        
        {/* Indicateur d'état avec popover pour options d'auto-sauvegarde */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={hasUnsavedChanges ? "destructive" : "outline"} 
              size="sm" 
              className="min-w-[200px] justify-between"
            >
              {hasUnsavedChanges ? (
                <>
                  <AlertCircle size={16} />
                  <span>Modifications non sauvegardées</span>
                </>
              ) : currentProjectId ? (
                <>
                  <Check size={16} />
                  <span>Projet sauvegardé</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  <span>Pas de Projet en cours</span>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Options d'enregistrement</h4>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="autoSave" 
                  checked={autoSaveOptions.enabled}
                  onCheckedChange={(checked) => 
                    handleAutoSaveOptionChange('enabled', checked === true)
                  }
                />
                <label 
                  htmlFor="autoSave" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Enregistrement Auto
                </label>
              </div>
              
              <div className="pl-6 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="saveOnRoomAdd" 
                    checked={autoSaveOptions.saveOnRoomAdd}
                    disabled={!autoSaveOptions.enabled}
                    onCheckedChange={(checked) => 
                      handleAutoSaveOptionChange('saveOnRoomAdd', checked === true)
                    }
                  />
                  <label 
                    htmlFor="saveOnRoomAdd" 
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enregistrement à chaque ajout de pièce
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="saveOnWorkAdd" 
                    checked={autoSaveOptions.saveOnWorkAdd}
                    disabled={!autoSaveOptions.enabled}
                    onCheckedChange={(checked) => 
                      handleAutoSaveOptionChange('saveOnWorkAdd', checked === true)
                    }
                  />
                  <label 
                    htmlFor="saveOnWorkAdd" 
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enregistrement à chaque ajout de travaux
                  </label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Seconde ligne: informations du projet en cours - aligné à gauche */}
      <div className="bg-gray-100 px-3 py-2 rounded-md text-gray-800 border w-full text-left">
        <span className="text-gray-500 mr-1">Projet en cours:</span>
        <span className="font-medium">{displayName}</span>
        {hasUnsavedChanges && (
          <Badge variant="outline" className="ml-2 text-amber-500 border-amber-500">
            Non sauvegardé
          </Badge>
        )}
      </div>
    </div>
  );
};
