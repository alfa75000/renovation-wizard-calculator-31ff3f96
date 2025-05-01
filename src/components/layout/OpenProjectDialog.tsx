import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, SortAsc, SortDesc, CalendarDays, User, X, Check, Filter, Clock } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { Project } from '@/types';
import { ProjectList } from '@/features/chantier/components/ProjectList';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useClients } from '@/contexts/ClientsContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OpenProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OpenProjectDialog({ open, onOpenChange }: OpenProjectDialogProps) {
  const { 
    projects, 
    isLoading, 
    loadProject, 
    currentProjectId, 
    refreshProjects, 
    state 
  } = useProject();
  
  const { state: clientsState } = useClients();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Project; direction: 'asc' | 'desc' }>({
    key: 'updated_at',
    direction: 'desc'
  });
  
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [showOnlyWithDevis, setShowOnlyWithDevis] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const [hasRefreshed, setHasRefreshed] = useState(false);
  
  useEffect(() => {
    if (open && !hasRefreshed) {
      console.log("Rafraîchissement des projets...");
      refreshProjects()
        .then(() => {
          setHasRefreshed(true);
        })
        .catch(error => {
          console.error('Erreur lors du rafraîchissement des projets:', error);
          toast.error('Erreur lors du chargement de la liste des projets');
        });
    }
    
    if (!open) {
      setHasRefreshed(false);
    }
  }, [open, refreshProjects, hasRefreshed]);

  useEffect(() => {
    const newActiveFilters: string[] = [];
    
    if (clientFilter) {
      const client = clientsState.clients.find(c => c.id === clientFilter);
      if (client) {
        newActiveFilters.push(`Client: ${client.nom} ${client.prenom}`);
      }
    }
    
    if (showOnlyWithDevis) {
      newActiveFilters.push('Avec devis');
    }
    
    setActiveFilters(newActiveFilters);
  }, [clientFilter, showOnlyWithDevis, clientsState.clients]);

  useEffect(() => {
    if (!projects || !projects.length) {
      setFilteredProjects([]);
      return;
    }
    
    let result = [...projects];
    
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(project => 
        project.name.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    if (clientFilter) {
      result = result.filter(project => project.client_id === clientFilter);
    }
    
    if (showOnlyWithDevis) {
      result = result.filter(project => !!project.devis_number);
    }
    
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortConfig.direction === 'asc'
        ? (aValue < bValue ? -1 : 1)
        : (aValue > bValue ? -1 : 1);
    });
    
    setFilteredProjects(result);
  }, [projects, searchTerm, sortConfig, clientFilter, showOnlyWithDevis]);

  const requestSort = (key: keyof Project) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleLoadProject = async (projectId: string) => {
    if (!projectId) {
      toast.error("ID de projet invalide");
      return;
    }
    
    try {
      console.log("Tentative de chargement du projet:", projectId);
      await loadProject(projectId);
      onOpenChange(false);
      toast.success('Projet chargé avec succès');
    } catch (error) {
      console.error("Erreur lors du chargement du projet:", error);
      toast.error("Erreur lors du chargement du projet");
    }
  };

  const removeFilter = (filter: string) => {
    if (filter.startsWith('Client:')) {
      setClientFilter(null);
    } else if (filter === 'Avec devis') {
      setShowOnlyWithDevis(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setSearchTerm('');
      setClientFilter(null);
      setShowOnlyWithDevis(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Ouvrir un projet</DialogTitle>
          <DialogDescription>
            Sélectionnez un projet à ouvrir dans la liste ci-dessous.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un projet..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Filter size={18} />
                {activeFilters.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filtres</h4>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client</label>
                  <Select value={clientFilter || ''} onValueChange={(value) => setClientFilter(value || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les clients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les clients</SelectItem>
                      {clientsState.clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.nom} {client.prenom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="with-devis" 
                    checked={showOnlyWithDevis}
                    onCheckedChange={(checked) => setShowOnlyWithDevis(checked === true)}
                  />
                  <label htmlFor="with-devis" className="text-sm font-medium cursor-pointer">
                    Projets avec devis uniquement
                  </label>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setClientFilter(null);
                      setShowOnlyWithDevis(false);
                    }}
                  >
                    Réinitialiser
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setFilterPopoverOpen(false)}
                  >
                    Appliquer
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                {filter}
                <button 
                  onClick={() => removeFilter(filter)}
                  className="ml-1 hover:bg-gray-200 rounded-full"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex gap-2 mb-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => requestSort('name')}
            className={sortConfig.key === 'name' ? 'bg-primary/10' : ''}
          >
            <span>Nom</span> 
            {sortConfig.key === 'name' && (
              sortConfig.direction === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => requestSort('created_at')}
            className={sortConfig.key === 'created_at' ? 'bg-primary/10' : ''}
          >
            <CalendarDays size={16} className="mr-1" />
            <span>Date création</span>
            {sortConfig.key === 'created_at' && (
              sortConfig.direction === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => requestSort('updated_at')}
            className={sortConfig.key === 'updated_at' ? 'bg-primary/10' : ''}
          >
            <Clock size={16} className="mr-1" />
            <span>Date modification</span>
            {sortConfig.key === 'updated_at' && (
              sortConfig.direction === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => requestSort('client_id')}
            className={sortConfig.key === 'client_id' ? 'bg-primary/10' : ''}
          >
            <User size={16} className="mr-1" />
            <span>Client</span>
            {sortConfig.key === 'client_id' && (
              sortConfig.direction === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
            )}
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground mb-2">
          {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''} trouvé{filteredProjects.length !== 1 ? 's' : ''}
        </div>
        
        <ScrollArea className="flex-grow border rounded-md h-[400px]">
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <Loader />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              {projects.length === 0 ? 'Aucun projet trouvé' : 'Aucun projet ne correspond à votre recherche'}
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
