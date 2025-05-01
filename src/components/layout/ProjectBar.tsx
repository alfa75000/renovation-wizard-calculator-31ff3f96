import React from 'react';
import { Button } from '../ui/button';
import { FilePlus2, FolderOpen, Save, SaveAll, Check, AlertCircle } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useAppState, AutoSaveOptions } from '@/hooks/useAppState';
import { UserSelector } from '@/components/user/UserSelector';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

interface ProjectBarProps {
  onNewProject: () => void;
  onOpenProject: () => void;
  onSaveProject: () => void;
  onSaveAsProject: () => void;  // ✅ Nouveau prop
  projectDisplayName?: string;
  hasUnsavedChanges?: boolean;
}

const defaultAutoSaveOptions: AutoSaveOptions = {
  enabled: false,
  saveOnRoomAdd: false,
  saveOnWorkAdd: true
};

export const ProjectBar: React.FC<ProjectBarProps> = ({
  onNewProject,
  onOpenProject,
  onSaveProject,
  onSaveAsProject,  // ✅ Reçu en props
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

  const autoSaveOptions = appState?.auto_save_options || defaultAutoSaveOptions;

  const displayName = projectDisplayName || (() => {
    const currentProject = projects.find(p => p.id === currentProjectId);
    return currentProject?.name || "Projet sans titre";
  })();

  const handleAutoSaveOptionChange = async (option: keyof AutoSaveOptions, value: boolean) => {
    const newOptions = { ...autoSaveOptions }; 
    if (option === 'enabled') {
      newOptions.enabled = value;
      if (!value) {
        newOptions.saveOnRoomAdd = false;
        newOptions.saveOnWorkAdd = false;
      }
    } else {
      newOptions[option] = value;
    }
    const success = await updateAutoSaveOptions(newOptions);
    if (!success) {
      toast.error("Erreur lors de la mise à jour des options d'auto-sauvegarde");
    }
  };

  const handleUserChange = (userId: string) => {
    if (hasUnsavedChanges) {
      if (window.confirm("Vous avez des modifications non sauvegardées. Voulez-vous vraiment changer d'utilisateur ?")) {
        switchUser(userId);
      }
    } else {
      switchUser(userId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-2 mb-2 flex flex-col border-b">
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