
import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from './ui/sheet';
import { FilePlus2, FolderOpen, Save, SaveAll } from 'lucide-react';
import { useProjetChantier } from '@/contexts/ProjetChantierContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  const location = useLocation();
  const { state: projectState, currentProjectId, projects } = useProject();
  const { state: chantierState } = useProjetChantier();
  
  // États pour les modales
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [saveAsDialogOpen, setSaveAsDialogOpen] = useState(false);
  const [openProjectSheetOpen, setOpenProjectSheetOpen] = useState(false);
  
  // Nom du projet actuel
  const currentProject = projects.find(p => p.id === currentProjectId);
  const projectName = currentProject?.name || "Projet sans titre";
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100';
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec titre et sous-titre optionnels */}
      {(title || subtitle) && (
        <div className="flex flex-col items-center justify-center mb-4 bg-blue-600 text-white p-6 rounded-lg max-w-6xl mx-auto mt-4">
          {title && <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>}
          {subtitle && <p className="mt-2 text-lg">{subtitle}</p>}
        </div>
      )}
      
      {/* Barre d'outils projet */}
      <div className="max-w-6xl mx-auto px-4 mb-2 flex flex-wrap items-center justify-between">
        <div className="flex space-x-2 mb-2 md:mb-0">
          <Button variant="outline" size="sm" onClick={() => setNewProjectDialogOpen(true)}>
            <FilePlus2 className="mr-1" size={16} />
            Nouveau
          </Button>
          <Button variant="outline" size="sm" onClick={() => setOpenProjectSheetOpen(true)}>
            <FolderOpen className="mr-1" size={16} />
            Ouvrir
          </Button>
          <Button variant="outline" size="sm">
            <Save className="mr-1" size={16} />
            Enregistrer
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSaveAsDialogOpen(true)}>
            <SaveAll className="mr-1" size={16} />
            Enregistrer Sous
          </Button>
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded-md text-gray-800 border">
          <span className="text-gray-500 mr-1">Projet:</span>
          <span className="font-medium">{projectName}</span>
        </div>
      </div>
      
      {/* Barre de navigation placée en dessous des outils projet */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <nav className="flex flex-wrap gap-2 justify-center">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-md transition-colors ${isActive('/')}`}
          >
            Saisie
          </Link>
          <Link 
            to="/travaux" 
            className={`px-4 py-2 rounded-md transition-colors ${isActive('/travaux')}`}
          >
            Travaux
          </Link>
          <Link 
            to="/recapitulatif" 
            className={`px-4 py-2 rounded-md transition-colors ${isActive('/recapitulatif')}`}
          >
            Récapitulatif
          </Link>
          <Link 
            to="/infos-chantier" 
            className={`px-4 py-2 rounded-md transition-colors ${isActive('/infos-chantier')}`}
          >
            Infos Chantier / Client
          </Link>
          <Link 
            to="/parametres" 
            className={`px-4 py-2 rounded-md transition-colors ${isActive('/parametres')}`}
          >
            Paramètres
          </Link>
        </nav>
      </div>
      
      {/* Contenu principal */}
      <main className="max-w-6xl mx-auto px-4 pb-8">
        {children}
      </main>
      
      {/* Modale Nouveau Projet */}
      <Dialog open={newProjectDialogOpen} onOpenChange={setNewProjectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nouveau Projet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="project-name" className="text-right">
                Nom du projet
              </label>
              <input
                id="project-name"
                className="col-span-3 border rounded-md px-3 py-2"
                placeholder="Saisissez un nom pour votre projet"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="client" className="text-right">
                Client
              </label>
              <select
                id="client"
                className="col-span-3 border rounded-md px-3 py-2"
              >
                <option value="">Sélectionnez un client</option>
                {/* Options clients à remplir dynamiquement */}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date-start" className="text-right">
                Date de début
              </label>
              <input
                id="date-start"
                type="date"
                className="col-span-3 border rounded-md px-3 py-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewProjectDialogOpen(false)}>
              Annuler
            </Button>
            <Button>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modale Enregistrer Sous */}
      <Dialog open={saveAsDialogOpen} onOpenChange={setSaveAsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enregistrer Sous</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="project-name-save" className="text-right">
                Nom du projet
              </label>
              <input
                id="project-name-save"
                className="col-span-3 border rounded-md px-3 py-2"
                placeholder="Saisissez un nom pour votre projet"
                defaultValue={projectName}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="client-save" className="text-right">
                Client
              </label>
              <select
                id="client-save"
                className="col-span-3 border rounded-md px-3 py-2"
              >
                <option value="">Sélectionnez un client</option>
                {/* Options clients à remplir dynamiquement */}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date-start-save" className="text-right">
                Date de début
              </label>
              <input
                id="date-start-save"
                type="date"
                className="col-span-3 border rounded-md px-3 py-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveAsDialogOpen(false)}>
              Annuler
            </Button>
            <Button>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Panneau latéral Ouvrir Projet */}
      <Sheet open={openProjectSheetOpen} onOpenChange={setOpenProjectSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Ouvrir un projet</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="text-center text-gray-500 my-8">
                  Aucun projet disponible
                </div>
              ) : (
                projects.map((project) => (
                  <div 
                    key={project.id}
                    className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                    onClick={() => {
                      // Fonction à compléter pour charger le projet
                      setOpenProjectSheetOpen(false);
                    }}
                  >
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-500">Modifié le: {new Date(project.updated_at).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ouvrir
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setOpenProjectSheetOpen(false)}>
              Fermer
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

