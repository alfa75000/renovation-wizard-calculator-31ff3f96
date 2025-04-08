
import React, { useState, useEffect } from 'react';
import { toast } from "react-hot-toast";
import { Plus, Edit, Trash, Loader2, Database } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import TypeTravauxForm from '@/features/travaux/components/TypeTravauxForm';
import SousTypeTravauxForm from '@/features/travaux/components/SousTypeTravauxForm';
import TypeMenuiserieForm from '@/features/admin/components/TypeMenuiserieForm';
import TypeAutreSurfaceForm from '@/features/admin/components/TypeAutreSurfaceForm';
import ClientForm from '@/features/admin/components/ClientForm';

import { useTravauxTypes } from '@/contexts/TravauxTypesContext';
import { useMenuiseriesTypes } from '@/contexts/MenuiseriesTypesContext';
import { useAutresSurfaces } from '@/contexts/AutresSurfacesContext';
import { useClients } from '@/contexts/ClientsContext';

import {
  createWorkType,
  updateWorkType,
  deleteWorkType,
  createServiceGroup,
  updateServiceGroup,
  deleteServiceGroup,
  createService,
  updateService,
  deleteService,
  fetchWorkTypes,
  fetchServiceGroups,
  fetchServices,
  createMenuiserieType as createTypeMenuiserie,
  updateMenuiserieType as updateTypeMenuiserie,
  deleteMenuiserieType as deleteTypeMenuiserie,
  fetchMenuiserieTypes,
  createAutreSurfaceType,
  updateAutreSurfaceType,
  deleteAutreSurfaceType,
  fetchAutresSurfacesTypes,
} from '@/services/supabase';
import { Client, TypeMenuiserie, TypeAutreSurface } from '@/types';
import { AutreSurfaceType } from '@/types/supabase';
import { typesClients } from '@/types';
import SupabaseStatus from '@/components/SupabaseStatus';

const Parametres = () => {
  const [activeTab, setActiveTab] = useState("travaux");
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  // Travaux Types States
  const [travauxFormOpen, setTravauxFormOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [isLoadingTravaux, setIsLoadingTravaux] = useState(false);

  // Sous-type Travaux States
  const [sousTypeFormOpen, setSousTypeFormOpen] = useState(false);
  const [editingSousType, setEditingSousType] = useState(null);
  const [selectedTypeId, setSelectedTypeId] = useState(null);

  // Menuiseries Types States
  const [typeMenuiserieFormOpen, setTypeMenuiserieFormOpen] = useState(false);
  const [editingTypeMenuiserie, setEditingTypeMenuiserie] = useState(null);
  const [isLoadingMenuiseries, setIsLoadingMenuiseries] = useState(false);

  // Autres Surfaces Types States
  const [typeAutreSurfaceFormOpen, setTypeAutreSurfaceFormOpen] = useState(false);
  const [editingTypeAutreSurface, setEditingTypeAutreSurface] = useState(null);
  const [isLoadingAutresSurfaces, setIsLoadingAutresSurfaces] = useState(false);

  // Clients States
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [confirmDeleteClientOpen, setConfirmDeleteClientOpen] = useState(false);

  const { state: travauxState, dispatch: dispatchTravaux } = useTravauxTypes();
  const { state: menuiseriesState, dispatch: dispatchMenuiseries } = useMenuiseriesTypes();
  const { state: autresSurfacesState, dispatch: dispatchAutresSurfaces } = useAutresSurfaces();
  const { state: clientsState, dispatch: dispatchClients } = useClients();

  const [autresSurfacesTypes, setAutresSurfacesTypes] = useState<AutreSurfaceType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingTravaux(true);
      setIsLoadingMenuiseries(true);
      setIsLoadingAutresSurfaces(true);

      try {
        const travaux = await fetchWorkTypes();
        dispatchTravaux({ type: 'LOAD_TYPES', payload: travaux });

        const menuiseries = await fetchMenuiserieTypes();
        dispatchMenuiseries({ type: 'LOAD_TYPES', payload: menuiseries });

        const types = await fetchAutresSurfacesTypes();
        const supabaseTypes: AutreSurfaceType[] = types.map(item => ({
          id: item.id,
          created_at: '',
          name: item.nom,
          description: item.description,
          surface_impactee: item.surfaceImpacteeParDefaut === 'mur' ? 'Mur' :
                          item.surfaceImpacteeParDefaut === 'plafond' ? 'Plafond' :
                          item.surfaceImpacteeParDefaut === 'sol' ? 'Sol' : 'Aucune',
          adjustment_type: item.estDeduction ? 'Déduire' : 'Ajouter',
          impacte_plinthe: item.impactePlinthe || false,
          largeur: item.largeur || 0,
          hauteur: item.hauteur || 0
        }));
        setAutresSurfacesTypes(supabaseTypes);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoadingTravaux(false);
        setIsLoadingMenuiseries(false);
        setIsLoadingAutresSurfaces(false);
      }
    };

    fetchData();
  }, [dispatchTravaux, dispatchMenuiseries, dispatchAutresSurfaces]);

  const handleAddType = () => {
    setEditingType(null);
    setTravauxFormOpen(true);
  };

  const handleEditType = (type) => {
    setEditingType(type);
    setTravauxFormOpen(true);
  };

  const handleDeleteType = async (id) => {
    setIsLoadingTravaux(true);
    try {
      await deleteWorkType(id);
      dispatchTravaux({ type: 'DELETE_TYPE', payload: id });
      toast.success("Type de travaux supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du type de travaux:", error);
      toast.error("Erreur lors de la suppression du type de travaux");
    } finally {
      setIsLoadingTravaux(false);
    }
  };

  const handleSubmitType = async (typeData) => {
    setIsLoadingTravaux(true);
    try {
      if (editingType) {
        await updateWorkType(editingType.id, typeData);
        dispatchTravaux({
          type: 'UPDATE_TYPE',
          payload: { id: editingType.id, type: typeData }
        });
        toast.success("Type de travaux mis à jour avec succès");
      } else {
        await createWorkType(typeData);
        dispatchTravaux({ type: 'ADD_TYPE', payload: typeData });
        toast.success("Type de travaux ajouté avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du type de travaux:", error);
      toast.error("Erreur lors de la soumission du type de travaux");
    } finally {
      setIsLoadingTravaux(false);
      setTravauxFormOpen(false);
      setEditingType(null);
    }
  };

  const handleAddSousType = (typeId) => {
    setSelectedTypeId(typeId);
    setEditingSousType(null);
    setSousTypeFormOpen(true);
  };

  const handleEditSousType = (typeId, sousType) => {
    setSelectedTypeId(typeId);
    setEditingSousType(sousType);
    setSousTypeFormOpen(true);
  };

  const handleDeleteSousType = async (typeId, sousTypeId) => {
    setIsLoadingTravaux(true);
    try {
      await deleteService(sousTypeId);
      dispatchTravaux({
        type: 'DELETE_SOUS_TYPE',
        payload: { typeId: typeId, id: sousTypeId }
      });
      toast.success("Sous-type de travaux supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du sous-type de travaux:", error);
      toast.error("Erreur lors de la suppression du sous-type de travaux");
    } finally {
      setIsLoadingTravaux(false);
    }
  };

  const handleSubmitSousType = async (typeId, sousTypeData) => {
    setIsLoadingTravaux(true);
    try {
      if (editingSousType) {
        await updateService(editingSousType.id, sousTypeData);
        dispatchTravaux({
          type: 'UPDATE_SOUS_TYPE',
          payload: { typeId: typeId, id: editingSousType.id, sousType: sousTypeData }
        });
        toast.success("Sous-type de travaux mis à jour avec succès");
      } else {
        await createService(sousTypeData);
        dispatchTravaux({
          type: 'ADD_SOUS_TYPE',
          payload: { typeId: typeId, sousType: sousTypeData }
        });
        toast.success("Sous-type de travaux ajouté avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du sous-type de travaux:", error);
      toast.error("Erreur lors de la soumission du sous-type de travaux");
    } finally {
      setIsLoadingTravaux(false);
      setSousTypeFormOpen(false);
      setEditingSousType(null);
      setSelectedTypeId(null);
    }
  };

  const getSurfaceReferenceLabel = (id) => {
    switch (id) {
      case 'murs': return 'Surface des murs';
      case 'sol': return 'Surface du sol';
      case 'plafond': return 'Surface du plafond';
      case 'menuiseries': return 'Surface des menuiseries';
      case 'plinthes': return 'Longueur des plinthes';
      case 'perimetre': return 'Périmètre de la pièce';
      default: return 'Non spécifié';
    }
  };

  const handleAddTypeMenuiserie = () => {
    setEditingTypeMenuiserie(null);
    setTypeMenuiserieFormOpen(true);
  };

  const handleEditTypeMenuiserie = (type) => {
    setEditingTypeMenuiserie(type);
    setTypeMenuiserieFormOpen(true);
  };

  const handleDeleteTypeMenuiserie = async (id) => {
    setIsLoadingMenuiseries(true);
    try {
      await deleteTypeMenuiserie(id);
      dispatchMenuiseries({ type: 'DELETE_TYPE', payload: id });
      toast.success("Type de menuiserie supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du type de menuiserie:", error);
      toast.error("Erreur lors de la suppression du type de menuiserie");
    } finally {
      setIsLoadingMenuiseries(false);
    }
  };

  const handleSubmitTypeMenuiserie = async (typeData) => {
    setIsLoadingMenuiseries(true);
    try {
      if (editingTypeMenuiserie) {
        await updateTypeMenuiserie(editingTypeMenuiserie.id, typeData);
        dispatchMenuiseries({
          type: 'UPDATE_TYPE',
          payload: { id: editingTypeMenuiserie.id, type: typeData }
        });
        toast.success("Type de menuiserie mis à jour avec succès");
      } else {
        await createTypeMenuiserie(typeData);
        dispatchMenuiseries({ type: 'ADD_TYPE', payload: typeData });
        toast.success("Type de menuiserie ajouté avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du type de menuiserie:", error);
      toast.error("Erreur lors de la soumission du type de menuiserie");
    } finally {
      setIsLoadingMenuiseries(false);
      setTypeMenuiserieFormOpen(false);
      setEditingTypeMenuiserie(null);
    }
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setClientFormOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setClientFormOpen(true);
  };
  
  const handleDeleteClient = (id: string) => {
    setClientToDelete(id);
    setConfirmDeleteClientOpen(true);
  };
  
  const confirmClientDelete = () => {
    if (clientToDelete) {
      dispatchClients({ type: 'DELETE_CLIENT', payload: clientToDelete });
      setConfirmDeleteClientOpen(false);
      setClientToDelete(null);
      toast.success("Client supprimé avec succès");
    }
  };
  
  const handleSubmitClient = (clientData: Client) => {
    if (editingClient) {
      dispatchClients({
        type: 'UPDATE_CLIENT',
        payload: { id: editingClient.id, client: clientData }
      });
      toast.success("Client mis à jour avec succès");
    } else {
      dispatchClients({ type: 'ADD_CLIENT', payload: clientData });
      toast.success("Client ajouté avec succès");
    }
    setClientFormOpen(false);
    setEditingClient(null);
  };
  
  const resetClientsToDefaults = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser tous les clients aux valeurs par défaut ?")) {
      dispatchClients({ type: 'RESET_CLIENTS' });
      toast.success("Tous les clients ont été réinitialisés aux valeurs par défaut");
    }
  };
  
  const getTypeClientLabel = (id?: string) => {
    if (!id) return "Non spécifié";
    const clientType = typesClients.find(type => type.id === id);
    return clientType ? clientType.label : id;
  };

  const getSurfaceImpacteeLabel = (surfaceImpactee) => {
    switch (surfaceImpactee) {
      case 'Mur': return 'Mur';
      case 'Plafond': return 'Plafond';
      case 'Sol': return 'Sol';
      case 'Aucune': return 'Aucune';
      default: return 'Non spécifié';
    }
  };

  const handleAddTypeAutreSurface = () => {
    setEditingTypeAutreSurface(null);
    setTypeAutreSurfaceFormOpen(true);
  };

  const handleEditTypeAutreSurface = (type: AutreSurfaceType) => {
    const typeAutreSurface: TypeAutreSurface = {
      id: type.id,
      nom: type.name,
      description: type.description || '',
      surfaceImpacteeParDefaut: type.surface_impactee === 'Mur' ? 'mur' :
                                type.surface_impactee === 'Plafond' ? 'plafond' :
                                type.surface_impactee === 'Sol' ? 'sol' : 'aucune',
      estDeduction: type.adjustment_type === 'Déduire',
      largeur: type.largeur || 0,
      hauteur: type.hauteur || 0,
      impactePlinthe: type.impacte_plinthe
    };
    
    setEditingTypeAutreSurface(typeAutreSurface);
    setTypeAutreSurfaceFormOpen(true);
  };

  const handleDeleteTypeAutreSurface = async (id) => {
    setIsLoadingAutresSurfaces(true);
    try {
      await deleteAutreSurfaceType(id);
      const updatedTypes = autresSurfacesTypes.filter(type => type.id !== id);
      setAutresSurfacesTypes(updatedTypes);
      toast.success("Type d'autre surface supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du type d'autre surface:", error);
      toast.error("Erreur lors de la suppression du type d'autre surface");
    } finally {
      setIsLoadingAutresSurfaces(false);
    }
  };

  const confirmTypeAutreSurfaceDelete = () => {
    // Implémentez la logique de confirmation ici si nécessaire
  };

  const handleSubmitTypeAutreSurface = async (typeData: TypeAutreSurface) => {
    setIsLoadingAutresSurfaces(true);
    
    try {
      let success = false;
      let updatedType: TypeAutreSurface | null = null;
      
      if (editingTypeAutreSurface) {
        updatedType = await updateAutreSurfaceType(editingTypeAutreSurface.id, typeData);
        success = updatedType !== null;
      } else {
        updatedType = await createAutreSurfaceType(typeData);
        success = updatedType !== null;
      }
      
      if (success && updatedType) {
        const types = await fetchAutresSurfacesTypes();
        
        const supabaseTypes: AutreSurfaceType[] = types.map(item => ({
          id: item.id,
          created_at: '',
          name: item.nom,
          description: item.description,
          surface_impactee: item.surfaceImpacteeParDefaut === 'mur' ? 'Mur' :
                          item.surfaceImpacteeParDefaut === 'plafond' ? 'Plafond' :
                          item.surfaceImpacteeParDefaut === 'sol' ? 'Sol' : 'Aucune',
          adjustment_type: item.estDeduction ? 'Déduire' : 'Ajouter',
          impacte_plinthe: item.impactePlinthe || false,
          largeur: item.largeur || 0,
          hauteur: item.hauteur || 0
        }));
        
        setAutresSurfacesTypes(supabaseTypes);
        
        toast.success(editingTypeAutreSurface 
          ? "Type d'autre surface mis à jour avec succès" 
          : "Type d'autre surface ajouté avec succès"
        );
      } else {
        toast.error("Une erreur est survenue");
      }
    } catch (error) {
      console.error("Erreur lors de l'opération:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoadingAutresSurfaces(false);
      setTypeAutreSurfaceFormOpen(false);
      setEditingTypeAutreSurface(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
      <p className="text-gray-600 mb-6">Gérez les types de travaux, de menuiseries, les clients et leurs paramètres</p>
      
      {showDiagnostic && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Statut de la connexion à la base de données
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDiagnostic(false)}
            >
              Masquer
            </Button>
          </div>
          <SupabaseStatus />
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="w-full">
          <TabsTrigger value="travaux" className="flex-1">Types de Travaux</TabsTrigger>
          <TabsTrigger value="menuiseries" className="flex-1">Types de Menuiseries</TabsTrigger>
          <TabsTrigger value="autresSurfaces" className="flex-1">Types d'Autres Surfaces</TabsTrigger>
          <TabsTrigger value="clients" className="flex-1">Fiches Clients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="travaux" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Types de Travaux</h2>
            <Button onClick={handleAddType} disabled={isLoadingTravaux}>
              {isLoadingTravaux ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Ajouter
            </Button>
          </div>
          
          {isLoadingTravaux ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="bg-white rounded-md shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {travauxState.types.length > 0 ? (
                    travauxState.types.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell className="font-medium">{type.nom}</TableCell>
                        <TableCell>{type.description}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditType(type)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteType(type.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAddSousType(type.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        Aucun type de travaux défini.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="menuiseries" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Types de Menuiseries</h2>
            <Button onClick={handleAddTypeMenuiserie} disabled={isLoadingMenuiseries}>
              {isLoadingMenuiseries ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Ajouter
            </Button>
          </div>
          
          {isLoadingMenuiseries ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="bg-white rounded-md shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Surface de référence</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuiseriesState.typesMenuiseries.length > 0 ? (
                    menuiseriesState.typesMenuiseries.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell className="font-medium">{type.nom}</TableCell>
                        <TableCell>{type.description}</TableCell>
                        <TableCell>{type.surfaceReference}</TableCell>
                        <TableCell className="text-right">
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
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Aucun type de menuiserie défini.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="autresSurfaces" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Types d'Autres Surfaces</h2>
            <Button onClick={handleAddTypeAutreSurface} disabled={isLoadingAutresSurfaces}>
              {isLoadingAutresSurfaces ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Ajouter
            </Button>
          </div>
          
          {isLoadingAutresSurfaces ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="bg-white rounded-md shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Surface impactée</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dimensions</TableHead>
                    <TableHead>Impact Plinthe</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {autresSurfacesTypes.length > 0 ? (
                    autresSurfacesTypes.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell className="font-medium">{type.name}</TableCell>
                        <TableCell>{type.description || '-'}</TableCell>
                        <TableCell>{getSurfaceImpacteeLabel(type.surface_impactee)}</TableCell>
                        <TableCell>
                          <Badge variant={type.adjustment_type === 'Déduire' ? "destructive" : "default"}>
                            {type.adjustment_type === 'Déduire' ? 'Déduction' : 'Ajout'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {type.largeur && type.hauteur 
                            ? `${type.largeur} × ${type.hauteur} m` 
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {type.impacte_plinthe ? 'Oui' : 'Non'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditTypeAutreSurface(type)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteTypeAutreSurface(type.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Aucun type d'autre surface défini.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="clients" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Fiches Clients</h2>
            <Button onClick={handleAddClient}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
          
          <div className="bg-white rounded-md shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientsState.clients.length > 0 ? (
                  clientsState.clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.nom}</TableCell>
                      <TableCell>{client.prenom}</TableCell>
                      <TableCell>{client.telephone}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{getTypeClientLabel(client.typeClient)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditClient(client)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteClient(client.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Aucun client défini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <Button 
            variant="destructive" 
            className="mt-4"
            onClick={resetClientsToDefaults}
          >
            Réinitialiser les clients aux valeurs par défaut
          </Button>
        </TabsContent>
      </Tabs>
      
      {/* Form Dialogs */}
      <TypeTravauxForm
        isOpen={travauxFormOpen}
        onClose={() => {
          setTravauxFormOpen(false);
          setEditingType(null);
        }}
        typeToEdit={editingType}
        onSubmit={handleSubmitType}
      />
      
      {selectedTypeId && (
        <SousTypeTravauxForm
          isOpen={sousTypeFormOpen}
          onClose={() => {
            setSousTypeFormOpen(false);
            setEditingSousType(null);
            setSelectedTypeId(null);
          }}
          typeId={selectedTypeId}
          sousTypeToEdit={editingSousType}
          onSubmit={handleSubmitSousType}
        />
      )}
      
      <TypeMenuiserieForm
        isOpen={typeMenuiserieFormOpen}
        onClose={() => {
          setTypeMenuiserieFormOpen(false);
          setEditingTypeMenuiserie(null);
        }}
        typeToEdit={editingTypeMenuiserie}
        onSubmit={handleSubmitTypeMenuiserie}
      />
      
      <ClientForm
        isOpen={clientFormOpen}
        onClose={() => {
          setClientFormOpen(false);
          setEditingClient(null);
        }}
        clientToEdit={editingClient}
        onSubmit={handleSubmitClient}
      />
      
      {/* Dialog for TypeAutreSurface */}
      {typeAutreSurfaceFormOpen && (
        <TypeAutreSurfaceForm
          isOpen={typeAutreSurfaceFormOpen}
          onClose={() => {
            setTypeAutreSurfaceFormOpen(false);
            setEditingTypeAutreSurface(null);
          }}
          typeToEdit={editingTypeAutreSurface}
          onSubmit={handleSubmitTypeAutreSurface}
        />
      )}
      
      {/* Confirmation Dialogs */}
      {/* Client Delete Confirmation Dialog */}
      {/* Client Delete Confirmation Dialog */}
      
    </div>
  );
};

export default Parametres;
