import React, { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from './ui/sheet';
import { FilePlus2, FolderOpen, Save, SaveAll, RefreshCw } from 'lucide-react';
import { useClients } from '@/contexts/ClientsContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { generateDevisNumber, isDevisNumberUnique } from '@/services/projectService';
import { toast } from 'sonner';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  const location = useLocation();
  const { 
    state: projectState, 
    currentProjectId, 
    projects, 
    saveProject, 
    loadProject, 
    createNewProject 
  } = useProject();
  const { state: clientsState } = useClients();
  
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [saveAsDialogOpen, setSaveAsDialogOpen] = useState(false);
  const [openProjectSheetOpen, setOpenProjectSheetOpen] = useState(false);
  
  const [clientId, setClientId] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [projectDate, setProjectDate] = useState<string>('');
  const [devisNumber, setDevisNumber] = useState<string>('');
  const [isGeneratingDevisNumber, setIsGeneratingDevisNumber] = useState<boolean>(false);
  
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setProjectDate(formattedDate);
  }, []);
  
  useEffect(() => {
    if (currentProjectId) {
      const currentProject = projects.find(p => p.id === currentProjectId);
      if (currentProject) {
        setClientId(currentProject.client_id || '');
        setProjectName(currentProject.name || '');
        setProjectDescription(currentProject.description || '');
        if (currentProject.devis_number) {
          setDevisNumber(currentProject.devis_number);
        }
      }
    }
  }, [currentProjectId, projects, saveAsDialogOpen]);
  
  const currentProject = projects.find(p => p.id === currentProjectId);
  const projectDisplayName = currentProject?.name || "Projet sans titre";
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100';
  };
  
  const handleGenerateDevisNumber = async () => {
    try {
      setIsGeneratingDevisNumber(true);
      const newDevisNumber = await generateDevisNumber();
      setDevisNumber(newDevisNumber);
      
      if (clientId) {
        const client = clientsState.clients.find(c => c.id === clientId);
        if (client) {
          const clientName = `${client.nom} ${client.prenom || ''}`.trim();
          let newName = `Devis n° ${newDevisNumber} - ${clientName}`;
          
          if (projectDescription) {
            newName += projectDescription.length > 40 
              ? ` - ${projectDescription.substring(0, 40)}...` 
              : ` - ${projectDescription}`;
          }
          
          setProjectName(newName);
        }
      }
      
      toast.success('Numéro de devis généré avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du numéro de devis:', error);
      toast.error('Erreur lors de la génération du numéro de devis');
    } finally {
      setIsGeneratingDevisNumber(false);
    }
  };
  
  useEffect(() => {
    if (clientId && (devisNumber || projectDescription)) {
      const client = clientsState.clients.find(c => c.id === clientId);
      if (client) {
        const clientName = `${client.nom} ${client.prenom || ''}`.trim();
        let newName = '';
        
        if (devisNumber) {
          newName = `Devis n° ${devisNumber} - ${clientName}`;
        } else {
          newName = clientName;
        }
        
        if (projectDescription) {
          newName += projectDescription.length > 40 
            ? ` - ${projectDescription.substring(0, 40)}...` 
            : ` - ${projectDescription}`;
        }
        
        setProjectName(newName);
      }
    }
  }, [devisNumber, clientId, projectDescription, clientsState.clients]);
  
  const handleSaveProject = async () => {
    if (!clientId) {
      toast.error('Veuillez sélectionner un client');
      return;
    }
    
    try {
      await saveProject();
      toast.success('Projet enregistré avec succès');
      setSaveAsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du projet:', error);
      toast.error('Erreur lors de l\'enregistrement du projet');
    }
  };
  
  const handleCreateNewProject = () => {
    createNewProject();
    setClientId('');
    setProjectName('');
    setProjectDescription('');
    setDevisNumber('');
    setNewProjectDialogOpen(false);
    toast.success('Nouveau projet créé');
  };
  
  const handleLoadProject = async (projectId: string) => {
    try {
      await loadProject(projectId);
      setOpenProjectSheetOpen(false);
      toast.success('Projet chargé avec succès');
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Erreur lors du chargement du projet');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
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
          <Button variant="outline" size="sm" onClick={() => handleSaveProject()}>
            <Save className="mr-1" size={16} />
            Enregistrer
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSaveAsDialogOpen(true)}>
            <SaveAll className="mr-1" size={16} />
            Enregistrer Sous
          </Button>
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded-md text-gray-800 border">
          <span className="text-gray-500 mr-1">Projet en cours:</span>
          <span className="font-medium">{projectDisplayName}</span>
        </div>
      </div>
      
      {(title || subtitle) && (
        <div className="flex flex-col items-center justify-center mb-4 bg-blue-600 text-white p-6 rounded-lg max-w-6xl mx-auto mt-4">
          {title && <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>}
          {subtitle && <p className="mt-2 text-lg">{subtitle}</p>}
        </div>
      )}
      
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
      
      <main className="max-w-6xl mx-auto px-4 pb-8">
        {children}
      </main>
      
      <Dialog open={newProjectDialogOpen} onOpenChange={setNewProjectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nouveau Projet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">
                Client
              </Label>
              <Select value={clientId} onValueChange={setClientId}>
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
              <Label htmlFor="date-start" className="text-right">
                Date de début
              </Label>
              <Input
                id="date-start"
                type="date"
                className="col-span-3"
                value={projectDate}
                onChange={(e) => setProjectDate(e.target.value)}
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
      
      <Dialog open={saveAsDialogOpen} onOpenChange={setSaveAsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enregistrer Sous</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="devisNumber" className="text-right">
                Numéro du devis
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="devisNumber"
                  value={devisNumber}
                  onChange={(e) => setDevisNumber(e.target.value)}
                  placeholder="Ex: 2504-1"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={handleGenerateDevisNumber}
                  disabled={isGeneratingDevisNumber}
                >
                  <RefreshCw className={`h-4 w-4 ${isGeneratingDevisNumber ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-save" className="text-right">
                Client
              </Label>
              <Select value={clientId} onValueChange={setClientId}>
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
              <Label htmlFor="project-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="project-description"
                className="col-span-3"
                placeholder="Description du projet (100 caractères max)"
                value={projectDescription}
                onChange={(e) => {
                  if (e.target.value.length <= 100) {
                    setProjectDescription(e.target.value);
                  }
                }}
                maxLength={100}
                rows={2}
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date-start-save" className="text-right">
                Date de début
              </Label>
              <Input
                id="date-start-save"
                type="date"
                className="col-span-3"
                value={projectDate}
                onChange={(e) => setProjectDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveAsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveProject}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
                      onClick={() => handleLoadProject(project.id)}
                    >
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        {project.devis_number && (
                          <p className="text-xs text-blue-600 font-medium">
                            Devis n° {project.devis_number}
                          </p>
                        )}
                        {client && (
                          <p className="text-sm text-gray-500">
                            Client: {client.nom} {client.prenom}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : new Date(project.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
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
