
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash, Edit, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { MenuiserieType } from '@/types/supabase';
import { fetchMenuiserieTypes, createMenuiserieType, updateMenuiserieType, deleteMenuiserieType } from '@/services/menuiseriesService';
import TypeMenuiserieForm from '@/features/admin/components/TypeMenuiserieForm';
import { SurfaceImpactee } from '@/types/supabase';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminMenuiserieTypes: React.FC = () => {
  const [menuiserieTypes, setMenuiserieTypes] = useState<MenuiserieType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [typeToEdit, setTypeToEdit] = useState<MenuiserieType | null>(null);

  // Charger les types de menuiseries depuis Supabase
  const loadMenuiserieTypes = async () => {
    setIsLoading(true);
    try {
      const types = await fetchMenuiserieTypes();
      console.log("Types de menuiseries chargés:", types);
      setMenuiserieTypes(types);
    } catch (error) {
      console.error("Erreur lors du chargement des types de menuiseries:", error);
      toast.error("Impossible de charger les types de menuiseries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenuiserieTypes();
  }, []);

  const handleAddType = () => {
    setTypeToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditType = (type: MenuiserieType) => {
    setTypeToEdit(type);
    setIsFormOpen(true);
  };

  const handleDeleteType = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce type de menuiserie ?")) {
      try {
        const success = await deleteMenuiserieType(id);
        if (success) {
          setMenuiserieTypes(menuiserieTypes.filter(type => type.id !== id));
          toast.success("Type de menuiserie supprimé avec succès");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du type de menuiserie:", error);
        toast.error("Erreur lors de la suppression du type de menuiserie");
      }
    }
  };

  // Conversion du type TypeMenuiserie vers MenuiserieType pour la compatibilité avec Supabase
  const convertToMenuiserieType = (formType: any): Omit<MenuiserieType, 'id' | 'created_at'> => {
    return {
      name: formType.nom,
      largeur: formType.largeur,
      hauteur: formType.hauteur,
      surface_impactee: mapSurfaceReference(formType.surfaceReference) as SurfaceImpactee,
      impacte_plinthe: formType.impactePlinthe
    };
  };

  // Conversion du type MenuiserieType vers TypeMenuiserie pour l'édition
  const convertToFormType = (menuiserieType: MenuiserieType): any => {
    return {
      id: menuiserieType.id,
      nom: menuiserieType.name,
      hauteur: menuiserieType.hauteur,
      largeur: menuiserieType.largeur,
      surfaceReference: mapSurfaceImpactee(menuiserieType.surface_impactee),
      impactePlinthe: menuiserieType.impacte_plinthe,
      description: ""
    };
  };

  // Mappings entre les deux systèmes de surface
  const mapSurfaceReference = (surfaceRef: string): SurfaceImpactee => {
    switch (surfaceRef) {
      case 'SurfaceNetteMurs': return 'Mur';
      case 'SurfaceNettePlafond': return 'Plafond';
      case 'SurfaceNetteSol': return 'Sol';
      default: return 'Aucune';
    }
  };

  const mapSurfaceImpactee = (surface: SurfaceImpactee): string => {
    switch (surface) {
      case 'Mur': return 'SurfaceNetteMurs';
      case 'Plafond': return 'SurfaceNettePlafond';
      case 'Sol': return 'SurfaceNetteSol';
      default: return 'Aucune';
    }
  };

  const handleFormSubmit = async (formType: any) => {
    try {
      const menuiserieTypeData = convertToMenuiserieType(formType);
      
      if (typeToEdit) {
        // Mise à jour d'un type existant
        const updatedType = await updateMenuiserieType(typeToEdit.id, menuiserieTypeData);
        if (updatedType) {
          setMenuiserieTypes(menuiserieTypes.map(type => 
            type.id === updatedType.id ? updatedType : type
          ));
          toast.success("Type de menuiserie mis à jour avec succès");
        }
      } else {
        // Création d'un nouveau type
        const newType = await createMenuiserieType(menuiserieTypeData);
        if (newType) {
          setMenuiserieTypes([...menuiserieTypes, newType]);
          toast.success("Type de menuiserie ajouté avec succès");
        }
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du type de menuiserie:", error);
      toast.error("Erreur lors de l'enregistrement du type de menuiserie");
    }
  };

  return (
    <Card>
      <CardHeader className="bg-slate-50">
        <CardTitle className="text-xl font-semibold flex items-center">
          Types de Menuiseries
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Gérez les types de menuiseries disponibles dans l'application
          </p>
          <Button onClick={handleAddType} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un type
          </Button>
        </div>

        <Separator className="my-4" />

        {isLoading ? (
          <p className="text-center py-4">Chargement des types de menuiseries...</p>
        ) : menuiserieTypes.length === 0 ? (
          <p className="text-center py-4">Aucun type de menuiserie disponible</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Dimensions (cm)</TableHead>
                <TableHead>Surface impactée</TableHead>
                <TableHead>Affecte plinthes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuiserieTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>{type.largeur} x {type.hauteur}</TableCell>
                  <TableCell>{type.surface_impactee}</TableCell>
                  <TableCell>{type.impacte_plinthe ? 'Oui' : 'Non'}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditType(type)}
                      className="mr-1"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteType(type.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <TypeMenuiserieForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          typeToEdit={typeToEdit ? convertToFormType(typeToEdit) : null}
          onSubmit={handleFormSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default AdminMenuiserieTypes;
