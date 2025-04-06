
import React from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  Home,
  Paintbrush,
  Hammer,
  Wrench,
  SquarePen,
  PlusCircle,
  Edit,
  Trash2,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useState } from "react";
import { formaterPrix } from "@/lib/utils";
import { TravauxTypesProvider, useTravauxTypes, TypeTravauxItem, SousTypeTravauxItem } from "@/contexts/TravauxTypesContext";
import TypeTravauxForm from "@/features/admin/components/TypeTravauxForm";
import SousTypeTravauxForm from "@/features/admin/components/SousTypeTravauxForm";

// Composant principal
const AdminTravauxPage: React.FC = () => {
  const { state, dispatch } = useTravauxTypes();
  const [selectedType, setSelectedType] = useState<TypeTravauxItem | null>(null);
  const [editingSousType, setEditingSousType] = useState<SousTypeTravauxItem | null>(null);
  const [isAddingType, setIsAddingType] = useState(false);
  const [isAddingSousType, setIsAddingSousType] = useState(false);
  const [isEditingType, setIsEditingType] = useState(false);
  const [isEditingSousType, setIsEditingSousType] = useState(false);

  // Fonction pour afficher l'icône correspondante
  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'Paintbrush': return <Paintbrush className="h-4 w-4" />;
      case 'Hammer': return <Hammer className="h-4 w-4" />;
      case 'Wrench': return <Wrench className="h-4 w-4" />;
      case 'SquarePen': return <SquarePen className="h-4 w-4" />;
      default: return <Wrench className="h-4 w-4" />;
    }
  };

  // Gestionnaires pour les types de travaux
  const handleAddType = (newType: TypeTravauxItem) => {
    dispatch({ type: 'ADD_TYPE', payload: newType });
    setIsAddingType(false);
  };

  const handleUpdateType = (id: string, updatedType: Partial<TypeTravauxItem>) => {
    dispatch({ type: 'UPDATE_TYPE', payload: { id, type: updatedType } });
    setIsEditingType(false);
    setSelectedType(null);
  };

  const handleDeleteType = (id: string) => {
    dispatch({ type: 'DELETE_TYPE', payload: id });
  };

  // Gestionnaires pour les sous-types
  const handleAddSousType = (typeId: string, newSousType: SousTypeTravauxItem) => {
    dispatch({ 
      type: 'ADD_SOUS_TYPE', 
      payload: { typeId, sousType: newSousType }
    });
    setIsAddingSousType(false);
  };

  const handleUpdateSousType = (typeId: string, id: string, updatedSousType: Partial<SousTypeTravauxItem>) => {
    dispatch({ 
      type: 'UPDATE_SOUS_TYPE', 
      payload: { typeId, id, sousType: updatedSousType }
    });
    setIsEditingSousType(false);
    setEditingSousType(null);
  };

  const handleDeleteSousType = (typeId: string, id: string) => {
    dispatch({ 
      type: 'DELETE_SOUS_TYPE', 
      payload: { typeId, id }
    });
  };

  const handleResetTypes = () => {
    dispatch({ type: 'RESET_TYPES' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-8 gradient-header text-white p-6 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold">
            Administration des travaux
          </h1>
          <p className="mt-2 text-lg">Gérez les catégories et sous-catégories de travaux</p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="reset" className="mt-4">
                <Wrench className="h-4 w-4 mr-2" />
                Réinitialiser les types par défaut
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Réinitialiser les types de travaux ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action va réinitialiser tous les types de travaux à leur valeur par défaut.
                  Toutes vos modifications seront perdues. Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetTypes} className="bg-orange-500 hover:bg-orange-600">
                  Réinitialiser
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="mb-4 flex justify-between">
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link to="/recapitulatif">
              <ArrowLeft className="h-4 w-4" />
              Retour au récapitulatif
            </Link>
          </Button>

          <Button 
            onClick={() => {
              setIsAddingType(true);
              setSelectedType(null);
            }} 
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Ajouter un type de travaux
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des types de travaux */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Types de travaux</CardTitle>
              <CardDescription>
                Sélectionnez un type pour voir ses sous-catégories
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.types.map((type) => (
                      <TableRow 
                        key={type.id}
                        className={selectedType?.id === type.id ? "bg-muted" : ""}
                        onClick={() => setSelectedType(type)}
                      >
                        <TableCell className="flex items-center gap-2">
                          {renderIcon(type.icon)}
                          <span>{type.label}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedType(type);
                                setIsEditingType(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer ce type de travaux ?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action va supprimer le type "{type.label}" et tous ses sous-types.
                                    Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteType(type.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Détails et sous-types */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {selectedType ? (
                    <div className="flex items-center gap-2">
                      {renderIcon(selectedType.icon)}
                      <span>{selectedType.label}</span>
                    </div>
                  ) : 'Détails'}
                </CardTitle>
                {selectedType && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsAddingSousType(true);
                      setEditingSousType(null);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter une prestation
                  </Button>
                )}
              </div>
              <CardDescription>
                {selectedType 
                  ? `${selectedType.sousTypes.length} prestations disponibles` 
                  : 'Sélectionnez un type de travaux pour voir ses prestations'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedType ? (
                <div className="max-h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Prestation</TableHead>
                        <TableHead>Prix unitaire</TableHead>
                        <TableHead>Unité</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedType.sousTypes.map((sousType) => (
                        <TableRow key={sousType.id}>
                          <TableCell>{sousType.label}</TableCell>
                          <TableCell>{formaterPrix(sousType.prixUnitaire)}</TableCell>
                          <TableCell>{sousType.unite}</TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  setEditingSousType(sousType);
                                  setIsEditingSousType(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Supprimer cette prestation ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Cette action va supprimer la prestation "{sousType.label}".
                                      Cette action est irréversible.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteSousType(selectedType.id, sousType.id)}
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      Supprimer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                  <Wrench className="h-10 w-10 mb-2" />
                  <p>Sélectionnez un type de travaux pour voir ses prestations</p>
                  <p className="text-sm mt-2">ou</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setIsAddingType(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Ajouter un nouveau type
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Formulaire d'ajout/modification d'un type */}
        {(isAddingType || isEditingType) && (
          <TypeTravauxForm
            isOpen={isAddingType || isEditingType}
            onClose={() => {
              setIsAddingType(false);
              setIsEditingType(false);
              setSelectedType(null);
            }}
            typeToEdit={isEditingType ? selectedType : null}
            onSubmit={isEditingType && selectedType
              ? (data) => handleUpdateType(selectedType.id, data)
              : handleAddType
            }
          />
        )}

        {/* Formulaire d'ajout/modification d'un sous-type */}
        {(isAddingSousType || isEditingSousType) && selectedType && (
          <SousTypeTravauxForm
            isOpen={isAddingSousType || isEditingSousType}
            onClose={() => {
              setIsAddingSousType(false);
              setIsEditingSousType(false);
              setEditingSousType(null);
            }}
            sousTypeToEdit={isEditingSousType ? editingSousType : null}
            typeId={selectedType.id}
            onSubmit={isEditingSousType && editingSousType
              ? (data) => handleUpdateSousType(selectedType.id, editingSousType.id, data)
              : (data) => handleAddSousType(selectedType.id, data as SousTypeTravauxItem)
            }
          />
        )}
      </div>
    </div>
  );
};

// Composant avec Provider
const AdminTravaux: React.FC = () => (
  <TravauxTypesProvider>
    <AdminTravauxPage />
  </TravauxTypesProvider>
);

export default AdminTravaux;
