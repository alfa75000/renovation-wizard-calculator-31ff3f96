
import React, { ReactNode, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectBar } from './layout/ProjectBar';
import { TitleHeader } from './layout/TitleHeader';
import { Navigation } from './layout/Navigation';
import { SaveAsDialog } from './layout/SaveAsDialog';
import { OpenProjectDialog } from './layout/OpenProjectDialog';
import { LayoutProps } from './Layout.d';
import { useProjectOperations } from '@/features/chantier/hooks/useProjectOperations';
import { toast } from 'sonner';
import { useAutoSave } from '@/hooks/useAutoSave';

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  actions,
}) => {
  const { 
    state,
    hasUnsavedChanges
  } = useProject();
  
  const { handleSaveProject, handleNewProject, currentProjectId } = useProjectOperations();
  
  // Activer l'auto-sauvegarde au niveau global de l'application
  useAutoSave();
  
  // Récupérer directement le nom du projet depuis le contexte global
  const projectName = state?.metadata?.nomProjet || '';
  
  const [saveAsDialogOpen, setSaveAsDialogOpen] = useState(false);
  const [openProjectDialogOpen, setOpenProjectDialogOpen] = useState(false);
  
  // Fonction intelligente pour la sauvegarde
  const handleSmartSaveProject = async () => {
    // Si nous n'avons pas d'ID de projet actuel, ouvrir le dialogue "Enregistrer sous"
    if (!currentProjectId) {
      setSaveAsDialogOpen(true);
      return;
    }
    
    // Sinon, procéder à la sauvegarde rapide
    try {
      // Vérifier d'abord si state et les données nécessaires sont disponibles
      if (!state || !state.metadata || !state.metadata.clientId) {
        toast.error('Veuillez sélectionner un client avant de sauvegarder le projet');
        return;
      }
      
      await handleSaveProject();
      // Note: Le toast de succès est maintenant affiché dans handleSaveProject
    } catch (error) {
      console.error('Erreur lors de la sauvegarde rapide:', error);
      // Note: Le toast d'erreur est maintenant affiché dans handleSaveProject
    }
  };

  // Fonction de confirmation pour la création d'un nouveau projet
  const confirmAndHandleNewProject = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm("Des modifications non sauvegardées seront perdues. Voulez-vous continuer ?")) {
        return;
      }
    }
    
    // Appeler la fonction de réinitialisation du projet
    handleNewProject();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectBar 
        onNewProject={confirmAndHandleNewProject}
        onOpenProject={() => setOpenProjectDialogOpen(true)}
        onSaveProject={handleSmartSaveProject}
        onSaveAsProject={() => setSaveAsDialogOpen(true)}
        projectDisplayName={projectName}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      
      <TitleHeader title={title} subtitle={subtitle} />
      
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 pb-8">
        {children}
      </main>
      
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
