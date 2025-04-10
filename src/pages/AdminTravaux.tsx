import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus, PlusCircle, Edit, Trash, Undo, Clipboard, Archive } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import TypeTravauxForm from "@/features/admin/components/TypeTravauxForm";
import SousTypeTravauxForm from "@/features/admin/components/SousTypeTravauxForm";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TravauxType, SousTypeTravauxItem, useTravauxTypes } from "@/contexts/TravauxTypesContext";

const AdminTravaux: React.FC = () => {
  // Récupération des types de travaux
  const { state, dispatch } = useTravauxTypes();
  const { types } = state;

  // États pour les modales
  const [typeFormOpen, setTypeFormOpen] = useState<boolean>(false);
  const [sousTypeFormOpen, setSousTypeFormOpen] = useState<boolean>(false);
  const [editingType, setEditingType] = useState<TravauxType | null>(null);
  const [editingSousType, setEditingSousType] = useState<SousTypeTravauxItem | null>(null);
  const [parentTypeId, setParentTypeId] = useState<string | null>(null);

  // États pour la confirmation de suppression
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [deletingSousTypeConfirmOpen, setDeletingSousTypeConfirmOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Handlers pour les types de travaux
  const handleAddType = () => {
    setEditingType(null);
    setTypeFormOpen(true);
  };

  const handleEditType = (type: TravauxType) => {
    setEditingType(type);
    setTypeFormOpen(true);
  };

  const handleDeleteType = (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteType = () => {
    if (itemToDelete) {
      dispatch({ type: 'DELETE_TYPE', payload: itemToDelete });
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      toast({
        title: "Type supprimé",
        description: "Le type de travaux a été supprimé avec succès."
      });
    }
  };

  const handleTypeSubmit = (typeData: TravauxType) => {
    if (editingType) {
      dispatch({
        type: 'UPDATE_TYPE',
        payload: { id: editingType.id, type: typeData }
      });
      toast({
        title: "Type mis à jour",
        description: "Le type de travaux a été mis à jour avec succès."
      });
    } else {
      dispatch({ type: 'ADD_TYPE', payload: typeData });
      toast({
        title: "Type ajouté",
        description: "Le nouveau type de travaux a été ajouté avec succès."
      });
    }
    setTypeFormOpen(false);
    setEditingType(null);
  };

  // Handlers pour les sous-types
  const handleAddSousType = (typeId: string) => {
    setParentTypeId(typeId);
    setEditingSousType(null);
    setSousTypeFormOpen(true);
  };

  const handleEditSousType = (typeId: string, sousType: SousTypeTravauxItem) => {
    setParentTypeId(typeId);
    setEditingSousType(sousType);
    setSousTypeFormOpen(true);
  };

  const handleDeleteSousType = (typeId: string, sousTypeId: string) => {
    setParentTypeId(typeId);
    setItemToDelete(sousTypeId);
    setDeletingSousTypeConfirmOpen(true);
  };

  const confirmDeleteSousType = () => {
    if (parentTypeId && itemToDelete) {
      dispatch({
        type: 'DELETE_SOUS_TYPE',
        payload: { typeId: parentTypeId, id: itemToDelete }
      });
      setDeletingSousTypeConfirmOpen(false);
      setItemToDelete(null);
      setParentTypeId(null);
      toast({
        title: "Prestation supprimée",
        description: "La prestation a été supprimée avec succès."
      });
    }
  };

  const handleSousTypeSubmit = (sousTypeData: SousTypeTravauxItem) => {
    if (parentTypeId) {
      if (editingSousType) {
        dispatch({
          type: 'UPDATE_SOUS_TYPE',
          payload: {
            typeId: parentTypeId,
            id: editingSousType.id,
            sousType: sousTypeData
          }
        });
        toast({
          title: "Prestation mise à jour",
          description: "La prestation a été mise à jour avec succès."
        });
      } else {
        dispatch({
          type: 'ADD_SOUS_TYPE',
          payload: {
            typeId: parentTypeId,
            sousType: {
              ...sousTypeData,
              typeTravauxId: parentTypeId
            }
          }
        });
        toast({
          title: "Prestation ajoutée",
          description: "La nouvelle prestation a été ajoutée avec succès."
        });
      }
      setSousTypeFormOpen(false);
      setEditingSousType(null);
      setParentTypeId(null);
    }
  };

  return (
    <Layout
      title="Gestion des travaux"
      subtitle="Gérez les types de travaux et les prestations associées"
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Types de travaux et prestations</h2>
          <p className="text-muted-foreground">
            Ajoutez, modifiez ou supprimez des types de travaux et leurs prestations
          </p>
        </div>
        <Button onClick={handleAddType} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un type
        </Button>
      </div>

      {types.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Archive className="h-12 w-12 mb-4 text-gray-400" />
            <h3 className="text-xl font-medium mb-2">Aucun type de travaux</h3>
            <p className="text-muted-foreground text-center mb-6">
              Vous n'avez pas encore défini de types de travaux.
              Commencez par en ajouter un.
            </p>
            <Button onClick={handleAddType} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un type de travaux
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {types.map((type) => (
            <Card key={type.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{type.label}</CardTitle>
                    {type.description && (
                      <CardDescription>{type.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditType(type)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteType(type.id)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {type.sousTypes.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Prix unitaire</TableHead>
                        <TableHead>Unité</TableHead>
                        <TableHead>TVA</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {type.sousTypes.map((sousType) => (
                        <TableRow key={sousType.id}>
                          <TableCell className="font-medium">{sousType.label}</TableCell>
                          <TableCell>{sousType.prixUnitaire} €</TableCell>
                          <TableCell>{sousType.unite}</TableCell>
                          <TableCell>{sousType.tauxTVA}%</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditSousType(type.id, sousType)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Modifier</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteSousType(type.id, sousType.id)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Supprimer</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    Aucune prestation n'est définie pour ce type de travaux.
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-gray-50 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddSousType(type.id)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Ajouter une prestation
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <TypeTravauxForm
        isOpen={typeFormOpen}
        onClose={() => setTypeFormOpen(false)}
        typeToEdit={editingType}
        onSubmit={handleTypeSubmit}
      />

      <SousTypeTravauxForm
        isOpen={sousTypeFormOpen}
        onClose={() => setSousTypeFormOpen(false)}
        sousTypeToEdit={editingSousType}
        onSubmit={handleSousTypeSubmit}
      />

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce type de travaux ? 
              Cette action supprimera également toutes les prestations associées.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDeleteType}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deletingSousTypeConfirmOpen} onOpenChange={setDeletingSousTypeConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette prestation ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingSousTypeConfirmOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDeleteSousType}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminTravaux;
