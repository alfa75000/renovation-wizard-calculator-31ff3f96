
import React, { useState } from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Settings,
  Edit,
  Trash,
  Plus,
  Paintbrush,
  Hammer,
  Wrench,
  SquarePen,
  Link as LinkIcon,
  DoorOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { TypeTravauxItem, SousTypeTravauxItem, surfacesReference, useTravauxTypes } from "@/contexts/TravauxTypesContext";
import { useMenuiseriesTypes, surfacesReference as surfacesMenuiseries } from "@/contexts/MenuiseriesTypesContext";
import TypeTravauxForm from "@/features/admin/components/TypeTravauxForm";
import SousTypeTravauxForm from "@/features/admin/components/SousTypeTravauxForm";
import TypeMenuiserieForm from "@/features/admin/components/TypeMenuiserieForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypeMenuiserie } from "@/types";

const Parametres = () => {
  // Contexte des travaux et des menuiseries
  const { state: stateTravauxTypes, dispatch: dispatchTravauxTypes } = useTravauxTypes();
  const { types } = stateTravauxTypes;
  
  const { state: stateMenuiseriesTypes, dispatch: dispatchMenuiseriesTypes } = useMenuiseriesTypes();
  const { typesMenuiseries } = stateMenuiseriesTypes;

  // Onglet actif
  const [activeTab, setActiveTab] = useState("travaux");

  // États pour les travaux
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [typeFormOpen, setTypeFormOpen] = useState(false);
  const [sousTypeFormOpen, setSousTypeFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<TypeTravauxItem | null>(null);
  const [editingSousType, setEditingSousType] = useState<SousTypeTravauxItem | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmDeleteSousTypeOpen, setConfirmDeleteSousTypeOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null);
  const [sousTypeToDelete, setSousTypeToDelete] = useState<string | null>(null);

  // États pour les menuiseries
  const [typeMenuiserieFormOpen, setTypeMenuiserieFormOpen] = useState(false);
  const [editingTypeMenuiserie, setEditingTypeMenuiserie] = useState<TypeMenuiserie | null>(null);
  const [confirmDeleteMenuiserieOpen, setConfirmDeleteMenuiserieOpen] = useState(false);
  const [typeMenuiserieToDelete, setTypeMenuiserieToDelete] = useState<string | null>(null);

  const selectedType = types.find(type => type.id === selectedTypeId);

  // Gestion des types de travaux
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Paintbrush":
        return <Paintbrush className="h-5 w-5" />;
      case "Hammer":
        return <Hammer className="h-5 w-5" />;
      case "Wrench":
        return <Wrench className="h-5 w-5" />;
      case "SquarePen":
        return <SquarePen className="h-5 w-5" />;
      default:
        return <Wrench className="h-5 w-5" />;
    }
  };

  const handleAddType = () => {
    setEditingType(null);
    setTypeFormOpen(true);
  };

  const handleEditType = (type: TypeTravauxItem) => {
    setEditingType(type);
    setTypeFormOpen(true);
  };

  const handleDeleteType = (id: string) => {
    setTypeToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const confirmTypeDelete = () => {
    if (typeToDelete) {
      dispatchTravauxTypes({ type: 'DELETE_TYPE', payload: typeToDelete });
      setConfirmDeleteOpen(false);
      setTypeToDelete(null);
      if (selectedTypeId === typeToDelete) {
        setSelectedTypeId(null);
      }
      toast({
        title: "Type de travaux supprimé",
        description: "Le type de travaux a été supprimé avec succès.",
      });
    }
  };

  const handleSubmitType = (typeData: TypeTravauxItem) => {
    if (editingType) {
      // Mise à jour d'un type existant
      dispatchTravauxTypes({
        type: 'UPDATE_TYPE',
        payload: { id: editingType.id, type: typeData }
      });
      toast({
        title: "Type de travaux mis à jour",
        description: "Le type de travaux a été mis à jour avec succès.",
      });
    } else {
      // Ajout d'un nouveau type
      dispatchTravauxTypes({ type: 'ADD_TYPE', payload: typeData });
      toast({
        title: "Type de travaux ajouté",
        description: "Le nouveau type de travaux a été ajouté avec succès.",
      });
    }
    setTypeFormOpen(false);
    setEditingType(null);
  };

  const handleAddSousType = () => {
    if (selectedTypeId) {
      setEditingSousType(null);
      setSousTypeFormOpen(true);
    }
  };

  const handleEditSousType = (sousType: SousTypeTravauxItem) => {
    setEditingSousType(sousType);
    setSousTypeFormOpen(true);
  };

  const handleDeleteSousType = (id: string) => {
    setSousTypeToDelete(id);
    setConfirmDeleteSousTypeOpen(true);
  };

  const confirmSousTypeDelete = () => {
    if (selectedTypeId && sousTypeToDelete) {
      dispatchTravauxTypes({
        type: 'DELETE_SOUS_TYPE',
        payload: { typeId: selectedTypeId, id: sousTypeToDelete }
      });
      setConfirmDeleteSousTypeOpen(false);
      setSousTypeToDelete(null);
      toast({
        title: "Prestation supprimée",
        description: "La prestation a été supprimée avec succès.",
      });
    }
  };

  const handleSubmitSousType = (sousTypeData: SousTypeTravauxItem) => {
    if (selectedTypeId) {
      if (editingSousType) {
        // Mise à jour d'un sous-type existant
        dispatchTravauxTypes({
          type: 'UPDATE_SOUS_TYPE',
          payload: {
            typeId: selectedTypeId,
            id: editingSousType.id,
            sousType: sousTypeData
          }
        });
        toast({
          title: "Prestation mise à jour",
          description: "La prestation a été mise à jour avec succès.",
        });
      } else {
        // Ajout d'un nouveau sous-type
        dispatchTravauxTypes({
          type: 'ADD_SOUS_TYPE',
          payload: { typeId: selectedTypeId, sousType: sousTypeData }
        });
        toast({
          title: "Prestation ajoutée",
          description: "La nouvelle prestation a été ajoutée avec succès.",
        });
      }
      setSousTypeFormOpen(false);
      setEditingSousType(null);
    }
  };

  const getSurfaceReferenceLabel = (id?: string) => {
    if (!id) return "Non spécifié";
    const surface = surfacesReference.find(surface => surface.id === id);
    return surface ? surface.label : id;
  };

  const resetToDefaults = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser tous les types de travaux aux valeurs par défaut ?")) {
      dispatchTravauxTypes({ type: 'RESET_TYPES' });
      toast({
        title: "Réinitialisation effectuée",
        description: "Tous les types de travaux ont été réinitialisés aux valeurs par défaut.",
      });
    }
  };

  // Gestion des types de menuiseries
  const handleAddTypeMenuiserie = () => {
    setEditingTypeMenuiserie(null);
    setTypeMenuiserieFormOpen(true);
  };

  const handleEditTypeMenuiserie = (type: TypeMenuiserie) => {
    setEditingTypeMenuiserie(type);
    setTypeMenuiserieFormOpen(true);
  };

  const handleDeleteTypeMenuiserie = (id: string) => {
    setTypeMenuiserieToDelete(id);
    setConfirmDeleteMenuiserieOpen(true);
  };

  const confirmTypeMenuiserieDelete = () => {
    if (typeMenuiserieToDelete) {
      dispatchMenuiseriesTypes({ type: 'DELETE_TYPE', payload: typeMenuiserieToDelete });
      setConfirmDeleteMenuiserieOpen(false);
      setTypeMenuiserieToDelete(null);
      toast({
        title: "Type de menuiserie supprimé",
        description: "Le type de menuiserie a été supprimé avec succès.",
      });
    }
  };

  const handleSubmitTypeMenuiserie = (typeData: TypeMenuiserie) => {
    if (editingTypeMenuiserie) {
      // Mise à jour d'un type existant
      dispatchMenuiseriesTypes({
        type: 'UPDATE_TYPE',
        payload: { id: editingTypeMenuiserie.id, type: typeData }
      });
      toast({
        title: "Type de menuiserie mis à jour",
        description: "Le type de menuiserie a été mis à jour avec succès.",
      });
    } else {
      // Ajout d'un nouveau type
      dispatchMenuiseriesTypes({ type: 'ADD_TYPE', payload: typeData });
      toast({
        title: "Type de menuiserie ajouté",
        description: "Le nouveau type de menuiserie a été ajouté avec succès.",
      });
    }
    setTypeMenuiserieFormOpen(false);
    setEditingTypeMenuiserie(null);
  };

  const getSurfaceMenuiserieLabel = (id?: string) => {
    if (!id) return "Non spécifié";
    const surface = surfacesMenuiseries.find(surface => surface.id === id);
    return surface ? surface.label : id;
  };

  const resetMenuiseriesToDefaults = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser tous les types de menuiseries aux valeurs par défaut ?")) {
      dispatchMenuiseriesTypes({ type: 'RESET_TYPES' });
      toast({
        title: "Réinitialisation effectuée",
        description: "Tous les types de menuiseries ont été réinitialisés aux valeurs par défaut.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-8 bg-blue-600 text-white p-6 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Paramètres
          </h1>
          <p className="mt-2 text-lg text-center">
            Gérez les types de travaux, de menuiseries et leurs paramètres
          </p>
        </div>

        <div className="mb-8 flex justify-center space-x-4">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/">
              Page de saisie
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/travaux">
              Page d'ajout des travaux
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/recapitulatif">
              Page Récapitulatif
            </Link>
          </Button>
          
          <Button asChild variant="default" className="flex items-center gap-2">
            <Link to="/parametres">
              Page Paramètres
            </Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="w-full">
            <TabsTrigger value="travaux" className="flex-1">Types de Travaux</TabsTrigger>
            <TabsTrigger value="menuiseries" className="flex-1">Types de Menuiseries</TabsTrigger>
          </TabsList>
          
          <TabsContent value="travaux" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button 
                variant="reset" 
                onClick={resetToDefaults}
                className="flex items-center gap-2"
              >
                Réinitialiser aux valeurs par défaut
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="shadow-md lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Types de travaux</span>
                    <Button variant="outline" size="sm" onClick={handleAddType}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Sélectionnez un type pour voir et gérer ses prestations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {types.map((type) => (
                      <div 
                        key={type.id}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${selectedTypeId === type.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                        onClick={() => setSelectedTypeId(type.id)}
                      >
                        <div className="flex items-center gap-2">
                          {getIconComponent(type.icon)}
                          <span>{type.label}</span>
                          <Badge variant="outline" className="ml-2">
                            {type.sousTypes.length}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
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
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteType(type.id);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {types.length === 0 && (
                      <Alert>
                        <AlertDescription>
                          Aucun type de travaux défini. Utilisez le bouton "Ajouter" pour créer un nouveau type.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      {selectedType 
                        ? `Prestations pour "${selectedType.label}"` 
                        : "Prestations"
                      }
                    </span>
                    {selectedTypeId && (
                      <Button variant="outline" size="sm" onClick={handleAddSousType}>
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter une prestation
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {selectedType 
                      ? `Gérez les prestations disponibles pour le type "${selectedType.label}"`
                      : "Sélectionnez un type de travaux pour voir ses prestations"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedType ? (
                    <div className="space-y-4">
                      {selectedType.sousTypes.length > 0 ? (
                        <div className="rounded-md border">
                          <div className="grid grid-cols-12 bg-gray-100 p-3 rounded-t-md font-medium text-sm">
                            <div className="col-span-3">Nom</div>
                            <div className="col-span-2">Prix unitaire</div>
                            <div className="col-span-2">Fournitures</div>
                            <div className="col-span-2">Main d'œuvre</div>
                            <div className="col-span-1">Unité</div>
                            <div className="col-span-2 text-right">Actions</div>
                          </div>
                          <div className="divide-y">
                            {selectedType.sousTypes.map((sousType) => (
                              <div key={sousType.id} className="grid grid-cols-12 p-3 items-center hover:bg-gray-50">
                                <div className="col-span-3 font-medium">
                                  <div className="truncate">{sousType.label}</div>
                                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                    <LinkIcon className="h-3 w-3" />
                                    {getSurfaceReferenceLabel(sousType.surfaceReference)}
                                  </div>
                                </div>
                                <div className="col-span-2">{sousType.prixUnitaire} €</div>
                                <div className="col-span-2">{sousType.prixFournitures} €</div>
                                <div className="col-span-2">{sousType.prixMainOeuvre} €</div>
                                <div className="col-span-1">{sousType.unite}</div>
                                <div className="col-span-2 flex justify-end gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditSousType(sousType)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDeleteSousType(sousType.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Alert>
                          <AlertDescription>
                            Aucune prestation définie pour ce type de travaux. Utilisez le bouton "Ajouter une prestation" pour en créer une.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-8 text-gray-500">
                      <Settings className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>Veuillez sélectionner un type de travaux dans la liste à gauche pour voir ses prestations</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="menuiseries" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button 
                variant="reset" 
                onClick={resetMenuiseriesToDefaults}
                className="flex items-center gap-2"
              >
                Réinitialiser aux valeurs par défaut
              </Button>
            </div>
            
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <DoorOpen className="h-5 w-5" />
                    Types de Menuiseries
                  </span>
                  <Button variant="outline" size="sm" onClick={handleAddTypeMenuiserie}>
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter un type
                  </Button>
                </CardTitle>
                <CardDescription>
                  Gérez les types de menuiseries disponibles pour votre projet
                </CardDescription>
              </CardHeader>
              <CardContent>
                {typesMenuiseries.length > 0 ? (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 bg-gray-100 p-3 rounded-t-md font-medium text-sm">
                      <div className="col-span-3">Nom</div>
                      <div className="col-span-2">Dimensions</div>
                      <div className="col-span-3">Surface impactée</div>
                      <div className="col-span-2">Impact plinthes</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>
                    <div className="divide-y">
                      {typesMenuiseries.map((type) => (
                        <div key={type.id} className="grid grid-cols-12 p-3 items-center hover:bg-gray-50">
                          <div className="col-span-3 font-medium">
                            <div className="truncate">{type.nom}</div>
                            {type.description && (
                              <div className="text-xs text-gray-500 mt-1 truncate">
                                {type.description}
                              </div>
                            )}
                          </div>
                          <div className="col-span-2">
                            {type.largeur} × {type.hauteur} cm
                          </div>
                          <div className="col-span-3">
                            {getSurfaceMenuiserieLabel(type.surfaceReference)}
                          </div>
                          <div className="col-span-2">
                            <Badge variant={type.impactePlinthe ? "default" : "outline"}>
                              {type.impactePlinthe ? "Oui" : "Non"}
                            </Badge>
                          </div>
                          <div className="col-span-2 flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditTypeMenuiserie(type)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteTypeMenuiserie(type.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <AlertDescription>
                      Aucun type de menuiserie défini. Utilisez le bouton "Ajouter un type" pour en créer un.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Formulaire d'ajout/modification de type de travaux */}
      <TypeTravauxForm
        isOpen={typeFormOpen}
        onClose={() => setTypeFormOpen(false)}
        typeToEdit={editingType}
        onSubmit={handleSubmitType}
      />

      {/* Formulaire d'ajout/modification de sous-type */}
      <SousTypeTravauxForm
        isOpen={sousTypeFormOpen}
        onClose={() => setSousTypeFormOpen(false)}
        sousTypeToEdit={editingSousType}
        onSubmit={handleSubmitSousType}
      />

      {/* Formulaire d'ajout/modification de type de menuiserie */}
      <TypeMenuiserieForm
        isOpen={typeMenuiserieFormOpen}
        onClose={() => setTypeMenuiserieFormOpen(false)}
        typeToEdit={editingTypeMenuiserie}
        onSubmit={handleSubmitTypeMenuiserie}
      />

      {/* Dialog de confirmation de suppression de type de travaux */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce type de travaux ? Cette action supprimera également toutes les prestations associées et ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmTypeDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression de sous-type */}
      <Dialog open={confirmDeleteSousTypeOpen} onOpenChange={setConfirmDeleteSousTypeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette prestation ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteSousTypeOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmSousTypeDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression de type de menuiserie */}
      <Dialog open={confirmDeleteMenuiserieOpen} onOpenChange={setConfirmDeleteMenuiserieOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce type de menuiserie ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteMenuiserieOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmTypeMenuiserieDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Parametres;
