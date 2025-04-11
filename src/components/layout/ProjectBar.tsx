
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { FilePlus2, FolderOpen, Save, SaveAll } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { OpenProjectDialog } from './OpenProjectDialog';

interface ProjectBarProps {
  onNewProject: () => void;
  onOpenProject: () => void;
  onSaveProject: () => void;
  onSaveAsProject: () => void;
  projectDisplayName?: string;
}

export const ProjectBar: React.FC<ProjectBarProps> = ({
  onNewProject,
  onOpenProject: onOpenProjectTrigger,
  onSaveProject,
  onSaveAsProject,
  projectDisplayName
}) => {
  const { currentProjectId, projects } = useProject();
  const [openDialogVisible, setOpenDialogVisible] = useState(false);
  
  // Si aucun projectDisplayName n'est fourni, revenir au projet du contexte
  const displayName = projectDisplayName || (() => {
    const currentProject = projects.find(p => p.id === currentProjectId);
    return currentProject?.name || "Projet sans titre";
  })();

  // Fonction pour gérer l'ouverture du dialogue de projets
  const handleOpenProjectClick = () => {
    setOpenDialogVisible(true);
    // Appeler le callback pour déclencher d'autres actions si nécessaire
    if (onOpenProjectTrigger) {
      onOpenProjectTrigger();
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-2 mb-2 flex flex-wrap items-center justify-between border-b">
        <div className="flex space-x-2 mb-2 md:mb-0">
          <Button variant="outline" size="sm" onClick={onNewProject}>
            <FilePlus2 className="mr-1" size={16} />
            Nouveau
          </Button>
          <Button variant="outline" size="sm" onClick={handleOpenProjectClick}>
            <FolderOpen className="mr-1" size={16} />
            Ouvrir
          </Button>
          <Button variant="outline" size="sm" onClick={onSaveProject}>
            <Save className="mr-1" size={16} />
            Enregistrer
          </Button>
          <Button variant="outline" size="sm" onClick={onSaveAsProject}>
            <SaveAll className="mr-1" size={16} />
            Enregistrer Sous
          </Button>
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded-md text-gray-800 border">
          <span className="text-gray-500 mr-1">Projet en cours:</span>
          <span className="font-medium">{displayName}</span>
        </div>
      </div>
      
      <OpenProjectDialog 
        open={openDialogVisible} 
        onOpenChange={setOpenDialogVisible} 
      />
    </>
  );
};
