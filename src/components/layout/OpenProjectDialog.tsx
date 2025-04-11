
import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, SortAsc, SortDesc, FileText, Calendar, User, ArrowUpDown } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { useClients } from '@/contexts/ClientsContext';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Project } from '@/types';

interface OpenProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SortField = 'name' | 'client' | 'updated_at' | 'devis_number';
type SortDirection = 'asc' | 'desc';

export const OpenProjectDialog: React.FC<OpenProjectDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { projects, loadProject } = useProject();
  const { state: clientsState } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('updated_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const handleLoadProject = async (projectId: string) => {
    try {
      await loadProject(projectId);
      onOpenChange(false);
      toast.success('Projet chargé avec succès');
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Erreur lors du chargement du projet');
    }
  };

  const toggleSortDirection = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const filteredAndSortedProjects = useMemo(() => {
    // Filtrer les projets selon le terme de recherche
    const filtered = projects.filter(project => {
      const client = clientsState.clients.find(c => c.id === project.client_id);
      const clientName = client ? `${client.nom} ${client.prenom}`.toLowerCase() : '';
      const projectName = project.name.toLowerCase();
      const devisNumber = project.devis_number?.toLowerCase() || '';
      const searchTermLower = searchTerm.toLowerCase();
      
      return projectName.includes(searchTermLower) || 
             clientName.includes(searchTermLower) || 
             devisNumber.includes(searchTermLower);
    });
    
    // Trier les projets selon le champ et la direction choisis
    return filtered.sort((a, b) => {
      const clientA = clientsState.clients.find(c => c.id === a.client_id);
      const clientB = clientsState.clients.find(c => c.id === b.client_id);
      const clientNameA = clientA ? `${clientA.nom} ${clientA.prenom}` : '';
      const clientNameB = clientB ? `${clientB.nom} ${clientB.prenom}` : '';
      
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'client':
          comparison = clientNameA.localeCompare(clientNameB);
          break;
        case 'updated_at':
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
        case 'devis_number':
          const devisA = a.devis_number || '';
          const devisB = b.devis_number || '';
          comparison = devisA.localeCompare(devisB);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [projects, searchTerm, sortField, sortDirection, clientsState.clients]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={16} />;
    return sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Ouvrir un projet</DialogTitle>
          <DialogDescription>
            Sélectionnez un projet existant à ouvrir
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, client ou numéro de devis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="border rounded-md">
            <div className="grid grid-cols-12 gap-3 p-3 border-b bg-muted/50 text-sm font-medium">
              <div 
                className="col-span-5 flex items-center gap-1 cursor-pointer"
                onClick={() => toggleSortDirection('name')}
              >
                <FileText size={16} />
                <span>Nom du projet</span>
                {renderSortIcon('name')}
              </div>
              <div 
                className="col-span-2 flex items-center gap-1 cursor-pointer"
                onClick={() => toggleSortDirection('devis_number')}
              >
                <span>N° Devis</span>
                {renderSortIcon('devis_number')}
              </div>
              <div 
                className="col-span-3 flex items-center gap-1 cursor-pointer"
                onClick={() => toggleSortDirection('client')}
              >
                <User size={16} />
                <span>Client</span>
                {renderSortIcon('client')}
              </div>
              <div 
                className="col-span-2 flex items-center gap-1 cursor-pointer"
                onClick={() => toggleSortDirection('updated_at')}
              >
                <Calendar size={16} />
                <span>Date</span>
                {renderSortIcon('updated_at')}
              </div>
            </div>
            
            <ScrollArea className="h-[400px]">
              {filteredAndSortedProjects.length === 0 ? (
                <div className="flex items-center justify-center h-20 text-gray-500">
                  Aucun projet disponible
                </div>
              ) : (
                <div>
                  {filteredAndSortedProjects.map((project) => {
                    const client = clientsState.clients.find(c => c.id === project.client_id);
                    return (
                      <div 
                        key={project.id}
                        className="grid grid-cols-12 gap-3 p-3 border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleLoadProject(project.id)}
                      >
                        <div className="col-span-5 truncate font-medium">
                          {project.name}
                        </div>
                        <div className="col-span-2 text-blue-600 font-medium truncate">
                          {project.devis_number || '-'}
                        </div>
                        <div className="col-span-3 text-gray-500 truncate">
                          {client ? `${client.nom} ${client.prenom}` : 'Client inconnu'}
                        </div>
                        <div className="col-span-2 text-gray-500">
                          {format(new Date(project.updated_at || project.created_at), 'dd/MM/yyyy', { locale: fr })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
