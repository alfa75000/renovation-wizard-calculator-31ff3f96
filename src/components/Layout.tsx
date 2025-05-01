
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
import { isDevisNumberUnique } from '@/services/devisService';

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
  
  const { 
    handleSaveProject, 
    handleSaveAsProject, // Utiliser la fonction correcte et bien exportée
    handleNewProject, 
    currentProjectId 
  } = useProjectOperations();
  
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
  
  // Fonction pour gérer l'action "Enregistrer sous" avec vérification du numéro de devis
  const handleSmartSaveAsProject = async () => {
    try {
      // Vérifier d'abord que le devis number n'existe pas déjà
      const currentDevisNumber = state?.metadata?.devisNumber;
      
      if (currentDevisNumber) {
        const isUnique = await isDevisNumberUnique(currentDevisNumber);
        
        if (!isUnique) {
          toast.error('Ce numéro de devis existe déjà. Veuillez le modifier avant de continuer.');
          return;
        }
      }
      
      // Si le numéro de devis n'existe pas encore ou est unique, ouvrir la boîte de dialogue
      setSaveAsDialogOpen(true);
    } catch (error) {
      console.error('Erreur lors de la vérification du numéro de devis:', error);
      toast.error('Une erreur est survenue lors de la vérification du numéro de devis');
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
        onSaveAsProject={handleSmartSaveAsProject}
        projectDisplayName={projectName}
        hasUnsavedChanges={hasUnsavedChanges}
        showLoadLastProject={!currentProjectId}
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
        // Passer la fonction saveFunction avec le bon type et le bon nom
        saveFunction={handleSaveAsProject}
      />
      
      <OpenProjectDialog 
        open={openProjectDialogOpen}
        onOpenChange={setOpenProjectDialogOpen}
      />
    </div>
  );
};
