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
  Home, 
  Droplet, 
  Power, 
  Pipette, 
  Cpu, 
  CircuitBoard,
  Flame,
  Cable,
  Building,
  LinkIcon,
  DoorOpen,
  Users,
  User,
  Loader2,
  Database,
  Building2,
  Briefcase
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
import CompanyForm from "@/features/admin/components/CompanyForm";
import SupabaseStatus from "@/components/SupabaseStatus";

import { WorkType, ServiceGroup, Service, MenuiserieType } from "@/types/supabase";
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
  fetchCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  Company as CompanyType
} from "@/services/companiesService";

import { useMenuiseriesTypes, surfacesReference as menuiserieSurfacesReference } from "@/contexts/MenuiseriesTypesContext";
import { Client, useClients, typesClients } from "@/contexts/ClientsContext";
import { TypeMenuiserie } from "@/types";
import { surfacesReference } from "@/contexts/TravauxTypesContext";
import { surfacesMenuiseries } from "@/types";

const ServiceGroupForm = ({ open, onClose, group, onSubmit }) => {
  const [name, setName] = useState(group ? group.name : "");

  useEffect(() => {
    if (group) {
      setName(group.name);
    } else {
      setName("");
    }
  }, [group]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{group ? "Modifier le groupe" : "Ajouter un groupe"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nom</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onClose(false)}>Annuler</Button>
            <Button type="submit">{group ? "Mettre à jour" : "Ajouter"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const WorkTypeForm = ({ open, onClose, workType, onSubmit }) => {
  const [name, setName] = useState(workType ? workType.name : "");

  useEffect(() => {
    if (workType) {
      setName(workType.name);
    } else {
      setName("");
    }
  }, [workType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{workType ? "Modifier le type de travaux" : "Ajouter un type de travaux"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nom</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onClose(false)}>Annuler</Button>
            <Button type="submit">{workType ? "Mettre à jour" : "Ajouter"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ServiceForm = ({ open, onClose, service, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: service ? service.name : "",
    description: service ? service.description || "" : "",
    labor_price: service ? service.labor_price : 0,
    supply_price: service ? service.supply_price : 0
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description || "",
        labor_price: service.labor_price,
        supply_price: service.supply_price
      });
    } else {
      setFormData({
        name: "",
        description: "",
        labor_price: 0,
        supply_price: 0
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes("price") ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{service ? "Modifier le service" : "Ajouter un service"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nom</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="labor_price" className="text-right">Main d'œuvre (€)</Label>
              <Input
                id="labor_price"
                name="labor_price"
                type="number"
                step="0.01"
                value={formData.labor_price}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supply_price" className="text-right">Fournitures (€)</Label>
              <Input
                id="supply_price"
                name="supply_price"
                type="number"
                step="0.01"
                value={formData.supply_price}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onClose(false)}>Annuler</Button>
            <Button type="submit">{service ? "Mettre à jour" : "Ajouter"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

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
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [selectedWorkTypeId, setSelectedWorkTypeId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState<boolean>(false);
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(false);
  const [isLoadingMenuiseries, setIsLoadingMenuiseries] = useState<boolean>(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState<boolean>(false);
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
  const [companyFormOpen, setCompanyFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyType | null>(null);
  const [confirmDeleteCompanyOpen, setConfirmDeleteCompanyOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
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
    const loadCompanies = async () => {
      setIsLoadingCompanies(true);
      try {
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Erreur lors du chargement des sociétés:", error);
        toast.error("Impossible de charger les sociétés");
      } finally {
        setIsLoadingCompanies(false);
      }
    };
    
    if (activeTab === "companies") {
      loadCompanies();
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

  const handleAddCompany = () => {
    setEditingCompany(null);
    setCompanyFormOpen(true);
  };
  
  const handleEditCompany = (company: CompanyType) => {
    setEditingCompany(company);
    setCompanyFormOpen(true);
  };
  
  const handleDeleteCompany = (id: string) => {
    setCompanyToDelete(id);
    setConfirmDeleteCompanyOpen(true);
  };
  
  const confirmCompanyDelete = async () => {
    if (companyToDelete) {
      setIsLoadingCompanies(true);
      try {
        const success = await deleteCompany(companyToDelete);
        
        if (success) {
          setCompanies(prev => prev.filter(company => company.id !== companyToDelete));
          toast.success("Société supprimée avec succès");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Une erreur est survenue lors de la suppression");
      } finally {
        setIsLoadingCompanies(false);
        setConfirmDeleteCompanyOpen(false);
        setCompanyToDelete(null);
      }
    }
  };
  
  const handleSubmitCompany = async (companyData: CompanyType) => {
    setIsLoadingCompanies(true);
    
    try {
      if (editingCompany) {
        const { id, ...rest } = companyData;
        const updatedCompany = await updateCompany(id, rest);
        
        if (updatedCompany) {
          setCompanies(prev => prev.map(c => 
            c.id === editingCompany.id ? updatedCompany : c
          ));
          toast.success("Société mise à jour avec succès");
        }
      } else {
        const { id, ...rest } = companyData;
        const newCompany = await createCompany(rest);
        
        if (newCompany) {
          setCompanies(prev => [...prev, newCompany]);
          toast.success("Société ajoutée avec succès");
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'opération:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoadingCompanies(false);
      setCompanyFormOpen(false);
      setEditingCompany(null);
    }
  };

  return (
    <Layout
      title="Paramètres"
      subtitle="Gérez les types de travaux, de menuiseries, les clients, les sociétés et leurs paramètres"
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
          <TabsTrigger value="companies" className="flex-1">Fiches Sociétés</TabsTrigger>
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddService();
                                      }}
                                      disabled={isLoadingServices}
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
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditService(service);
                                                      }}
                                                    >
                                                      <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                      variant="ghost" 
                                                      size="sm"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteService(service.id);
                                                      }}
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
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              onClick={resetMenuiseriesToDefaults}
              className="flex items-center gap-2"
            >
              Réinitialiser aux valeurs par défaut
            </Button>
          </div>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Types de Menuiseries</span>
                <Button variant="outline" size="sm" onClick={handleAddTypeMenuiserie} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                  Ajouter
                </Button>
              </CardTitle>
              <CardDescription>
                Gérez les types de menuiseries et leurs paramètres
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingMenuiseries ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-2">
                  {menuiserieTypes.length > 0 ? (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/6">Nom</TableHead>
                            <TableHead className="w-1/8">Dimensions (cm)</TableHead>
                            <TableHead className="w-1/10">Surface (m²)</TableHead>
                            <TableHead className="w-1/8">Surface impactée</TableHead>
                            <TableHead className="w-1/3">Description</TableHead>
                            <TableHead className="w-1/10 text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {menuiserieTypes.map((type) => (
                            <TableRow key={type.id}>
                              <TableCell className="font-medium">{type.name}</TableCell>
                              <TableCell>{type.hauteur} × {type.largeur}</TableCell>
                              <TableCell>{((type.hauteur * type.largeur) / 10000).toFixed(2)}</TableCell>
                              <TableCell>{getSurfaceImpacteeLabel(type.surface_impactee)}</TableCell>
                              <TableCell className="truncate max-w-xs">{type.description || "-"}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
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
                                    onClick={() => handleDeleteTypeMenuiserie(type.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <Alert>
                      <AlertDescription>
                        Aucun type de menuiserie défini. Utilisez le bouton "Ajouter" pour créer un nouveau type.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients" className="mt-6">
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              onClick={resetClientsToDefaults}
              className="flex items-center gap-2"
            >
              Réinitialiser aux valeurs par défaut
            </Button>
          </div>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Fiches Clients</span>
                <Button variant="outline" size="sm" onClick={handleAddClient} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                  Ajouter
                </Button>
              </CardTitle>
              <CardDescription>
                Sélectionnez un client pour voir et gérer ses informations
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
                    {clients.map((client) => (
                      <div 
                        key={client.id}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${selectedClientId === client.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                        onClick={() => {
                          setSelectedClientId(client.id);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-gray-500" />
                          <span>{client.nom} {client.prenom}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClient(client);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClient(client.id);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {clients.length === 0 && (
                      <Alert>
                        <AlertDescription>
                          Aucun client défini. Utilisez le bouton "Ajouter" pour créer un nouveau client.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="companies" className="mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Fiches Sociétés</span>
                <Button variant="outline" size="sm" onClick={handleAddCompany} disabled={isLoadingCompanies}>
                  {isLoadingCompanies ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                  Ajouter
                </Button>
              </CardTitle>
              <CardDescription>
                Gérez les informations des sociétés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {isLoadingCompanies ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {companies.map((company) => (
                      <div 
                        key={company.id}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${selectedCompanyId === company.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                        onClick={() => {
                          setSelectedCompanyId(company.id);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-gray-500" />
                          <div>
                            <span className="font-medium">{company.name}</span>
                            {company.type && (
                              <span className="text-sm text-gray-500 ml-2">({company.type})</span>
                            )}
                            {company.email && (
                              <div className="text-xs text-gray-500">
                                {company.email}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCompany(company);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCompany(company.id);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {companies.length === 0 && (
                      <Alert>
                        <AlertDescription>
                          Aucune société définie. Utilisez le bouton "Ajouter" pour créer une nouvelle société.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <WorkTypeForm
        open={workTypeFormOpen}
        onClose={() => setWorkTypeFormOpen(false)}
        workType={editingWorkType}
        onSubmit={handleSubmitWorkType}
      />

      <ServiceGroupForm
        open={serviceGroupFormOpen}
        onClose={() => setServiceGroupFormOpen(false)}
        group={editingServiceGroup}
        onSubmit={handleSubmitServiceGroup}
      />

      <ServiceForm
        open={serviceFormOpen}
        onClose={() => setServiceFormOpen(false)}
        service={editingService}
        onSubmit={handleSubmitService}
      />

      <Dialog open={confirmDeleteWorkTypeOpen} onOpenChange={setConfirmDeleteWorkTypeOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce type de travaux ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteWorkTypeOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmWorkTypeDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDeleteGroupOpen} onOpenChange={setConfirmDeleteGroupOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteGroupOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmServiceGroupDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDeleteServiceOpen} onOpenChange={setConfirmDeleteServiceOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce service ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteServiceOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmServiceDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TypeMenuiserieForm
        isOpen={typeMenuiserieFormOpen}
        onClose={() => setTypeMenuiserieFormOpen(false)}
        typeToEdit={editingTypeMenuiserie}
        onSubmit={handleSubmitTypeMenuiserie}
      />
      
      <Dialog open={confirmDeleteMenuiserieOpen} onOpenChange={setConfirmDeleteMenuiserieOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce type de menuiserie ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteMenuiserieOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmTypeMenuiserieDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={clientFormOpen} onOpenChange={setClientFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingClient ? 'Modifier le client' : 'Ajouter un client'}</DialogTitle>
            <DialogDescription>
              {editingClient 
                ? 'Modifiez les informations du client ci-dessous.' 
                : 'Remplissez les informations pour ajouter un nouveau client.'}
            </DialogDescription>
          </DialogHeader>
          <ClientForm
            clientToEdit={editingClient}
            onClose={() => setClientFormOpen(false)}
            onSubmit={handleSubmitClient}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={confirmDeleteClientOpen} onOpenChange={setConfirmDeleteClientOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce client ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteClientOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmClientDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CompanyForm
        companyToEdit={editingCompany}
        onClose={() => setCompanyFormOpen(false)}
        onSubmit={handleSubmitCompany}
      />
      
      <Dialog open={confirmDeleteCompanyOpen} onOpenChange={setConfirmDeleteCompanyOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette société ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteCompanyOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmCompanyDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Parametres;
