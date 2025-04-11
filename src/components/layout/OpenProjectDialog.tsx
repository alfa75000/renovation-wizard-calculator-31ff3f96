
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { Project } from '@/types';
import { ProjectList } from '@/features/chantier/components/ProjectList';
import { Loader } from '@/components/ui/loader';

interface OpenProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OpenProjectDialog({ open, onOpenChange }: OpenProjectDialogProps) {
  const { projects, isLoading, loadProject, currentProjectId, refreshProjects, state } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Project; direction: 'asc' | 'desc' }>({
    key: 'updated_at',
    direction: 'desc'
  });

  // Mettre à jour les projets filtrés
  useEffect(() => {
    refreshProjects();
  }, [open, refreshProjects]);

  // Filtrer et trier les projets
  useEffect(() => {
    if (!projects.length) return;
    
    let result = [...projects];
    
    // Filtrer selon le terme de recherche
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(project => 
        project.name.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    // Trier les projets
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      
      // Configuration du tri ascendant/descendant
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // Pour les dates et les nombres
      return sortConfig.direction === 'asc'
        ? (aValue < bValue ? -1 : 1)
        : (aValue > bValue ? -1 : 1);
    });
    
    setFilteredProjects(result);
  }, [projects, searchTerm, sortConfig]);

  // Fonction pour changer le tri
  const requestSort = (key: keyof Project) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Fonction pour charger un projet
  const handleLoadProject = async (projectId: string) => {
    try {
      // Utiliser la version correcte de loadProject qui est une fonction
      if (typeof loadProject === 'function') {
        await loadProject(projectId);
        onOpenChange(false);
      } else {
        console.error("loadProject n'est pas une fonction:", loadProject);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du projet:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Ouvrir un projet</DialogTitle>
          <DialogDescription>
            Sélectionnez un projet à ouvrir dans la liste ci-dessous.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un projet..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => requestSort('name')}
            className={sortConfig.key === 'name' ? 'bg-primary/10' : ''}
          >
            Nom {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => requestSort('updated_at')}
            className={sortConfig.key === 'updated_at' ? 'bg-primary/10' : ''}
          >
            Date {sortConfig.key === 'updated_at' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </Button>
        </div>
        
        <ScrollArea className="flex-grow">
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <Loader />
            </div>
          ) : (
            <ProjectList
              projects={filteredProjects}
              currentProjectId={currentProjectId}
              projectState={state}
              isLoading={isLoading}
              onSelectProject={handleLoadProject}
            />
          )}
        </ScrollArea>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
