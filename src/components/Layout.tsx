
import React, { ReactNode, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';
import { ProjectBar } from './layout/ProjectBar';
import { TitleHeader } from './layout/TitleHeader';
import { Navigation } from './layout/Navigation';
import { NewProjectDialog } from './layout/NewProjectDialog';
import { SaveAsDialog } from './layout/SaveAsDialog';
import { OpenProjectDialog } from './layout/OpenProjectDialog';
import { LayoutProps } from './Layout.d';

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  actions,
}) => {
  const { 
    currentProjectId, 
    saveProject, 
    createNewProject,
    state 
  } = useProject();
  
  // Récupérer directement le nom du projet depuis le contexte global
  const projectName = state.metadata.nomProjet || '';
  
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [saveAsDialogOpen, setSaveAsDialogOpen] = useState(false);
  const [openProjectDialogOpen, setOpenProjectDialogOpen] = useState(false);
  
  const handleCreateNewProject = () => {
    createNewProject();
    setNewProjectDialogOpen(false);
    toast.success('Nouveau projet créé');
  };
  
  const handleSaveProject = async () => {
    try {
      await saveProject();
      toast.success('Projet enregistré avec succès');
      setSaveAsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du projet:', error);
      toast.error('Erreur lors de l\'enregistrement du projet');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectBar 
        onNewProject={() => setNewProjectDialogOpen(true)}
        onOpenProject={() => setOpenProjectDialogOpen(true)}
        onSaveProject={handleSaveProject}
        onSaveAsProject={() => setSaveAsDialogOpen(true)}
        projectDisplayName={projectName}
      />
      
      <TitleHeader title={title} subtitle={subtitle} />
      
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 pb-8">
        {children}
      </main>
      
      <NewProjectDialog 
        open={newProjectDialogOpen}
        onOpenChange={setNewProjectDialogOpen}
        onCreateProject={handleCreateNewProject}
      />
      
      <SaveAsDialog 
        open={saveAsDialogOpen}
        onOpenChange={setSaveAsDialogOpen}
        onSaveProject={handleSaveProject}
      />
      
      <OpenProjectDialog 
        open={openProjectDialogOpen}
        onOpenChange={setOpenProjectDialogOpen}
      />
    </div>
  );
};
