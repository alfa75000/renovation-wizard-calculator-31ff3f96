
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { FilePlus2, FolderOpen, Save, SaveAll, Check, AlertCircle } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useAppState, AutoSaveOptions } from '@/hooks/useAppState';
import { UserSelector } from '@/components/user/UserSelector';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

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
  const { 
    isLoading, 
    currentUser, 
    users, 
    appState, 
    switchUser, 
    updateAutoSaveOptions 
  } = useAppState();
  
  // Options d'enregistrement automatique depuis la base de données
  const [autoSaveOptions, setAutoSaveOptions] = useState<AutoSaveOptions>({
    enabled: false,
    saveOnRoomAdd: false,
    saveOnWorkAdd: true
  });
  
  // Mettre à jour les options locales lorsque l'état de l'application change
  useEffect(() => {
    if (appState?.auto_save_options) {
      setAutoSaveOptions(appState.auto_save_options);
      console.log('Options d\'auto-sauvegarde chargées depuis app_state:', appState.auto_save_options);
    }
  }, [appState]);
  
  // Si aucun projectDisplayName n'est fourni, revenir au projet du contexte
  const displayName = projectDisplayName || (() => {
    const currentProject = projects.find(p => p.id === currentProjectId);
    return currentProject?.name || "Projet sans titre";
  })();

  // Fonction pour mettre à jour les options d'enregistrement automatique
  const handleAutoSaveOptionChange = (option: keyof AutoSaveOptions, value: boolean) => {
    // Créer une copie des options actuelles pour la mise à jour
    const newOptions = {
      ...autoSaveOptions,
      [option]: value
    };
    
    console.log('Changement d\'option d\'auto-sauvegarde:', option, value, newOptions);
    
    // Mettre à jour l'état local immédiatement pour une réactivité de l'UI
    setAutoSaveOptions(newOptions);
    
    // Mettre à jour dans la base de données
    updateAutoSaveOptions(newOptions)
      .then(success => {
        if (success) {
          console.log('Options d\'auto-sauvegarde mises à jour avec succès');
        } else {
          toast.error('Erreur lors de la mise à jour des options d\'auto-sauvegarde');
          // Restaurer l'ancienne valeur en cas d'échec
          setAutoSaveOptions(autoSaveOptions);
        }
      });
  };

  // Gérer le changement d'utilisateur
  const handleUserChange = (userId: string) => {
    if (hasUnsavedChanges) {
      if (window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment changer d\'utilisateur ?')) {
        switchUser(userId);
      }
    } else {
      switchUser(userId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-2 mb-2 flex flex-col border-b">
      {/* Première ligne: sélecteur d'utilisateur et boutons d'action */}
      <div className="flex flex-wrap items-center justify-between mb-3">
        <div className="flex space-x-2 mb-2 md:mb-0 items-center">
          <UserSelector 
            users={users}
            currentUser={currentUser}
            isLoading={isLoading}
            onSelectUser={handleUserChange}
          />
          <Button variant="outline" size="sm" onClick={onNewProject}>
            <FilePlus2 className="mr-1" size={16} />
            Nouveau
          </Button>
          <Button variant="outline" size="sm" onClick={onOpenProject}>
            <FolderOpen className="mr-1" size={16} />
            Ouvrir
          </Button>
          <Button 
            variant="outline" 
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
              variant="outline" 
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
                <Switch 
                  id="autoSave" 
                  checked={autoSaveOptions.enabled}
                  disabled={!currentProjectId}
                  onCheckedChange={(checked) => 
                    handleAutoSaveOptionChange('enabled', checked)
                  }
                />
                <label 
                  htmlFor="autoSave" 
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed ${!currentProjectId ? 'text-gray-400' : ''}`}
                >
                  Enregistrement Auto
                  {!currentProjectId && (
                    <span className="block text-xs text-gray-400 mt-1">
                      (Disponible uniquement avec un projet existant)
                    </span>
                  )}
                </label>
              </div>
              
              <div className="pl-6 space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="saveOnRoomAdd" 
                    checked={autoSaveOptions.saveOnRoomAdd}
                    disabled={!autoSaveOptions.enabled || !currentProjectId}
                    onCheckedChange={(checked) => 
                      handleAutoSaveOptionChange('saveOnRoomAdd', checked)
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
                  <Switch 
                    id="saveOnWorkAdd" 
                    checked={autoSaveOptions.saveOnWorkAdd}
                    disabled={!autoSaveOptions.enabled || !currentProjectId}
                    onCheckedChange={(checked) => 
                      handleAutoSaveOptionChange('saveOnWorkAdd', checked)
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
