
import React, { ReactNode, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectBar } from './layout/ProjectBar';
import { TitleHeader } from './layout/TitleHeader';
import { Navigation } from './layout/Navigation';
import { NewProjectDialog } from './layout/NewProjectDialog';
import { SaveAsDialog } from './layout/SaveAsDialog';
import { OpenProjectDialog } from './layout/OpenProjectDialog';
import { LayoutProps } from './Layout.d';
import { useProjectOperations } from '@/features/chantier/hooks/useProjectOperations';
import { toast } from 'sonner';

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  actions,
}) => {
  const { 
    createNewProject,
    state,
    hasUnsavedChanges
  } = useProject();
  
  const { handleSaveProject } = useProjectOperations();
  
  // Récupérer directement le nom du projet depuis le contexte global
  const projectName = state.metadata.nomProjet || '';
  
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [saveAsDialogOpen, setSaveAsDialogOpen] = useState(false);
  const [openProjectDialogOpen, setOpenProjectDialogOpen] = useState(false);
  
  // Création d'un nouveau projet
  const handleCreateNewProject = () => {
    createNewProject();
    setNewProjectDialogOpen(false);
  };
  
  // Fonction pour la sauvegarde rapide directe
  const handleQuickSaveProject = async () => {
    // Vérifier d'abord si les données nécessaires sont disponibles
    if (!state.metadata.clientId) {
      toast.error('Veuillez sélectionner un client avant de sauvegarder le projet');
      return;
    }
    
    try {
      // Utiliser les données existantes pour sauvegarder directement
      await handleSaveProject();
      // Note: Le toast de succès est maintenant affiché dans handleSaveProject
    } catch (error) {
      console.error('Erreur lors de la sauvegarde rapide:', error);
      // Note: Le toast d'erreur est maintenant affiché dans handleSaveProject
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectBar 
        onNewProject={() => setNewProjectDialogOpen(true)}
        onOpenProject={() => setOpenProjectDialogOpen(true)}
        onSaveProject={handleQuickSaveProject}
        onSaveAsProject={() => setSaveAsDialogOpen(true)}
        projectDisplayName={projectName}
        hasUnsavedChanges={hasUnsavedChanges}
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
        dialogTitle="Enregistrer Sous"
      />
      
      <OpenProjectDialog 
        open={openProjectDialogOpen}
        onOpenChange={setOpenProjectDialogOpen}
      />
    </div>
  );
};
