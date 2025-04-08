
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { MenuiserieType } from '@/types/supabase';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { fetchMenuiserieTypes, deleteMenuiserieType } from '@/services/menuiseriesService';
import MenuiserieTypeForm from './MenuiserieTypeForm';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const MenuiseriesTypesList: React.FC = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMenuiserie, setSelectedMenuiserie] = useState<MenuiserieType | null>(null);
  const [menuiserieToDelete, setMenuiserieToDelete] = useState<MenuiserieType | null>(null);

  // Utiliser react-query pour gérer les données et l'état de chargement
  const { data: menuiseriesTypes = [], isLoading, error } = useQuery({
    queryKey: ['menuiseriesTypes'],
    queryFn: fetchMenuiserieTypes
  });

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des types de menuiseries");
      console.error(error);
    }
  }, [error]);

  const handleEdit = (menuiserie: MenuiserieType) => {
    setSelectedMenuiserie(menuiserie);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedMenuiserie(null);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedMenuiserie(null);
  };

  const confirmDelete = async () => {
    if (!menuiserieToDelete) return;
    
    try {
      await deleteMenuiserieType(menuiserieToDelete.id);
      await queryClient.invalidateQueries({ queryKey: ['menuiseriesTypes'] });
      toast.success(`Le type de menuiserie ${menuiserieToDelete.name} a été supprimé`);
      setMenuiserieToDelete(null);
    } catch (error) {
      toast.error("Erreur lors de la suppression du type de menuiserie");
      console.error(error);
    }
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    setSelectedMenuiserie(null);
    queryClient.invalidateQueries({ queryKey: ['menuiseriesTypes'] });
  };

  if (isLoading) {
    return <div className="py-4 text-center">Chargement des types de menuiseries...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Types de menuiseries</h2>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un type
        </Button>
      </div>

      {menuiseriesTypes.length === 0 ? (
        <div className="py-4 text-center text-muted-foreground">
          Aucun type de menuiserie n'est défini. Ajoutez-en un pour commencer.
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Dimensions</TableHead>
                <TableHead>Surface référence</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuiseriesTypes.map((menuiserie) => (
                <TableRow key={menuiserie.id}>
                  <TableCell className="font-medium">{menuiserie.name}</TableCell>
                  <TableCell>{menuiserie.largeur} x {menuiserie.hauteur} cm</TableCell>
                  <TableCell>{menuiserie.surface_impactee || 'Mur'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(menuiserie)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => setMenuiserieToDelete(menuiserie)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Formulaire d'ajout/modification */}
      {isFormOpen && (
        <MenuiserieTypeForm 
          menuiserie={selectedMenuiserie}
          onCancel={handleCancel}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Boîte de dialogue de confirmation de suppression */}
      <AlertDialog open={!!menuiserieToDelete} onOpenChange={(open) => !open && setMenuiserieToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le type de menuiserie &quot;{menuiserieToDelete?.name}&quot; ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MenuiseriesTypesList;
