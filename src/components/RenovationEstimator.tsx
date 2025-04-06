import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Check, Edit, Trash2, Plus, Home, Layout, ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { formaterPrix, formaterQuantite, arrondir2Decimales } from "@/lib/utils";
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
import { useProject } from "@/contexts/ProjectContext";
import { useMenuiseriesTypes } from "@/contexts/MenuiseriesTypesContext";
import { useAutresSurfaces } from "@/contexts/AutresSurfacesContext";
import AutreSurfaceForm from "@/features/renovation/components/AutreSurfaceForm";
import { Room, Menuiserie, TypeMenuiserie, AutreSurface } from "@/types";

const RenovationEstimator: React.FC = () => {
  const { state, dispatch } = useProject();
  const { property, rooms } = state;
  const { state: menuiseriesState } = useMenuiseriesTypes();

  const [newRoom, setNewRoom] = useState<Omit<Room, "id">>({
    name: "",
    customName: "",
    type: "Salon",
    length: "",
    width: "",
    height: property.ceilingHeight || "2.50",
    surface: "",
    plinthHeight: "0.1",
    wallSurfaceRaw: "",
    menuiseries: [],
    autresSurfaces: [],
    totalPlinthLength: "",
    totalPlinthSurface: "",
    totalMenuiserieSurface: "",
    netWallSurface: "",
    menuiseriesMursSurface: "0",
    menuiseriesPlafondSurface: "0",
    menuiseriesSolSurface: "0",
    autresSurfacesMurs: "0",
    autresSurfacesPlafond: "0",
    autresSurfacesSol: "0",
    surfaceNetteSol: "",
    surfaceBruteSol: "",
    surfaceNettePlafond: "",
    surfaceBrutePlafond: ""
  });

  const [newMenuiserie, setNewMenuiserie] = useState<Omit<Menuiserie, "id" | "surface">>({
    type: "Porte",
    name: "",
    largeur: 83,
    hauteur: 204,
    quantity: 1,
    surfaceImpactee: "mur"
  });

  const [editingMenuiserie, setEditingMenuiserie] = useState<string | null>(null);
  const [editingAutreSurface, setEditingAutreSurface] = useState<string | null>(null);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);

  const propertyTypes = ["Appartement", "Maison", "Studio", "Loft", "Autre"];
  const roomTypes = ["Salon", "Chambre", "Cuisine", "Salle de bain", "Toilettes", "Bureau", "Entrée", "Couloir", "Autre"];

  const getDefaultSurfaceImpactee = (type: string): string => {
    if (type.toLowerCase().includes("toit") || type.toLowerCase().includes("velux") || type.toLowerCase().includes("vélux")) {
      return "plafond";
    } else if (type.toLowerCase().includes("trappe") || type.toLowerCase().includes("sol")) {
      return "sol";
    } else {
      return "mur";
    }
  };

  const getStandardDimensions = (type: string) => {
    switch (type) {
      case "Porte":
        return { largeur: 83, hauteur: 204 };
      case "Fenêtre":
        return { largeur: 120, hauteur: 100 };
      case "Porte-fenêtre":
        return { largeur: 150, hauteur: 204 };
      default:
        return { largeur: 83, hauteur: 204 };
    }
  };

  const handlePropertyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch({ 
      type: 'UPDATE_PROPERTY', 
      payload: { [name]: value } 
    });
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleMenuiserieChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "type") {
      const standardDimensions = getStandardDimensions(value);
      const surfaceImpactee = getDefaultSurfaceImpactee(value);
      setNewMenuiserie((prev) => ({ 
        ...prev, 
        [name]: value,
        largeur: standardDimensions.largeur,
        hauteur: standardDimensions.hauteur,
        surfaceImpactee
      }));
    } else if (name === "largeur" || name === "hauteur" || name === "quantity") {
      setNewMenuiserie((prev) => ({ 
        ...prev, 
        [name]: parseFloat(value) || 0 
      }));
    } else {
      setNewMenuiserie((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMenuiserieTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const typeId = e.target.value;
    const selectedType = menuiseriesState.typesMenuiseries.find(type => type.id === typeId);
    
    if (selectedType) {
      const surfaceImpactee = getDefaultSurfaceImpactee(selectedType.nom);
      setNewMenuiserie((prev) => ({ 
        ...prev, 
        type: selectedType.nom,
        largeur: selectedType.largeur,
        hauteur: selectedType.hauteur,
        impactePlinthe: selectedType.impactePlinthe,
        surfaceImpactee
      }));
    }
  };

  const handleSurfaceImpacteeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setNewMenuiserie(prev => ({
      ...prev,
      surfaceImpactee: value
    }));
  };

  const generateRoomName = (type: string, customName: string = ""): string => {
    const roomTypeCount = rooms.filter(r => r.type === type).length + 1;
    const baseRoomName = `${type} ${roomTypeCount}`;
    return customName ? `${baseRoomName} (${customName})` : baseRoomName;
  };

  useEffect(() => {
    if (newRoom.length && newRoom.width) {
      const calculatedSurface = arrondir2Decimales(parseFloat(newRoom.length) * parseFloat(newRoom.width)).toString();
      setNewRoom((prev) => ({ 
        ...prev, 
        surface: calculatedSurface,
        surfaceBruteSol: calculatedSurface,
        surfaceNetteSol: calculatedSurface,
        surfaceBrutePlafond: calculatedSurface,
        surfaceNettePlafond: calculatedSurface
      }));
    }
  }, [newRoom.length, newRoom.width]);

  useEffect(() => {
    if (newRoom.length && newRoom.width && newRoom.height) {
      const perimeter = 2 * (parseFloat(newRoom.length) + parseFloat(newRoom.width));
      const wallSurface = arrondir2Decimales(perimeter * parseFloat(newRoom.height)).toString();
      setNewRoom((prev) => ({ 
        ...prev, 
        wallSurfaceRaw: wallSurface,
        surfaceBruteMurs: wallSurface,
        lineaireBrut: perimeter.toString()
      }));
    }
  }, [newRoom.length, newRoom.width, newRoom.height]);

  useEffect(() => {
    if (newRoom.length && newRoom.width && (newRoom.menuiseries.length > 0 || newRoom.autresSurfaces.length > 0)) {
      const perimeter = 2 * (parseFloat(newRoom.length) + parseFloat(newRoom.width));
      
      const menuiseriesMurs = newRoom.menuiseries.filter(m => 
        !m.surfaceImpactee || m.surfaceImpactee === "mur"
      );
      
      const menuiseriesPlafond = newRoom.menuiseries.filter(m => 
        m.surfaceImpactee === "plafond"
      );
      
      const menuiseriesSol = newRoom.menuiseries.filter(m => 
        m.surfaceImpactee === "sol"
      );
      
      const autresSurfacesMursAjout = newRoom.autresSurfaces.filter(s => 
        s.surfaceImpactee === "mur" && !s.estDeduction
      );
      
      const autresSurfacesMursDeduction = newRoom.autresSurfaces.filter(s => 
        s.surfaceImpactee === "mur" && s.estDeduction
      );
      
      const autresSurfacesPlafondAjout = newRoom.autresSurfaces.filter(s => 
        s.surfaceImpactee === "plafond" && !s.estDeduction
      );
      
      const autresSurfacesPlafondDeduction = newRoom.autresSurfaces.filter(s => 
        s.surfaceImpactee === "plafond" && s.estDeduction
      );
      
      const autresSurfacesSolAjout = newRoom.autresSurfaces.filter(s => 
        s.surfaceImpactee === "sol" && !s.estDeduction
      );
      
      const autresSurfacesSolDeduction = newRoom.autresSurfaces.filter(s => 
        s.surfaceImpactee === "sol" && s.estDeduction
      );
      
      let doorWidths = 0;
      menuiseriesMurs.forEach(item => {
        if ((item.type === "Porte" || item.type === "Porte-fenêtre" || item.impactePlinthe) && item.largeur) {
          doorWidths += (item.largeur / 100) * item.quantity;
        }
      });
      
      const plinthLength = arrondir2Decimales(perimeter - doorWidths).toString();
      const plinthSurface = arrondir2Decimales(parseFloat(plinthLength) * parseFloat(newRoom.plinthHeight)).toString();
      
      let mursSurface = 0;
      let plafondSurface = 0;
      let solSurface = 0;
      
      menuiseriesMurs.forEach(item => {
        mursSurface += item.surface * item.quantity;
      });
      
      menuiseriesPlafond.forEach(item => {
        plafondSurface += item.surface * item.quantity;
      });
      
      menuiseriesSol.forEach(item => {
        solSurface += item.surface * item.quantity;
      });
      
      let autresMursSurfaceAjout = 0;
      let autresMursSurfaceDeduction = 0;
      let autresPlafondSurfaceAjout = 0;
      let autresPlafondSurfaceDeduction = 0;
      let autresSolSurfaceAjout = 0;
      let autresSolSurfaceDeduction = 0;
      
      autresSurfacesMursAjout.forEach(item => {
        autresMursSurfaceAjout += item.surface * item.quantity;
      });
      
      autresSurfacesMursDeduction.forEach(item => {
        autresMursSurfaceDeduction += item.surface * item.quantity;
      });
      
      autresSurfacesPlafondAjout.forEach(item => {
        autresPlafondSurfaceAjout += item.surface * item.quantity;
      });
      
      autresSurfacesPlafondDeduction.forEach(item => {
        autresPlafondSurfaceDeduction += item.surface * item.quantity;
      });
      
      autresSurfacesSolAjout.forEach(item => {
        autresSolSurfaceAjout += item.surface * item.quantity;
      });
      
      autresSurfacesSolDeduction.forEach(item => {
        autresSolSurfaceDeduction += item.surface * item.quantity;
      });
      
      const netWallSurface = arrondir2Decimales(
        parseFloat(newRoom.wallSurfaceRaw) 
        - mursSurface 
        - parseFloat(plinthSurface) 
        + autresMursSurfaceAjout
        - autresMursSurfaceDeduction
      ).toString();
      
      const netCeilingSurface = arrondir2Decimales(
        parseFloat(newRoom.surface) 
        - plafondSurface
        + autresPlafondSurfaceAjout
        - autresPlafondSurfaceDeduction
      ).toString();
      
      const netFloorSurface = arrondir2Decimales(
        parseFloat(newRoom.surface) 
        - solSurface
        + autresSolSurfaceAjout
        - autresSolSurfaceDeduction
      ).toString();
      
      const totalMenuiserieSurface = arrondir2Decimales(mursSurface + plafondSurface + solSurface).toString();
      
      const totalAutresSurfacesMurs = arrondir2Decimales(autresMursSurfaceAjout + autresMursSurfaceDeduction).toString();
      const totalAutresSurfacesPlafond = arrondir2Decimales(autresPlafondSurfaceAjout + autresPlafondSurfaceDeduction).toString();
      const totalAutresSurfacesSol = arrondir2Decimales(autresSolSurfaceAjout + autresSolSurfaceDeduction).toString();
      
      setNewRoom(prev => ({
        ...prev,
        totalPlinthLength: plinthLength,
        totalPlinthSurface: plinthSurface,
        totalMenuiserieSurface: totalMenuiserieSurface,
        menuiseriesMursSurface: arrondir2Decimales(mursSurface).toString(),
        menuiseriesPlafondSurface: arrondir2Decimales(plafondSurface).toString(),
        menuiseriesSolSurface: arrondir2Decimales(solSurface).toString(),
        autresSurfacesMurs: totalAutresSurfacesMurs,
        autresSurfacesPlafond: totalAutresSurfacesPlafond,
        autresSurfacesSol: totalAutresSurfacesSol,
        netWallSurface: netWallSurface,
        surfaceNetteMurs: netWallSurface,
        surfaceNettePlafond: netCeilingSurface,
        surfaceNetteSol: netFloorSurface,
        lineaireNet: plinthLength
      }));
    }
  }, [newRoom.menuiseries, newRoom.autresSurfaces, newRoom.length, newRoom.width, newRoom.height, newRoom.plinthHeight, newRoom.wallSurfaceRaw, newRoom.surface]);

  useEffect(() => {
    setNewRoom(prev => ({
      ...prev,
      height: property.ceilingHeight || "2.50"
    }));
  }, [property.ceilingHeight]);

  const handleAddMenuiserie = () => {
    if (editingMenuiserie) {
      const surfaceM2 = arrondir2Decimales((newMenuiserie.largeur / 100) * (newMenuiserie.hauteur / 100));
      
      const updatedMenuiseries = newRoom.menuiseries.map(item => 
        item.id === editingMenuiserie ? {
          ...newMenuiserie,
          id: editingMenuiserie,
          surface: surfaceM2,
          surfaceImpactee: newMenuiserie.surfaceImpactee || getDefaultSurfaceImpactee(newMenuiserie.type)
        } : item
      );
      
      setNewRoom(prev => ({
        ...prev,
        menuiseries: updatedMenuiseries
      }));
      
      setEditingMenuiserie(null);
      toast.success("Menuiserie mise à jour");
    } else {
      const typeCount = newRoom.menuiseries
        .filter(m => m.type === newMenuiserie.type)
        .reduce((sum, item) => sum + item.quantity, 0);
      
      const menuiserieItems: Menuiserie[] = [];
      const surfaceM2 = arrondir2Decimales((newMenuiserie.largeur / 100) * (newMenuiserie.hauteur / 100));
      
      for (let i = 0; i < newMenuiserie.quantity; i++) {
        const itemNumber = typeCount + i + 1;
        const autoName = `${newMenuiserie.type} ${itemNumber}`;
        
        menuiserieItems.push({
          id: Date.now().toString() + i,
          type: newMenuiserie.type,
          name: newMenuiserie.name || autoName,
          largeur: newMenuiserie.largeur,
          hauteur: newMenuiserie.hauteur,
          quantity: 1,
          surface: surfaceM2,
          surfaceImpactee: newMenuiserie.surfaceImpactee || getDefaultSurfaceImpactee(newMenuiserie.type),
          impactePlinthe: newMenuiserie.impactePlinthe
        });
      }
      
      setNewRoom(prev => ({
        ...prev,
        menuiseries: [...prev.menuiseries, ...menuiserieItems]
      }));
      
      toast.success(`${newMenuiserie.quantity} ${newMenuiserie.type}${newMenuiserie.quantity > 1 ? 's' : ''} ajouté${newMenuiserie.quantity > 1 ? 's' : ''}`);
    }
    
    setNewMenuiserie({
      type: newMenuiserie.type,
      name: "",
      largeur: getStandardDimensions(newMenuiserie.type).largeur,
      hauteur: getStandardDimensions(newMenuiserie.type).hauteur,
      quantity: 1,
      surfaceImpactee: getDefaultSurfaceImpactee(newMenuiserie.type)
    });
  };

  const handleAddAutreSurface = (autreSurface: Omit<AutreSurface, "id" | "surface">) => {
    const surfaceM2 = arrondir2Decimales(autreSurface.largeur * autreSurface.hauteur);
    
    if (editingAutreSurface) {
      const updatedSurfaces = newRoom.autresSurfaces.map(item => 
        item.id === editingAutreSurface ? {
          ...autreSurface,
          id: editingAutreSurface,
          surface: surfaceM2
        } : item
      );
      
      setNewRoom(prev => ({
        ...prev,
        autresSurfaces: updatedSurfaces
      }));
      
      setEditingAutreSurface(null);
      toast.success("Surface mise à jour");
    } else {
      const typeCount = newRoom.autresSurfaces
        .filter(s => s.type === autreSurface.type)
        .reduce((sum, item) => sum + item.quantity, 0);
      
      const surfaceItems: AutreSurface[] = [];
      
      for (let i = 0; i < autreSurface.quantity; i++) {
        const itemNumber = typeCount + i + 1;
        const autoName = `${autreSurface.type} ${itemNumber}`;
        
        surfaceItems.push({
          id: Date.now().toString() + i,
          type: autreSurface.type,
          name: autreSurface.name || autoName,
          largeur: autreSurface.largeur,
          hauteur: autreSurface.hauteur,
          quantity: 1,
          surface: surfaceM2,
          surfaceImpactee: autreSurface.surfaceImpactee,
          estDeduction: autreSurface.estDeduction
        });
      }
      
      setNewRoom(prev => ({
        ...prev,
        autresSurfaces: [...prev.autresSurfaces, ...surfaceItems]
      }));
      
      toast.success(`${autreSurface.quantity} ${autreSurface.type}${autreSurface.quantity > 1 ? 's' : ''} ajouté${autreSurface.quantity > 1 ? 's' : ''}`);
    }
  };

  const handleEditMenuiserie = (menuiserieId: string) => {
    const menuiserieToEdit = newRoom.menuiseries.find(item => item.id === menuiserieId);
    
    if (menuiserieToEdit) {
      setNewMenuiserie({
        type: menuiserieToEdit.type,
        name: menuiserieToEdit.name,
        largeur: menuiserieToEdit.largeur,
        hauteur: menuiserieToEdit.hauteur,
        quantity: menuiserieToEdit.quantity,
        surfaceImpactee: menuiserieToEdit.surfaceImpactee || getDefaultSurfaceImpactee(menuiserieToEdit.type),
        impactePlinthe: menuiserieToEdit.impactePlinthe
      });
      
      setEditingMenuiserie(menuiserieId);
      toast("Édition de menuiserie en cours");
    }
  };

  const handleEditAutreSurface = (surfaceId: string) => {
    const surfaceToEdit = newRoom.autresSurfaces.find(item => item.id === surfaceId);
    
    if (surfaceToEdit) {
      setEditingAutreSurface(surfaceId);
      toast("Édition de surface en cours");
    }
  };

  const getCurrentAutreSurface = (): Omit<AutreSurface, "id" | "surface"> | null => {
    if (!editingAutreSurface) return null;
    
    const surfaceToEdit = newRoom.autresSurfaces.find(item => item.id === editingAutreSurface);
    if (!surfaceToEdit) return null;
    
    return {
      type: surfaceToEdit.type,
      name: surfaceToEdit.name,
      largeur: surfaceToEdit.largeur,
      hauteur: surfaceToEdit.hauteur,
      quantity: surfaceToEdit.quantity,
      surfaceImpactee: surfaceToEdit.surfaceImpactee,
      estDeduction: surfaceToEdit.estDeduction
    };
  };

  const handleCancelEditAutreSurface = () => {
    setEditingAutreSurface(null);
  };

  const handleRemoveMenuiserie = (menuiserieId: string) => {
    if (editingMenuiserie === menuiserieId) {
      setEditingMenuiserie(null);
      
      setNewMenuiserie({
        type: newMenuiserie.type,
        name: "",
        largeur: getStandardDimensions(newMenuiserie.type).largeur,
        hauteur: getStandardDimensions(newMenuiserie.type).hauteur,
        quantity: 1,
        surfaceImpactee: getDefaultSurfaceImpactee(newMenuiserie.type)
      });
    }
    
    setNewRoom(prev => ({
      ...prev,
      menuiseries: prev.menuiseries.filter(item => item.id !== menuiserieId)
    }));
    
    toast.success("Menuiserie supprimée");
  };

  const handleRemoveAutreSurface = (surfaceId: string) => {
    if (editingAutreSurface === surfaceId) {
      setEditingAutreSurface(null);
    }
    
    setNewRoom(prev => ({
      ...prev,
      autresSurfaces: prev.autresSurfaces.filter(item => item.id !== surfaceId)
    }));
    
    toast.success("Surface supprimée");
  };

  const handleAddRoom = () => {
    if (!newRoom.length || !newRoom.width || !newRoom.height) {
      toast.error("Veuillez remplir toutes les dimensions de la pièce");
      return;
    }

    if (editingRoom) {
      dispatch({
        type: 'UPDATE_ROOM',
        payload: {
          id: editingRoom,
          room: { ...newRoom, id: editingRoom }
        }
      });
      setEditingRoom(null);
      toast.success("Pièce mise à jour avec succès");
    } else {
      const roomName = generateRoomName(newRoom.type, newRoom.customName);
      const newRoomWithId = { 
        ...newRoom, 
        id: Date.now().toString(), 
        name: roomName 
      };
      
      dispatch({
        type: 'ADD_ROOM',
        payload: newRoomWithId
      });
      
      toast.success(`${roomName} ajouté avec succès`);
    }
    
    setNewRoom({
      name: "",
      customName: "",
      type: "Salon",
      length: "",
      width: "",
      height: "2.50",
      surface: "",
      plinthHeight: "0.1",
      wallSurfaceRaw: "",
      menuiseries: [],
      autresSurfaces: [],
      totalPlinthLength: "",
      totalPlinthSurface: "",
      totalMenuiserieSurface: "",
      netWallSurface: "",
      menuiseriesMursSurface: "0",
      menuiseriesPlafondSurface: "0",
      menuiseriesSolSurface: "0",
      autresSurfacesMurs: "0",
      autresSurfacesPlafond: "0",
      autresSurfacesSol: "0"
    });
    
    setEditingMenuiserie(null);
    setEditingAutreSurface(null);
  };

  const handleEditRoom = (id: string) => {
    const roomToEdit = rooms.find((room) => room.id === id);
    if (roomToEdit) {
      const roomWithAutresSurfaces = {
        ...roomToEdit,
        autresSurfaces: roomToEdit.autresSurfaces || []
      };
      
      setNewRoom(roomWithAutresSurfaces);
      setEditingRoom(id);
      toast("Édition de pièce en cours", {
        description: `Modifiez les détails de ${roomToEdit.name || roomToEdit.type}`,
      });
    }
  };

  const handleDeleteRoom = (id: string) => {
    const roomToDelete = rooms.find(room => room.id === id);
    const roomName = roomToDelete ? (roomToDelete.name || roomToDelete.type) : "la pièce";
    
    dispatch({
      type: 'DELETE_ROOM',
      payload: id
    });
    
    toast.success(`${roomName} supprimé avec succès`);
  };

  const calculateTotalArea = () => {
    return arrondir2Decimales(
      rooms.reduce((total, room) => total + parseFloat(room.surface || "0"), 0)
    ).toString();
  };

  const resetProject = () => {
    dispatch({ type: 'RESET_PROJECT' });
    
    setNewRoom({
      name: "",
      customName: "",
      type: "Salon",
      length: "",
      width: "",
      height: "2.50",
      surface: "",
      plinthHeight: "0.1",
      wallSurfaceRaw: "",
      menuiseries: [],
      autresSurfaces: [],
      totalPlinthLength: "",
      totalPlinthSurface: "",
      totalMenuiserieSurface: "",
      netWallSurface: "",
      menuiseriesMursSurface: "0",
      menuiseriesPlafondSurface: "0",
      menuiseriesSolSurface: "0",
      autresSurfacesMurs: "0",
      autresSurfacesPlafond: "0",
      autresSurfacesSol: "0"
    });
    
    setNewMenuiserie({
      type: "Porte",
      name: "",
      largeur: 83,
      hauteur: 204,
      quantity: 1,
      surfaceImpactee: "mur"
    });
    
    setEditingRoom(null);
    setEditingMenuiserie(null);
    setEditingAutreSurface(null);
    
    toast.success("Projet réinitialisé avec succès");
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      
      <div className="flex flex-col items-center justify-center mb-8 gradient-header text-white p-6 rounded-lg">
        <h1 className="text-3xl md:text-4xl font-bold">
          Wizard Rénovation
        </h1>
        <p className="mt-2 text-lg">Estimez facilement vos projets de rénovation</p>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="reset" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Nouveau projet
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr de vouloir créer un nouveau projet ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action va réinitialiser toutes les données de votre projet actuel.
                Toutes les pièces et travaux associés seront supprimés.
                Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={resetProject} className="bg-orange-500 hover:bg-orange-600">
                Réinitialiser
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card className="mb-8 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Home className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">Type de bien à rénover</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                name="type"
                value={property.type}
                onChange={handlePropertyChange}
                className="w-full p-2 border rounded mt-1"
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="floors">Nombre de niveaux</Label>
              <Input
                id="floors"
                name="floors"
                type="number"
                min="1"
                value={property.floors}
                onChange={handlePropertyChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="totalArea">Surface Totale (m²)</Label>
              <Input
                id="totalArea"
                name="totalArea"
                type="number"
                min="0"
                value={property.totalArea}
                onChange={handlePropertyChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="rooms">Nombre de Pièces</Label>
              <Input
                id="rooms"
                name="rooms"
                type="number"
                min="0"
                value={property.rooms}
                onChange={handlePropertyChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="ceilingHeight">Hauteur sous Plafond (m)</Label>
              <Input
                id="ceilingHeight"
                name="ceilingHeight"
                type="number"
                min="0"
                step="0.01"
                value={property.ceilingHeight}
                onChange={handlePropertyChange}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Layout className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">Pièces à rénover</h2>
          </div>
          
          <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              {editingRoom ? "Modifier la pièce" : "Ajouter une pièce"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="roomType"
                  name="type"
                  value={newRoom.type}
                  onChange={handleRoomChange}
                  className="w-full p-2 border rounded mt-1"
                >
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="customName">Personnaliser nom de la pièce</Label>
                <Input
                  id="customName"
                  name="customName"
                  value={newRoom.customName}
                  onChange={handleRoomChange}
                  placeholder="Optionnel"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  name="name"
                  value={editingRoom ? newRoom.name : generateRoomName(newRoom.type, newRoom.customName)}
                  readOnly
                  className="mt-1 bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Label htmlFor="length">Longueur (m)</Label>
                <Input
                  id="length"
                  name="length"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newRoom.length}
                  onChange={handleRoomChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="width">Largeur (m)</Label>
                <Input
                  id="width"
                  name="width"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newRoom.width}
                  onChange={handleRoomChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="height">Hauteur (m)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newRoom.height}
                  onChange={handleRoomChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="plinthHeight">Hauteur des plinthes (m)</Label>
                <Input
                  id="plinthHeight"
                  name="plinthHeight"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newRoom.plinthHeight}
                  onChange={handleRoomChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="surface">Surface au sol (m²)</Label>
                <Input
                  id="surface"
                  name="surface"
                  type="number"
                  value={newRoom.surface}
                  readOnly
                  className="mt-1 bg-gray-100"
                />
              </div>
              
              <div>
                <Label htmlFor="wallSurfaceRaw">Surface murale brute (m²)</Label>
                <Input
                  id="wallSurfaceRaw"
                  name="wallSurfaceRaw"
                  type="number"
                  value={newRoom.wallSurfaceRaw}
                  readOnly
                  className="mt-1 bg-gray-100"
                />
              </div>
              
              <div>
                <Label htmlFor="totalPlinthLength">Linéaire de plinthes (m)</Label>
                <Input
                  id="totalPlinthLength"
                  name="totalPlinthLength"
                  type="number"
                  value={newRoom.totalPlinthLength}
                  readOnly
                  className="mt-1 bg-gray-100"
                />
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Menuiseries</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                <div className="md:col-span-2">
                  <Label htmlFor="menuiserieType">Type de menuiserie</Label>
                  <select
                    id="menuiserieType"
                    name="type"
                    value={newMenuiserie.type}
                    onChange={handleMenuiserieChange}
                    className="w-full p-2 border rounded mt-1"
                  >
                    <option value="Porte">Porte</option>
                    <option value="Fenêtre">Fenêtre</option>
                    <option value="Porte-fenêtre">Porte-fenêtre</option>
                    <option value="Fenêtre de toit">Fenêtre de toit</option>
                    <option value="Baie vitrée">Baie vitrée</option>
                    <option value="Puits de lumière">Puits de lumière</option>
                    <option value="Trappe d'accès">Trappe d'accès</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="menuiserieTypeFromDB">Ou sélectionner un type prédéfini</Label>
                  <select
                    id="menuiserieTypeFromDB"
                    name="menuiserieTypeFromDB"
                    defaultValue=""
                    onChange={handleMenuiserieTypeChange}
                    className="w-full p-2 border rounded mt-1"
                  >
                    <option value="">-- Sélectionner --</option>
                    {menuiseriesState.typesMenuiseries.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.nom} ({type.largeur}×{type.hauteur} cm)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="menuiserieImpact">Surface impactée</Label>
                  <select
                    id="menuiserieImpact"
                    name="surfaceImpactee"
                    value={newMenuiserie.surfaceImpactee || 'mur'}
                    onChange={handleSurfaceImpacteeChange}
                    className="w-full p-2 border rounded mt-1"
                  >
                    <option value="mur">Mur</option>
                    <option value="plafond">Plafond</option>
                    <option value="sol">Sol</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <Label htmlFor="menuiserieName">Nom (optionnel)</Label>
                  <Input
                    id="menuiserieName"
                    name="name"
                    value={newMenuiserie.name}
                    onChange={handleMenuiserieChange}
                    placeholder="Ex: Porte d'entrée"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="menuiserieLargeur">Largeur (cm)</Label>
                  <Input
                    id="menuiserieLargeur"
                    name="largeur"
                    type="number"
                    min="0"
                    value={newMenuiserie.largeur}
                    onChange={handleMenuiserieChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="menuiserieHauteur">Hauteur (cm)</Label>
                  <Input
                    id="menuiserieHauteur"
                    name="hauteur"
                    type="number"
                    min="0"
                    value={newMenuiserie.hauteur}
                    onChange={handleMenuiserieChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="menuiserieQuantity">Quantité</Label>
                  <Input
                    id="menuiserieQuantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={newMenuiserie.quantity}
                    onChange={handleMenuiserieChange}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={handleAddMenuiserie} 
                    className="w-full"
                  >
                    {editingMenuiserie ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Mettre à jour
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {newRoom.menuiseries.length > 0 && (
                <div className="mt-4 border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surface</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qté</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {newRoom.menuiseries.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.largeur} × {item.hauteur} cm</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.surface} m²</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {item.surfaceImpactee === 'mur' ? 'Mur' : 
                             item.surfaceImpactee === 'plafond' ? 'Plafond' : 'Sol'}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditMenuiserie(item.id)}
                              className="mr-1 h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Modifier</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMenuiserie(item.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Supprimer</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Autres Surfaces</h3>
              
              <AutreSurfaceForm
                onSubmit={handleAddAutreSurface}
                currentAutreSurface={getCurrentAutreSurface()}
                onCancel={handleCancelEditAutreSurface}
                typesAutresSurfaces={useAutresSurfaces().state.typesAutresSurfaces}
              />
              
              {newRoom.autresSurfaces.length > 0 && (
                <div className="mt-4 border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surface</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qté</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opération</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {newRoom.autresSurfaces.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.largeur} × {item.hauteur} m</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.surface} m²</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {item.surfaceImpactee === 'mur' ? 'Mur' : 
                             item.surfaceImpactee === 'plafond' ? 'Plafond' : 'Sol'}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {item.estDeduction ? 'Déduction' : 'Ajout'}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditAutreSurface(item.id)}
                              className="mr-1 h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Modifier</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAutreSurface(item.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Supprimer</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleAddRoom} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editingRoom ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Mettre à jour la pièce
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter la pièce
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {rooms.length > 0 && (
            <div className="border rounded-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surface brute</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menuiseries</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{room.name}</div>
                        <div className="text-sm text-gray-500">{room.type}</div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{room.length} × {room.width} × {room.height} m</div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-sm text-gray-900">Sol: {room.surface} m²</div>
                        <div className="text-sm text-gray-900">Murs: {room.wallSurfaceRaw} m²</div>
                        <div className="text-sm text-gray-900">Plafond: {room.surface} m²</div>
                        <div className="text-sm text-gray-500 mt-2">Linéaire: {room.lineaireBrut || (2 * (parseFloat(room.length) + parseFloat(room.width))).toFixed(2)} m</div>
                        <div className="text-sm text-gray-500">Plinthes: {room.totalPlinthLength} m ({room.totalPlinthSurface} m²)</div>
                        <div className="text-sm text-gray-500">Menuiseries Murs: {room.menuiseriesMursSurface} m²</div>
                        <div className="text-sm text-gray-500">Menuiseries Plafond: {room.menuiseriesPlafondSurface} m²</div>
                        <div className="text-sm text-gray-500">Menuiseries Sol: {room.menuiseriesSolSurface} m²</div>
                        <div className="text-sm text-gray-500">Autres Murs: {room.autresSurfacesMurs} m²</div>
                        <div className="text-sm text-gray-500">Autres Plafond: {room.autresSurfacesPlafond} m²</div>
                        <div className="text-sm text-gray-500">Autres Sol: {room.autresSurfacesSol} m²</div>
                        <div className="text-sm font-semibold text-gray-900 mt-2">Surface Nette Sol: {room.surfaceNetteSol} m²</div>
                        <div className="text-sm font-semibold text-gray-900">Surface Nette Murs: {room.netWallSurface} m²</div>
                        <div className="text-sm font-semibold text-gray-900">Surface Nette Plafond: {room.surfaceNettePlafond} m²</div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {room.menuiseries.length} menuiseries
                        <div className="text-xs mt-1">
                          {room.menuiseries.map((m, i) => (
                            <div key={i}>
                              {m.name}: {m.largeur}×{m.hauteur} cm ({m.surface} m²)
                            </div>
                          ))}
                        </div>
                        <div className="mt-2">
                          {room.autresSurfaces.length} autres surfaces
                        </div>
                        <div className="text-xs mt-1">
                          {room.autresSurfaces.map((s, i) => (
                            <div key={i}>
                              {s.name}: {s.largeur}×{s.hauteur} m ({s.surface} m²)
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRoom(room.id)}
                          className="mr-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Supprimer
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette pièce ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action supprimera définitivement la pièce "{room.name}" et toutes les données associées.
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteRoom(room.id)} className="bg-red-500 hover:bg-red-600">
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {rooms.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md flex justify-between items-center">
              <div>
                <span className="font-medium">Surface totale des pièces : </span>
                <span className="text-xl font-bold">{calculateTotalArea()} m²</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RenovationEstimator;
