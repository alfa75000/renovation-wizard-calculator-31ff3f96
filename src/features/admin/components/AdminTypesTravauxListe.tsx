
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash, Edit } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { fetchWorkTypes, createWorkType, updateWorkType, deleteWorkType } from '@/services/travauxService';
import { WorkType } from '@/types/supabase';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TypeTravauxForm from './TypeTravauxForm';

const AdminTypesTravauxListe: React.FC = () => {
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [typeToEdit, setTypeToEdit] = useState<WorkType | null>(null);

  // Charger les types de travaux depuis Supabase
  const loadWorkTypes = async () => {
    setIsLoading(true);
    try {
      const types = await fetchWorkTypes();
      console.log("Types de travaux chargés:", types);
      setWorkTypes(types);
    } catch (error) {
      console.error("Erreur lors du chargement des types de travaux:", error);
      toast.error("Impossible de charger les types de travaux");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkTypes();
  }, []);

  const handleAddType = () => {
    setTypeToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditType = (type: WorkType) => {
    setTypeToEdit(type);
    setIsFormOpen(true);
  };

  const handleDeleteType = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce type de travaux ?")) {
      try {
        const success = await deleteWorkType(id);
        if (success) {
          setWorkTypes(workTypes.filter(type => type.id !== id));
          toast.success("Type de travaux supprimé avec succès");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du type de travaux:", error);
        toast.error("Erreur lors de la suppression du type de travaux");
      }
    }
  };

  const handleFormSubmit = async (formData: { name: string }) => {
    try {
      if (typeToEdit) {
        // Mise à jour d'un type existant
        const updatedType = await updateWorkType(typeToEdit.id, { name: formData.name });
        if (updatedType) {
          setWorkTypes(workTypes.map(type => 
            type.id === updatedType.id ? updatedType : type
          ));
          toast.success("Type de travaux mis à jour avec succès");
        }
      } else {
        // Création d'un nouveau type
        const newType = await createWorkType({ name: formData.name });
        if (newType) {
          setWorkTypes([...workTypes, newType]);
          toast.success("Type de travaux ajouté avec succès");
        }
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du type de travaux:", error);
      toast.error("Erreur lors de l'enregistrement du type de travaux");
    }
  };

  return (
    <Card>
      <CardHeader className="bg-slate-50">
        <CardTitle className="text-xl font-semibold flex items-center">
          Types de Travaux
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Gérez les types de travaux disponibles dans l'application
          </p>
          <Button onClick={handleAddType} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un type
          </Button>
        </div>

        <Separator className="my-4" />

        {isLoading ? (
          <p className="text-center py-4">Chargement des types de travaux...</p>
        ) : workTypes.length === 0 ? (
          <p className="text-center py-4">Aucun type de travaux disponible</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.name}</TableCell>
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
      </CardContent>
      
      {isFormOpen && (
        <TypeTravauxForm 
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          typeToEdit={typeToEdit}
          onSubmit={handleFormSubmit}
        />
      )}
    </Card>
  );
};

export default AdminTypesTravauxListe;
