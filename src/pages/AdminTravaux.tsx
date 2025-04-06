
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTravauxTypes, TypeTravauxItem, SousTypeTravauxItem, surfacesReference } from "@/contexts/TravauxTypesContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Edit, Trash2, Settings } from "lucide-react";
import TypeTravauxForm from "@/features/admin/components/TypeTravauxForm";
import SousTypeTravauxForm from "@/features/admin/components/SousTypeTravauxForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Link } from "react-router-dom";
import { formaterPrix } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const AdminTravaux = () => {
  const { state, dispatch } = useTravauxTypes();
  const { toast } = useToast();
  
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [typeFormOpen, setTypeFormOpen] = useState(false);
  const [typeToEdit, setTypeToEdit] = useState<TypeTravauxItem | null>(null);
  
  const [sousTypeFormOpen, setSousTypeFormOpen] = useState(false);
  const [sousTypeToEdit, setSousTypeToEdit] = useState<SousTypeTravauxItem | null>(null);
  
  const selectedType = selectedTypeId 
    ? state.types.find(type => type.id === selectedTypeId) 
    : null;

  // Gestion des types de travaux
  const handleAddType = () => {
    setTypeToEdit(null);
    setTypeFormOpen(true);
  };

  const handleEditType = (type: TypeTravauxItem) => {
    setTypeToEdit(type);
    setTypeFormOpen(true);
  };

  const handleDeleteType = (typeId: string) => {
    dispatch({ type: 'DELETE_TYPE', payload: typeId });
    
    if (selectedTypeId === typeId) {
      setSelectedTypeId(null);
    }
    
    toast({
      title: "Type de travaux supprimé",
      description: "Le type de travaux a été supprimé avec succès",
      variant: "default",
    });
  };

  const handleTypeFormSubmit = (data: TypeTravauxItem) => {
    if (typeToEdit) {
      dispatch({ 
        type: 'UPDATE_TYPE', 
        payload: { id: typeToEdit.id, type: data } 
      });
      
      toast({
        title: "Type de travaux modifié",
        description: `Le type de travaux "${data.label}" a été modifié avec succès`,
        variant: "default",
      });
    } else {
      dispatch({ type: 'ADD_TYPE', payload: data });
      
      toast({
        title: "Type de travaux ajouté",
        description: `Le type de travaux "${data.label}" a été ajouté avec succès`,
        variant: "default",
      });
      
      // Sélectionner automatiquement le nouveau type
      setSelectedTypeId(data.id);
    }
    setTypeFormOpen(false);
  };

  const handleCloseTypeForm = () => {
    setTypeFormOpen(false);
    setTypeToEdit(null);
  };

  // Gestion des sous-types
  const handleAddSousType = () => {
    setSousTypeToEdit(null);
    setSousTypeFormOpen(true);
  };

  const handleEditSousType = (sousType: SousTypeTravauxItem) => {
    setSousTypeToEdit(sousType);
    setSousTypeFormOpen(true);
  };

  const handleDeleteSousType = (sousTypeId: string) => {
    if (selectedTypeId) {
      dispatch({ 
        type: 'DELETE_SOUS_TYPE', 
        payload: { typeId: selectedTypeId, id: sousTypeId } 
      });
      
      toast({
        title: "Sous-type supprimé",
        description: "Le sous-type a été supprimé avec succès",
        variant: "default",
      });
    }
  };

  const handleSousTypeFormSubmit = (data: SousTypeTravauxItem) => {
    if (!selectedTypeId) return;
    
    if (sousTypeToEdit) {
      dispatch({ 
        type: 'UPDATE_SOUS_TYPE', 
        payload: { 
          typeId: selectedTypeId, 
          id: sousTypeToEdit.id, 
          sousType: data 
        } 
      });
      
      toast({
        title: "Sous-type modifié",
        description: `Le sous-type "${data.label}" a été modifié avec succès`,
        variant: "default",
      });
    } else {
      dispatch({ 
        type: 'ADD_SOUS_TYPE', 
        payload: { 
          typeId: selectedTypeId, 
          sousType: data 
        } 
      });
      
      toast({
        title: "Sous-type ajouté",
        description: `Le sous-type "${data.label}" a été ajouté avec succès`,
        variant: "default",
      });
    }
    setSousTypeFormOpen(false);
  };

  const handleCloseSousTypeForm = () => {
    setSousTypeFormOpen(false);
    setSousTypeToEdit(null);
  };

  const handleResetTypes = () => {
    dispatch({ type: 'RESET_TYPES' });
    setSelectedTypeId(null);
    
    toast({
      title: "Types de travaux réinitialisés",
      description: "Les types de travaux ont été réinitialisés aux valeurs par défaut",
      variant: "default",
    });
  };

  const getSurfaceReferenceLabel = (id: string) => {
    const surface = surfacesReference.find(s => s.id === id);
    return surface ? surface.label : id;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-8 bg-blue-600 text-white p-6 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold">
            Administration des types de travaux
          </h1>
          <p className="mt-2 text-lg">Gérez les différentes catégories de travaux et leurs caractéristiques</p>
        </div>

        <div className="mb-4 flex justify-between">
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link to="/parametres">
              <ArrowLeft className="h-4 w-4" />
              Retour aux paramètres
            </Link>
          </Button>

          <Button variant="destructive" onClick={handleResetTypes} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Réinitialiser par défaut
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shadow-md lg:col-span-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Types de travaux</CardTitle>
                <Button onClick={handleAddType} size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Button>
              </div>
              <CardDescription>
                Catégories principales de travaux
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {state.types.map(type => (
                  <div 
                    key={type.id}
                    className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                      selectedTypeId === type.id ? 'bg-blue-100 border border-blue-300' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedTypeId(type.id)}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{type.label}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({type.sousTypes.length} sous-types)
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditType(type);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action ne peut pas être annulée. Cela supprimera définitivement le type de travaux
                              "{type.label}" et tous ses sous-types associés.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteType(type.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}

                {state.types.length === 0 && (
                  <Alert>
                    <AlertDescription>
                      Aucun type de travaux n'est défini. Cliquez sur "Ajouter" pour en créer un.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {selectedType ? `Sous-types de "${selectedType.label}"` : "Détails des sous-types"}
                </CardTitle>
                {selectedType && (
                  <Button 
                    onClick={handleAddSousType} 
                    size="sm" 
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter un sous-type
                  </Button>
                )}
              </div>
              <CardDescription>
                {selectedType 
                  ? "Différentes options pour ce type de travaux" 
                  : "Sélectionnez un type de travaux pour voir ses sous-types"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedType ? (
                <div className="space-y-4">
                  {selectedType.sousTypes.length === 0 ? (
                    <Alert>
                      <AlertDescription>
                        Aucun sous-type n'est défini pour "{selectedType.label}". 
                        Cliquez sur "Ajouter un sous-type" pour en créer un.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Nom</th>
                            <th className="text-left p-2">Prix Unitaire</th>
                            <th className="text-left p-2">Unité</th>
                            <th className="text-left p-2">Surface</th>
                            <th className="text-right p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedType.sousTypes.map(sousType => (
                            <tr key={sousType.id} className="border-b hover:bg-gray-50">
                              <td className="p-2">{sousType.label}</td>
                              <td className="p-2">{formaterPrix(sousType.prixUnitaire)}</td>
                              <td className="p-2">{sousType.unite}</td>
                              <td className="p-2">
                                {sousType.surfaceReference ? 
                                  getSurfaceReferenceLabel(sousType.surfaceReference) : 
                                  "N/A"}
                              </td>
                              <td className="p-2 text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditSousType(sousType)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                      >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Cette action ne peut pas être annulée. Cela supprimera définitivement le sous-type
                                          "{sousType.label}".
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => handleDeleteSousType(sousType.id)}
                                          className="bg-red-500 hover:bg-red-600"
                                        >
                                          Supprimer
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-center items-center h-32 text-gray-500">
                  Veuillez sélectionner un type de travaux dans la liste à gauche
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <TypeTravauxForm 
        isOpen={typeFormOpen}
        onClose={handleCloseTypeForm}
        typeToEdit={typeToEdit}
        onSubmit={handleTypeFormSubmit}
      />

      {selectedTypeId && (
        <SousTypeTravauxForm 
          isOpen={sousTypeFormOpen}
          onClose={handleCloseSousTypeForm}
          sousTypeToEdit={sousTypeToEdit}
          onSubmit={handleSousTypeFormSubmit}
        />
      )}
    </div>
  );
};

export default AdminTravaux;
