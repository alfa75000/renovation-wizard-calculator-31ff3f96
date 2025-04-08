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
  LinkIcon,
  DoorOpen,
  Users,
  User,
  Loader2,
  Database,
  Box
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
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

import TypeMenuiserieForm from "@/features/admin/components/TypeMenuiserieForm";
import ClientForm from "@/features/admin/components/ClientForm";
import TypeAutreSurfaceForm from "@/features/admin/components/TypeAutreSurfaceForm";
import SupabaseStatus from "@/components/SupabaseStatus";

import { WorkType, ServiceGroup, Service, MenuiserieType, AutreSurfaceType } from "@/types/supabase";
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

import {
  fetchAutresSurfacesTypes,
  createAutreSurfaceType,
  updateAutreSurfaceType,
  deleteAutreSurfaceType
} from "@/services/autresSurfacesService";

import { useMenuiseriesTypes, surfacesReference as menuiserieSurfacesReference } from "@/contexts/MenuiseriesTypesContext";
import { useClients, typesClients } from "@/contexts/ClientsContext";
import { TypeMenuiserie, TypeAutreSurface, Client } from "@/types";
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
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
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
  const [typeMenuiserieFormOpen, setTypeMenuiserieFormOpen] = useState(false);
  const [editingTypeMenuiserie, setEditingTypeMenuiserie] = useState<TypeMenuiserie | null>(null);
  const [confirmDeleteMenuiserieOpen, setConfirmDeleteMenuiserieOpen] = useState(false);
  const [typeMenuiserieToDelete, setTypeMenuiserieToDelete] = useState<string | null>(null);
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [confirmDeleteClientOpen, setConfirmDeleteClientOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [showDiagnostic, setShowDiagnostic] = useState(true);
  const [typeAutreSurfaceFormOpen, setTypeAutreSurfaceFormOpen] = useState(false);
  const [editingTypeAutreSurface, setEditingTypeAutreSurface] = useState<TypeAutreSurface | null>(null);
  const [confirmDeleteAutreSurfaceOpen, setConfirmDeleteAutreSurfaceOpen] = useState(false);
  const [typeAutreSurfaceToDelete, setTypeAutreSurfaceToDelete] = useState<string | null>(null);
  const [autresSurfacesTypes, setAutresSurfacesTypes] = useState<AutreSurfaceType[]>([]);
  const [isLoadingAutresSurfaces, setIsLoadingAutresSurfaces] = useState<boolean>(false);

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
    const loadMenuiserieTypes = async () => {
      setIsLoadingMenuiseries(true);
      try {
        const data = await fetchMenuiserieTypes();
        
        if (Array.isArray(data)) {
          setMenuiserieTypes(data);
        } else {
          console.error("fetchMenuiserieTypes n'a pas retourné un tableau:", data);
          setMenuiserieTypes([]); 
        }
      } catch (error) {
        console.error("Erreur lors du chargement des types de menuiseries:", error);
        toast.error("Impossible de charger les types de menuiseries");
        setMenuiserieTypes([]); 
      } finally {
        setIsLoadingMenuiseries(false);
      }
    };
    
    if (activeTab === "menuiseries") {
      loadMenuiserieTypes();
    }
  }, [activeTab]);

  useEffect(() => {
    const loadAutresSurfacesTypes = async () => {
      if (activeTab !== "autresSurfaces") return;
      
      setIsLoadingAutresSurfaces(true);
      try {
        const data = await fetchAutresSurfacesTypes();
        
        const supabaseTypes: AutreSurfaceType[] = data.map(item => ({
          id: item.id,
          created_at: '',
          name: item.nom,
          description: item.description,
          surface_impactee: item.surfaceImpacteeParDefaut === 'mur' ? 'Mur' :
                           item.surfaceImpacteeParDefaut === 'plafond' ? 'Plafond' :
                           item.surfaceImpacteeParDefaut === 'sol' ? 'Sol' : 'Aucune',
          adjustment_type: item.estDeduction ? 'Déduire' : 'Ajouter',
          impacte_plinthe: false,
          largeur: 0,
          hauteur: 0
        }));
        
        setAutresSurfacesTypes(supabaseTypes);
      } catch (error) {
        console.error("Erreur lors du chargement des types d'autres surfaces:", error);
        toast.error("Impossible de charger les types d'autres surfaces");
      } finally {
        setIsLoadingAutresSurfaces(false);
      }
    };
    
    loadAutresSurfacesTypes();
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

  const handleAddTypeMenuiserie = () => {
    setEditingTypeMenuiserie(null);
    setTypeMenuiserieFormOpen(true);
  };

  const handleEditMenuiserieType = (type: MenuiserieType) => {
    const typeMenuiserie: TypeMenuiserie = {
      id: type.id,
      nom: type.name,
      largeur: type.largeur,
      hauteur: type.hauteur,
      surfaceReference: type.surface_impactee,
      impactePlinthe: type.impacte_plinthe,
      description: type.description || ''
    };
    setEditingTypeMenuiserie(typeMenuiserie);
    setTypeMenuiserieFormOpen(true);
  };

  const handleDeleteTypeMenuiserie = (id: string) => {
    setTypeMenuiserieToDelete(id);
    setConfirmDeleteMenuiserieOpen(true);
  };

  const confirmTypeMenuiserieDelete = async () => {
    if (typeMenuiserieToDelete) {
      setIsLoadingMenuiseries(true);
      try {
        const success = await deleteMenuiserieType(typeMenuiserieToDelete);
        
        if (success) {
          
          const updatedTypes = await fetchMenuiserieTypes();
          
          if (Array.isArray(updatedTypes)) {
            setMenuiserieTypes(updatedTypes);
            toast.success("Type de menuiserie supprimé avec succès");
          } else {
            console.error("fetchMenuiserieTypes après suppression n'a pas retourné un tableau:", updatedTypes);
            
            setMenuiserieTypes(prevTypes => 
              prevTypes.filter(type => type.id !== typeMenuiserieToDelete)
            );
            toast.success("Type de menuiserie supprimé avec succès");
          }
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Une erreur est survenue lors de la suppression");
      } finally {
        setIsLoadingMenuiseries(false);
        setConfirmDeleteMenuiserieOpen(false);
        setTypeMenuiserieToDelete(null);
      }
    }
  };

  const handleSubmitTypeMenuiserie = async (typeData: TypeMenuiserie) => {
    setIsLoadingMenuiseries(true);
    
    try {
      const supabaseData = {
        name: typeData.nom,
        hauteur: typeData.hauteur,
        largeur: typeData.largeur,
        surface_impactee: typeData.surfaceReference,
        impacte_plinthe: typeData.impactePlinthe,
        description: typeData.description
      };
      
      let success = false;
      
      if (editingTypeMenuiserie) {
        const updatedType = await updateMenuiserieType(editingTypeMenuiserie.id, supabaseData);
        success = updatedType !== null;
      } else {
        const newType = await createMenuiserieType(supabaseData);
        success = newType !== null;
      }
      
      if (success) {
        
        const updatedTypes = await fetchMenuiserieTypes();
        
        if (Array.isArray(updatedTypes)) {
          setMenuiserieTypes(updatedTypes);
        } else {
          console.error("fetchMenuiserieTypes après ajout/modif n'a pas retourné un tableau:", updatedTypes);
          
          toast.warning("La liste n'a pas pu être actualisée, veuillez rafraîchir la page");
        }
        
        toast.success(editingTypeMenuiserie 
          ? "Type de menuiserie mis à jour avec succès" 
          : "Type de menuiserie ajouté avec succès"
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'opération:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoadingMenuiseries(false);
      setTypeMenuiserieFormOpen(false);
      setEditingTypeMenuiserie(null);
    }
  };

  const getSurfaceMenuiserieLabel = (id?: string) => {
    if (!id) return "Non spécifié";
    const surface = surfacesMenuiseries.find(surface => surface.id === id);
    return surface ? surface.label : id;
  };

  const resetMenuiseriesToDefaults = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser tous les types de menuiseries aux valeurs par défaut ?")) {
      dispatchMenuiseriesTypes({ type: 'RESET_TYPES' });
      toast.success("Tous les types de menuiseries ont été réinitialisés aux valeurs par défaut");
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
    const type = typesClients.find(type => type.id === id);
    return type ? type.label : id;
  };

  const getSurfaceImpacteeLabel = (value: string | undefined): string => {
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
      estDeduction: type.adjustment_type === 'Déduire'
    };
    
    setEditingTypeAutreSurface(typeAutreSurface);
    setTypeAutreSurfaceFormOpen(true);
  };

  const handleDeleteTypeAutreSurface = (id: string) => {
    setTypeAutreSurfaceToDelete(id);
    setConfirmDeleteAutreSurfaceOpen(true);
  };

  const confirmTypeAutreSurfaceDelete = async () => {
    if (typeAutreSurfaceToDelete) {
      setIsLoadingAutresSurfaces(true);
      try {
        const success = await deleteAutreSurfaceType(typeAutreSurfaceToDelete);
        
        if (success) {
          setAutresSurfacesTypes(prev => prev.filter(type => type.id !== typeAutreSurfaceToDelete));
          toast.success("Type d'autre surface supprimé avec succès");
        } else {
          toast.error("Échec de la suppression du type d'autre surface");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Une erreur est survenue lors de la suppression");
      } finally {
        setIsLoadingAutresSurfaces(false);
        setConfirmDeleteAutreSurfaceOpen(false);
        setTypeAutreSurfaceToDelete(null);
      }
    }
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
          impacte_plinthe: false,
          largeur: 0,
          hauteur: 0
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
          <TabsTrigger value="autresSurfaces" className="flex-1">Types d'Autres Surfaces</TabsTrigger>
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
                  <div className="
