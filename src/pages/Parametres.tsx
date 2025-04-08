import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
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
  DoorOpen,
  Users,
  User,
  Loader2,
  Database
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import TypeMenuiserieForm from "@/features/admin/components/TypeMenuiserieForm";
import ClientForm from "@/features/admin/components/ClientForm";
import SupabaseStatus from "@/components/SupabaseStatus";

import { WorkType, ServiceGroup, Service, MenuiserieType, SurfaceImpactee } from "@/types/supabase";
import { 
  fetchWorkTypes, 
  fetchServiceGroups, 
  fetchServices,
  createWorkType,
  updateWorkType,
  deleteWorkType,
  createServiceGroup,
  updateServiceGroup,
  deleteServiceGroup,
  createService,
  updateService,
  deleteService
} from "@/services/travauxService";

import {
  fetchMenuiserieTypes,
  createMenuiserieType,
  updateMenuiserieType,
  deleteMenuiserieType
} from "@/services/menuiseriesService";

import { useMenuiseriesTypes, surfacesReference as menuiserieSurfacesReference } from "@/contexts/MenuiseriesTypesContext";
import { Client, useClients, typesClients } from "@/contexts/ClientsContext";
import { TypeMenuiserie } from "@/types";
import { surfacesReference } from "@/contexts/TravauxTypesContext";
import { surfacesMenuiseries } from "@/types";

const Parametres = () => {
  const { state: stateMenuiseriesTypes, dispatch: dispatchMenuiseriesTypes } = useMenuiseriesTypes();
  const { typesMenuiseries } = stateMenuiseriesTypes;
  
  const { state: stateClients, dispatch: dispatchClients } = useClients();
  const { clients } = stateClients;

  const [activeTab, setActiveTab] = useState("travaux");
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [menuiserieTypes, setMenuiserieTypes] = useState<MenuiserieType[]>([]);
  const [selectedWorkTypeId, setSelectedWorkTypeId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState<boolean>(false);
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(false);
  const [isLoadingMenuiseries, setIsLoadingMenuiseries] = useState<boolean>(false);
  const [workTypeFormOpen, setWorkTypeFormOpen] = useState<boolean>(false);
  const [editingWorkType, setEditingWorkType] = useState<WorkType | null>(null);
  const [serviceGroupFormOpen, setServiceGroupFormOpen] = useState<boolean>(false);
  const [editingServiceGroup, setEditingServiceGroup] = useState<ServiceGroup | null>(null);
  const [serviceFormOpen, setServiceFormOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [confirmDeleteWorkTypeOpen, setConfirmDeleteWorkTypeOpen] = useState<boolean>(false);
  const [workTypeToDelete, setWorkTypeToDelete] = useState<string | null>(null);
  const [confirmDeleteGroupOpen, setConfirmDeleteGroupOpen] = useState<boolean>(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [confirmDeleteServiceOpen, setConfirmDeleteServiceOpen] = useState<boolean>(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [menuiserieTypeFormOpen, setMenuiserieTypeFormOpen] = useState(false);
  const [editingMenuiserieType, setEditingMenuiserieType] = useState<MenuiserieType | null>(null);
  const [confirmDeleteMenuiserieOpen, setConfirmDeleteMenuiserieOpen] = useState(false);
  const [menuiserieTypeToDelete, setMenuiserieTypeToDelete] = useState<string | null>(null);
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [confirmDeleteClientOpen, setConfirmDeleteClientOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [showDiagnostic, setShowDiagnostic] = useState(true);

  useEffect(() => {
    const loadWorkTypes = async () => {
      setLoading(true);
      try {
        const data = await fetchWorkTypes();
        setWorkTypes(data);
      } catch (error) {
        console.error("Erreur lors du chargement des types de travaux:", error);
        toast.error("Impossible de charger les types de travaux");
      } finally {
        setLoading(false);
      }
    };
    
    loadWorkTypes();
  }, []);

  useEffect(() => {
    if (!selectedWorkTypeId) {
      setServiceGroups([]);
      return;
    }
    
    const loadServiceGroups = async () => {
      setIsLoadingGroups(true);
      try {
        const data = await fetchServiceGroups(selectedWorkTypeId);
        setServiceGroups(data);
      } catch (error) {
        console.error("Erreur lors du chargement des groupes:", error);
        toast.error("Impossible de charger les groupes");
      } finally {
        setIsLoadingGroups(false);
      }
    };
    
    loadServiceGroups();
  }, [selectedWorkTypeId]);

  useEffect(() => {
    if (!selectedGroupId) {
      setServices([]);
      return;
    }
    
    const loadServices = async () => {
      setIsLoadingServices(true);
      try {
        const data = await fetchServices(selectedGroupId);
        setServices(data);
      } catch (error) {
        console.error("Erreur lors du chargement des services:", error);
        toast.error("Impossible de charger les services");
      } finally {
        setIsLoadingServices(false);
      }
    };
    
    loadServices();
  }, [selectedGroupId]);

  useEffect(() => {
    // Chargement des types de menuiseries depuis Supabase
    const loadMenuiserieTypes = async () => {
      setIsLoadingMenuiseries(true);
      try {
        const data = await fetchMenuiserieTypes();
        setMenuiserieTypes(data);
      } catch (error) {
        console.error("Erreur lors du chargement des types de menuiseries:", error);
        toast.error("Impossible de charger les types de menuiseries");
      } finally {
        setIsLoadingMenuiseries(false);
      }
    };
    
    if (activeTab === "menuiseries") {
      loadMenuiserieTypes();
    }
  }, [activeTab]);

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

  const handleAddWorkType = () => {
    setEditingWorkType(null);
    setWorkTypeFormOpen(true);
  };

  const handleEditWorkType = (workType: WorkType) => {
    setEditingWorkType(workType);
    setWorkTypeFormOpen(true);
  };

  const handleDeleteWorkType = (id: string) => {
    setWorkTypeToDelete(id);
    setConfirmDeleteWorkTypeOpen(true);
  };

  const confirmWorkTypeDelete = async () => {
    if (workTypeToDelete) {
      setLoading(true);
      const success = await deleteWorkType(workTypeToDelete);
      setLoading(false);
      
      if (success) {
        setWorkTypes(prev => prev.filter(wt => wt.id !== workTypeToDelete));
        setConfirmDeleteWorkTypeOpen(false);
        setWorkTypeToDelete(null);
        
        if (selectedWorkTypeId === workTypeToDelete) {
          setSelectedWorkTypeId(null);
        }
        
        toast.success("Type de travaux supprimé avec succès");
      }
    }
  };

  const handleSubmitWorkType = async (name: string) => {
    setLoading(true);
    
    try {
      if (editingWorkType) {
        const updatedWorkType = await updateWorkType(editingWorkType.id, name);
        
        if (updatedWorkType) {
          setWorkTypes(prev => prev.map(wt => 
            wt.id === editingWorkType.id ? updatedWorkType : wt
          ));
          toast.success("Type de travaux mis à jour avec succès");
        }
      } else {
        const newWorkType = await createWorkType(name);
        
        if (newWorkType) {
          setWorkTypes(prev => [...prev, newWorkType]);
          toast.success("Type de travaux créé avec succès");
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
      setWorkTypeFormOpen(false);
      setEditingWorkType(null);
    }
  };

  const handleAddServiceGroup = () => {
    if (selectedWorkTypeId) {
      setEditingServiceGroup(null);
      setServiceGroupFormOpen(true);
    }
  };

  const handleEditServiceGroup = (group: ServiceGroup) => {
    setEditingServiceGroup(group);
    setServiceGroupFormOpen(true);
  };

  const handleDeleteServiceGroup = (id: string) => {
    setGroupToDelete(id);
    setConfirmDeleteGroupOpen(true);
  };

  const confirmServiceGroupDelete = async () => {
    if (groupToDelete) {
      setIsLoadingGroups(true);
      const success = await deleteServiceGroup(groupToDelete);
      setIsLoadingGroups(false);
      
      if (success) {
        setServiceGroups(prev => prev.filter(g => g.id !== groupToDelete));
        setConfirmDeleteGroupOpen(false);
        setGroupToDelete(null);
        
        if (selectedGroupId === groupToDelete) {
          setSelectedGroupId(null);
        }
        
        toast.success("Groupe supprimé avec succès");
      }
    }
  };

  const handleSubmitServiceGroup = async (name: string) => {
    if (!selectedWorkTypeId) return;
    
    setIsLoadingGroups(true);
    
    try {
      if (editingServiceGroup) {
        const updatedGroup = await updateServiceGroup(editingServiceGroup.id, name);
        
        if (updatedGroup) {
          setServiceGroups(prev => prev.map(g => 
            g.id === editingServiceGroup.id ? updatedGroup : g
          ));
          toast.success("Groupe mis à jour avec succès");
        }
      } else {
        const newGroup = await createServiceGroup(name, selectedWorkTypeId);
        
        if (newGroup) {
          setServiceGroups(prev => [...prev, newGroup]);
          toast.success("Groupe créé avec succès");
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoadingGroups(false);
      setServiceGroupFormOpen(false);
      setEditingServiceGroup(null);
    }
  };

  const handleAddService = () => {
    if (selectedGroupId) {
      setEditingService(null);
      setServiceFormOpen(true);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceFormOpen(true);
  };

  const handleDeleteService = (id: string) => {
    setServiceToDelete(id);
    setConfirmDeleteServiceOpen(true);
  };

  const confirmServiceDelete = async () => {
    if (serviceToDelete) {
      setIsLoadingServices(true);
      const success = await deleteService(serviceToDelete);
      setIsLoadingServices(false);
      
      if (success) {
        setServices(prev => prev.filter(s => s.id !== serviceToDelete));
        setConfirmDeleteServiceOpen(false);
        setServiceToDelete(null);
        toast.success("Service supprimé avec succès");
      }
    }
  };

  const handleSubmitService = async (serviceData: {
    name: string;
    description: string;
    labor_price: number;
    supply_price: number;
  }) => {
    if (!selectedGroupId) return;
    
    setIsLoadingServices(true);
    
    try {
      if (editingService) {
        const updatedService = await updateService(editingService.id, serviceData);
        
        if (updatedService) {
          setServices(prev => prev.map(s => 
            s.id === editingService.id ? updatedService : s
          ));
          toast.success("Service mis à jour avec succès");
        }
      } else {
        const newService = await createService({
          ...serviceData,
          group_id: selectedGroupId
        });
        
        if (newService) {
          setServices(prev => [...prev, newService]);
          toast.success("Service créé avec succès");
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoadingServices(false);
      setServiceFormOpen(false);
      setEditingService(null);
    }
  };

  const getSurfaceReferenceLabel = (id?: string) => {
    if (!id) return "Non spécifié";
    const surface = surfacesReference.find(surface => surface.id === id);
    return surface ? surface.label : id;
  };

  const handleAddMenuiserieType = () => {
    setEditingMenuiserieType(null);
    setMenuiserieTypeFormOpen(true);
  };

  const handleEditMenuiserieType = (type: MenuiserieType) => {
    setEditingMenuiserieType(type);
    setMenuiserieTypeFormOpen(true);
  };

  const handleDeleteMenuiserieType = (id: string) => {
    setMenuiserieTypeToDelete(id);
    setConfirmDeleteMenuiserieOpen(true);
  };

  const confirmMenuiserieTypeDelete = async () => {
    if (menuiserieTypeToDelete) {
      setIsLoadingMenuiseries(true);
      const success = await deleteMenuiserieType(menuiserieTypeToDelete);
      setIsLoadingMenuiseries(false);
      
      if (success) {
        setMenuiserieTypes(prev => prev.filter(type => type.id !== menuiserieTypeToDelete));
        setConfirmDeleteMenuiserieOpen(false);
        setMenuiserieTypeToDelete(null);
        toast.success("Type de menuiserie supprimé avec succès");
      }
    }
  };

  const handleSubmitMenuiserieType = async (formData: {
    name: string;
    largeur: number;
    hauteur: number;
    surface_impactee: SurfaceImpactee;
    impacte_plinthe: boolean;
  }) => {
    setIsLoadingMenuiseries(true);
    
    try {
      if (editingMenuiserieType) {
        // Mise à jour d'un type existant
        const updatedType = await updateMenuiserieType(editingMenuiserieType.id, formData);
        
        if (updatedType) {
          setMenuiserieTypes(prev => 
            prev.map(type => type.id === editingMenuiserieType.id ? updatedType : type)
          );
          toast.success("Type de menuiserie mis à jour avec succès");
        }
      } else {
        // Création d'un nouveau type
        const newType = await createMenuiserieType(formData);
        
        if (newType) {
          setMenuiserieTypes(prev => [...prev, newType]);
          toast.success("Type de menuiserie créé avec succès");
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoadingMenuiseries(false);
      setMenuiserieTypeFormOpen(false);
      setEditingMenuiserieType(null);
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
  
  const getTypeClientLabel = (id: string) => {
    const type = typesClients.find(type => type.id === id);
    return type ? type.label : id;
  };

  const getSurfaceImpacteeLabel = (value: SurfaceImpactee | string | undefined): string => {
    if (!value) return "Non spécifié";
    
    switch (value) {
      case "Mur":
        return "Mur";
      case "Plafond":
        return "Plafond";
      case "Sol":
        return "Sol";
      case "Aucune":
        return "Aucune";
      default:
        return value;
    }
  };

  return (
    <Layout
      title="Paramètres"
      subtitle="Gérez les types de travaux, de menuiseries, les clients et leurs paramètres"
    >
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
          <TabsTrigger value="clients" className="flex-1">Fiches Clients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="travaux" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-md lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Types de travaux</span>
                  <Button variant="outline" size="sm" onClick={handleAddWorkType} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                    Ajouter
                  </Button>
                </CardTitle>
                <CardDescription>
                  Sélectionnez un type pour voir et gérer ses groupes et prestations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      {workTypes.map((type) => (
                        <div 
                          key={type.id}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${selectedWorkTypeId === type.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                          onClick={() => {
                            setSelectedWorkTypeId(type.id);
                            setSelectedGroupId(null);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Wrench className="h-5 w-5 text-gray-500" />
                            <span>{type.name}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditWorkType(type);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteWorkType(type.id);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {workTypes.length === 0 && (
                        <Alert>
                          <AlertDescription>
                            Aucun type de travaux défini. Utilisez le bouton "Ajouter" pour créer un nouveau type.
                          </AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {selectedWorkTypeId 
                      ? `Groupes et Prestations pour "${workTypes.find(t => t.id === selectedWorkTypeId)?.name || ''}"` 
                      : "Groupes et Prestations"
                    }
                  </span>
                  {selectedWorkTypeId && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddServiceGroup}
                      disabled={isLoadingGroups}
                    >
                      {isLoadingGroups ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                      Ajouter un groupe
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedWorkTypeId 
                    ? `Gérez les groupes et prestations disponibles pour le type "${workTypes.find(t => t.id === selectedWorkTypeId)?.name || ''}"`
                    : "Sélectionnez un type de travaux pour voir ses groupes et prestations"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedWorkTypeId ? (
                  <div className="space-y-6">
                    {isLoadingGroups ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      <>
                        {serviceGroups.length > 0 ? (
                          <div className="space-y-6">
                            {serviceGroups.map((group) => (
                              <div key={group.id} className="border rounded-md overflow-hidden">
                                <div 
                                  className={`flex items-center justify-between p-3 ${selectedGroupId === group.id ? 'bg-blue-100' : 'bg-gray-50'} cursor-pointer`}
                                  onClick={() => setSelectedGroupId(group.id)}
                                >
                                  <div className="font-medium">{group.name}</div>
                                  <div className="flex gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleAddService()}
                                      disabled={selectedGroupId !== group.id || isLoadingServices}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditServiceGroup(group);
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteServiceGroup(group.id);
                                      }}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {selectedGroupId === group.id && (
                                  <div className="p-2">
                                    <div className="flex justify-between items-center mb-3">
                                      <h4 className="text-sm font-medium">Prestations</h4>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={handleAddService}
                                        disabled={isLoadingServices}
                                      >
                                        {isLoadingServices ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                                        Ajouter une prestation
                                      </Button>
                                    </div>
                                    
                                    {isLoadingServices ? (
                                      <div className="flex justify-center py-4">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                      </div>
                                    ) : (
                                      <>
                                        {services.length > 0 ? (
                                          <div className="rounded-md border">
                                            <div className="grid grid-cols-12 bg-gray-100 p-3 rounded-t-md font-medium text-sm">
                                              <div className="col-span-4">Nom</div>
                                              <div className="col-span-2">Main d'œuvre</div>
                                              <div className="col-span-2">Fournitures</div>
                                              <div className="col-span-2">Prix total</div>
                                              <div className="col-span-2 text-right">Actions</div>
                                            </div>
                                            <div className="divide-y">
                                              {services.map((service) => (
                                                <div key={service.id} className="grid grid-cols-12 p-3 items-center hover:bg-gray-50">
                                                  <div className="col-span-4 font-medium">
                                                    <div className="truncate">{service.name}</div>
                                                    {service.description && (
                                                      <div className="text-xs text-gray-500 mt-1 truncate">
                                                        {service.description}
                                                      </div>
                                                    )}
                                                  </div>
                                                  <div className="col-span-2">{service.labor_price.toFixed(2)} €</div>
                                                  <div className="col-span-2">{service.supply_price.toFixed(2)} €</div>
                                                  <div className="col-span-2">{(service.labor_price + service.supply_price).toFixed(2)} €</div>
                                                  <div className="col-span-2 flex justify-end gap-1">
                                                    <Button 
                                                      variant="ghost" 
                                                      size="sm"
                                                      onClick={() => handleEditService(service)}
                                                    >
                                                      <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                      variant="ghost" 
                                                      size="sm"
                                                      onClick={() => handleDeleteService(service.id)}
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
                                              Aucune prestation définie pour ce groupe. Utilisez le bouton "Ajouter une prestation" pour en créer une.
                                            </AlertDescription>
                                          </Alert>
                                        )}
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Alert>
                            <AlertDescription>
                              Aucun groupe défini pour ce type de travaux. Utilisez le bouton "Ajouter un groupe" pour en créer un.
                            </AlertDescription>
                          </Alert>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>Veuillez sélectionner un type de travaux dans la liste à gauche pour voir ses groupes et prestations</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="menuiseries" className="mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <DoorOpen className="h-5 w-5" />
                  Types de Menuiseries
                </span>
                <Button variant="outline" size="sm" onClick={handleAddMenuiserieType}>
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter un type
                </Button>
              </CardTitle>
              <CardDescription>
                Gérez les types de menuiseries disponibles pour votre projet
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingMenuiseries ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : menuiserieTypes.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 bg-gray-100 p-3 rounded-t-md font-medium text-sm">
                    <div className="col-span-3">Nom</div>
                    <div className="col-span-2">Dimensions</div>
                    <div className="col-span-3">Surface impactée</div>
                    <div className="col-span-2">Impact plinthes</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  <div className="divide-y">
                    {menuiserieTypes.map((type) => (
                      <div key={type.id} className="grid grid-cols-12 p-3 items-center hover:bg-gray-50">
                        <div className="col-span-3 font-medium">
                          <div className="truncate">{type.name}</div>
                        </div>
                        <div className="col-span-2">
                          {type.largeur} × {type.hauteur} cm
                        </div>
                        <div className="col-span-3">
                          {getSurfaceImpacteeLabel(type.surface_impactee)}
                        </div>
                        <div className="col-span-2">
                          <Badge variant={type.impacte_plinthe ? "default" : "outline"}>
                            {type.impacte_plinthe ? "Oui" : "Non"}
                          </Badge>
                        </div>
                        <div className="col-span-2 flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditMenuiserieType(type)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
