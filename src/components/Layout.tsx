
import React, { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from './ui/sheet';
import { FilePlus2, FolderOpen, Save, SaveAll } from 'lucide-react';
import { useProjetChantier } from '@/contexts/ProjetChantierContext';
import { useClients } from '@/contexts/ClientsContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  const location = useLocation();
  const { state: projectState, currentProjectId, projects, createNewProject, loadProject, saveProject } = useProject();
  const { state: chantierState } = useProjetChantier();
  const { state: clientsState } = useClients();
  
  // États pour les modales
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [saveAsDialogOpen, setSaveAsDialogOpen] = useState(false);
  const [openProjectSheetOpen, setOpenProjectSheetOpen] = useState(false);
  
  // États pour les formulaires
  const [clientId, setClientId] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [projectDate, setProjectDate] = useState<string>('');
  
  // Effet pour définir la date par défaut
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
    setProjectDate(formattedDate);
  }, []);
  
  // Nom du projet actuel
  const currentProject = projects.find(p => p.id === currentProjectId);
  const projectDisplayName = currentProject?.name || "Projet sans titre";

  // Générer automatiquement le nom du projet
  const generateProjectName = (clientId: string, description: string) => {
    const client = clientsState.clients.find(c => c.id === clientId);
    const clientName = client ? `${client.nom} ${client.prenom}` : 'Client';
    const desc = description.trim() || 'Rénovation';
    const date = format(new Date(projectDate), 'MMyyyy');
    
    return `${clientName} - ${desc} - ${date}`;
  };
  
  // Mettre à jour le nom du projet quand les champs changent
  useEffect(() => {
    if (clientId && projectDescription) {
      setProjectName(generateProjectName(clientId, projectDescription));
    }
  }, [clientId, projectDescription, projectDate]);
  
  // Gérer la création d'un nouveau projet
  const handleCreateNewProject = async () => {
    if (!clientId) {
      toast.error("Veuillez sélectionner un client");
      return;
    }
    
    if (!projectDescription) {
      toast.error("Veuillez saisir une description pour le projet");
      return;
    }
    
    try {
      // Créer un nouveau projet vide
      await createNewProject();
      
      // Préparer les informations du projet
      const projectInfo = {
        name: projectName,
        clientId: clientId,
        description: projectDescription
      };
      
      // Enregistrer le projet avec les informations
      // Utiliser un seul argument qui est le projectInfo
      await saveProject(projectInfo);
      
      setNewProjectDialogOpen(false);
      toast.success("Nouveau projet créé avec succès");
    } catch (error) {
      console.error("Erreur lors de la création du projet:", error);
      toast.error("Erreur lors de la création du projet");
    }
  };
  
  // Gérer l'ouverture d'un projet existant
  const handleOpenProject = (projectId: string) => {
    loadProject(projectId)
      .then(() => {
        setOpenProjectSheetOpen(false);
        toast.success("Projet ouvert avec succès");
      })
      .catch(error => {
        console.error("Erreur lors de l'ouverture du projet:", error);
        toast.error("Erreur lors de l'ouverture du projet");
      });
  };
  
  // Gérer l'enregistrement sous un nouveau nom
  const handleSaveAs = () => {
    if (!clientId) {
      toast.error("Veuillez sélectionner un client");
      return;
    }
    
    if (!projectDescription) {
      toast.error("Veuillez saisir une description pour le projet");
      return;
    }
    
    // Préparer les informations du projet
    const projectInfo = {
      name: projectName,
      clientId: clientId,
      description: projectDescription
    };
    
    // Utiliser un seul argument qui est le projectInfo
    saveProject(projectInfo)
      .then(() => {
        setSaveAsDialogOpen(false);
        toast.success("Projet enregistré avec succès");
      })
      .catch(error => {
        console.error("Erreur lors de l'enregistrement du projet:", error);
        toast.error("Erreur lors de l'enregistrement du projet");
      });
  };
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100';
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre d'outils projet placée en haut de page */}
      <div className="max-w-6xl mx-auto px-4 py-2 mb-2 flex flex-wrap items-center justify-between border-b">
        <div className="flex space-x-2 mb-2 md:mb-0">
          <Button variant="outline" size="sm" onClick={() => setNewProjectDialogOpen(true)}>
            <FilePlus2 className="mr-1" size={16} />
            Nouveau
          </Button>
          <Button variant="outline" size="sm" onClick={() => setOpenProjectSheetOpen(true)}>
            <FolderOpen className="mr-1" size={16} />
            Ouvrir
          </Button>
          <Button variant="outline" size="sm" onClick={() => saveProject()}>
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
          <span className="font-medium">{projectDisplayName}</span>
        </div>
      </div>
      
      {/* Header avec titre et sous-titre optionnels */}
      {(title || subtitle) && (
        <div className="flex flex-col items-center justify-center mb-4 bg-blue-600 text-white p-6 rounded-lg max-w-6xl mx-auto mt-4">
          {title && <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>}
          {subtitle && <p className="mt-2 text-lg">{subtitle}</p>}
        </div>
      )}
      
      {/* Barre de navigation */}
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
            <DialogDescription>
              Créez un nouveau projet en sélectionnant un client et en ajoutant une description.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">
                Client
              </Label>
              <Select value={clientId} onValueChange={(value) => {
                setClientId(value);
                if (value && projectDescription) {
                  setProjectName(generateProjectName(value, projectDescription));
                }
              }}>
                <SelectTrigger id="client" className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un client" />
                </SelectTrigger>
                <SelectContent>
                  {clientsState.clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.nom} {client.prenom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-description" className="text-right">
                Description
              </Label>
              <Input
                id="project-description"
                className="col-span-3"
                placeholder="Description du projet (ex: Rénovation salon)"
                value={projectDescription}
                onChange={(e) => {
                  setProjectDescription(e.target.value);
                  if (clientId && e.target.value) {
                    setProjectName(generateProjectName(clientId, e.target.value));
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date-start" className="text-right">
                Date de début
              </Label>
              <Input
                id="date-start"
                type="date"
                className="col-span-3"
                value={projectDate}
                onChange={(e) => {
                  setProjectDate(e.target.value);
                  if (clientId && projectDescription) {
                    setProjectName(generateProjectName(clientId, projectDescription));
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-name" className="text-right">
                Nom du projet
              </Label>
              <Input
                id="project-name"
                className="col-span-3 bg-gray-50"
                value={projectName}
                readOnly
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewProjectDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateNewProject}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modale Enregistrer Sous */}
      <Dialog open={saveAsDialogOpen} onOpenChange={setSaveAsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enregistrer Sous</DialogTitle>
            <DialogDescription>
              Sauvegardez votre projet actuel sous un nouveau nom.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-save" className="text-right">
                Client
              </Label>
              <Select value={clientId} onValueChange={(value) => {
                setClientId(value);
                if (value && projectDescription) {
                  setProjectName(generateProjectName(value, projectDescription));
                }
              }}>
                <SelectTrigger id="client-save" className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un client" />
                </SelectTrigger>
                <SelectContent>
                  {clientsState.clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.nom} {client.prenom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-description-save" className="text-right">
                Description
              </Label>
              <Input
                id="project-description-save"
                className="col-span-3"
                placeholder="Description du projet (ex: Rénovation salon)"
                value={projectDescription}
                onChange={(e) => {
                  setProjectDescription(e.target.value);
                  if (clientId && e.target.value) {
                    setProjectName(generateProjectName(clientId, e.target.value));
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date-start-save" className="text-right">
                Date de début
              </Label>
              <Input
                id="date-start-save"
                type="date"
                className="col-span-3"
                value={projectDate}
                onChange={(e) => {
                  setProjectDate(e.target.value);
                  if (clientId && projectDescription) {
                    setProjectName(generateProjectName(clientId, projectDescription));
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-name-save" className="text-right">
                Nom du projet
              </Label>
              <Input
                id="project-name-save"
                className="col-span-3 bg-gray-50"
                value={projectName}
                readOnly
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveAsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveAs}>Enregistrer</Button>
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
                projects.map((project) => {
                  const client = clientsState.clients.find(c => c.id === project.client_id);
                  return (
                    <div 
                      key={project.id}
                      className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        {client && (
                          <p className="text-sm text-gray-500">
                            Client: {client.nom} {client.prenom}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : new Date(project.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenProject(project.id)}
                      >
                        Ouvrir
                      </Button>
                    </div>
                  );
                })
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
