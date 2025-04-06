
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
import { Room, Menuiserie, TypeMenuiserie } from "@/types";

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
    totalPlinthLength: "",
    totalPlinthSurface: "",
    totalMenuiserieSurface: "",
    netWallSurface: "",
    menuiseriesMursSurface: "0",
    menuiseriesPlafondSurface: "0",
    menuiseriesSolSurface: "0",
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
  const [editingRoom, setEditingRoom] = useState<string | null>(null);

  const propertyTypes = ["Appartement", "Maison", "Studio", "Loft", "Autre"];
  const roomTypes = ["Salon", "Chambre", "Cuisine", "Salle de bain", "Toilettes", "Bureau", "Entrée", "Couloir", "Autre"];

  // Détermine la surface impactée par défaut selon le type de menuiserie
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
    if (newRoom.length && newRoom.width && newRoom.menuiseries.length > 0) {
      const perimeter = 2 * (parseFloat(newRoom.length) + parseFloat(newRoom.width));
      
      // Isoler les menuiseries par surface impactée
      let menuiseriesMurs = newRoom.menuiseries.filter(m => 
        !m.surfaceImpactee || m.surfaceImpactee === "mur"
      );
      
      let menuiseriesPlafond = newRoom.menuiseries.filter(m => 
        m.surfaceImpactee === "plafond"
      );
      
      let menuiseriesSol = newRoom.menuiseries.filter(m => 
        m.surfaceImpactee === "sol"
      );
      
      // Calculer linéaire de plinthes (tenant compte des portes)
      let doorWidths = 0;
      menuiseriesMurs.forEach(item => {
        if ((item.type === "Porte" || item.type === "Porte-fenêtre" || item.impactePlinthe) && item.largeur) {
          doorWidths += (item.largeur / 100) * item.quantity;
        }
      });
      
      const plinthLength = arrondir2Decimales(perimeter - doorWidths).toString();
      const plinthSurface = arrondir2Decimales(parseFloat(plinthLength) * parseFloat(newRoom.plinthHeight)).toString();
      
      // Calcul des surfaces des menuiseries par type
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
      
      // Calcul des surfaces nettes
      const netWallSurface = arrondir2Decimales(parseFloat(newRoom.wallSurfaceRaw) - mursSurface - parseFloat(plinthSurface)).toString();
      const netCeilingSurface = arrondir2Decimales(parseFloat(newRoom.surface) - plafondSurface).toString();
      const netFloorSurface = arrondir2Decimales(parseFloat(newRoom.surface) - solSurface).toString();
      
      // Total des surfaces de menuiseries
      const totalMenuiserieSurface = arrondir2Decimales(mursSurface + plafondSurface + solSurface).toString();
      
      setNewRoom(prev => ({
        ...prev,
        totalPlinthLength: plinthLength,
        totalPlinthSurface: plinthSurface,
        totalMenuiserieSurface: totalMenuiserieSurface,
        menuiseriesMursSurface: arrondir2Decimales(mursSurface).toString(),
        menuiseriesPlafondSurface: arrondir2Decimales(plafondSurface).toString(),
        menuiseriesSolSurface: arrondir2Decimales(solSurface).toString(),
        netWallSurface: netWallSurface,
        surfaceNetteMurs: netWallSurface,
        surfaceNettePlafond: netCeilingSurface,
        surfaceNetteSol: netFloorSurface,
        lineaireNet: plinthLength
      }));
    }
  }, [newRoom.menuiseries, newRoom.length, newRoom.width, newRoom.height, newRoom.plinthHeight, newRoom.wallSurfaceRaw, newRoom.surface]);

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
      totalPlinthLength: "",
      totalPlinthSurface: "",
      totalMenuiserieSurface: "",
      netWallSurface: "",
      menuiseriesMursSurface: "0",
      menuiseriesPlafondSurface: "0",
      menuiseriesSolSurface: "0"
    });
    
    setEditingMenuiserie(null);
  };

  const handleEditRoom = (id: string) => {
    const roomToEdit = rooms.find((room) => room.id === id);
    if (roomToEdit) {
      setNewRoom(roomToEdit);
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
      totalPlinthLength: "",
      totalPlinthSurface: "",
      totalMenuiserieSurface: "",
      netWallSurface: "",
      menuiseriesMursSurface: "0",
      menuiseriesPlafondSurface: "0",
      menuiseriesSolSurface: "0"
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
                  onChange={handleRoomChange}
                  placeholder="Automatique"
                  disabled
                  className="mt-1 bg-gray-100"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                <Label htmlFor="surface">Surface au Sol (m²)</Label>
                <Input
                  id="surface"
                  name="surface"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newRoom.surface}
                  onChange={handleRoomChange}
                  readOnly
                  className="mt-1 bg-gray-100"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="height">Hauteur sous Plafond (m)</Label>
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
                <Label htmlFor="plinthHeight">Hauteur des Plinthes (m)</Label>
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
              
              <div>
                <Label htmlFor="wallSurfaceRaw">Surfaces des murs brutes (m²)</Label>
                <Input
                  id="wallSurfaceRaw"
                  name="wallSurfaceRaw"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newRoom.wallSurfaceRaw}
                  readOnly
                  className="mt-1 bg-gray-100"
                />
              </div>
            </div>
            
            <div className="mt-6 mb-4">
              <h4 className="text-md font-medium mb-3">Menuiseries</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 border p-3 rounded bg-white">
                <div>
                  <Label htmlFor="menuiserieType">Type</Label>
                  <select
                    id="menuiserieType"
                    name="type"
                    onChange={handleMenuiserieTypeChange}
                    className="w-full p-2 border rounded mt-1"
                  >
                    <option value="">Sélectionner un type</option>
                    {menuiseriesState.typesMenuiseries.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.nom}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="menuiserieName">Nom</Label>
                  <Input
                    id="menuiserieName"
                    name="name"
                    value={newMenuiserie.name}
                    onChange={handleMenuiserieChange}
                    placeholder="Optionnel"
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
                    step="1"
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
                    step="1"
                    value={newMenuiserie.hauteur}
                    onChange={handleMenuiserieChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="surfaceImpactee">Surface impactée</Label>
                  <select
                    id="surfaceImpactee"
                    name="surfaceImpactee"
                    value={newMenuiserie.surfaceImpactee || "mur"}
                    onChange={handleSurfaceImpacteeChange}
                    className="w-full p-2 border rounded mt-1"
                  >
                    <option value="mur">Mur</option>
                    <option value="plafond">Plafond</option>
                    <option value="sol">Sol</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="menuiserieQuantity">Quantité</Label>
                  <div className="flex items-end gap-2">
                    <Input
                      id="menuiserieQuantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={newMenuiserie.quantity}
                      onChange={handleMenuiserieChange}
                      className="mt-1"
                    />
                    <Button 
                      onClick={handleAddMenuiserie} 
                      size="sm" 
                      className="mb-0.5"
                    >
                      {editingMenuiserie ? "Mettre à jour" : "Ajouter"}
                    </Button>
                  </div>
                </div>
              </div>
              
              {newRoom.menuiseries.length > 0 && (
                <div className="mt-3 bg-white p-3 border rounded">
                  <h5 className="text-sm font-medium mb-2">Menuiseries ajoutées :</h5>
                  <div className="max-h-40 overflow-y-auto">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border px-2 py-1 text-left text-xs">Type</th>
                          <th className="border px-2 py-1 text-left text-xs">Nom</th>
                          <th className="border px-2 py-1 text-left text-xs">Dimensions</th>
                          <th className="border px-2 py-1 text-left text-xs">Surface</th>
                          <th className="border px-2 py-1 text-left text-xs">Surface impactée</th>
                          <th className="border px-2 py-1 text-left text-xs">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newRoom.menuiseries.map((item) => (
                          <tr key={item.id} className="border-t hover:bg-gray-50">
                            <td className="border px-2 py-1 text-sm">{item.type}</td>
                            <td className="border px-2 py-1 text-sm">{item.name}</td>
                            <td className="border px-2 py-1 text-sm">{item.largeur}cm × {item.hauteur}cm</td>
                            <td className="border px-2 py-1 text-sm">{item.surface} m²</td>
                            <td className="border px-2 py-1 text-sm capitalize">{item.surfaceImpactee || "mur"}</td>
                            <td className="border px-2 py-1">
                              <div className="flex space-x-1">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEditMenuiserie(item.id)}
                                  className="h-6 px-2 text-xs"
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Éditer
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  onClick={() => handleRemoveMenuiserie(item.id)}
                                  className="h-6 px-2 text-xs"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Supprimer
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {newRoom.menuiseries.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 border rounded">
                    <h5 className="text-sm font-medium mb-1">Longueur Totale des plinthes</h5>
                    <p className="text-lg font-semibold">{newRoom.totalPlinthLength || "0.00"} m</p>
                  </div>
                  <div className="bg-white p-3 border rounded">
                    <h5 className="text-sm font-medium mb-1">Surface Totale des plinthes</h5>
                    <p className="text-lg font-semibold">{newRoom.totalPlinthSurface || "0.00"} m²</p>
                  </div>
                  <div className="bg-white p-3 border rounded">
                    <h5 className="text-sm font-medium mb-1">Surface nette des murs</h5>
                    <p className="text-lg font-semibold">{newRoom.netWallSurface || "0.00"} m²</p>
                  </div>
                  <div className="bg-white p-3 border rounded">
                    <h5 className="text-sm font-medium mb-1">Surface nette du plafond</h5>
                    <p className="text-lg font-semibold">{newRoom.surfaceNettePlafond || "0.00"} m²</p>
                  </div>
                  <div className="bg-white p-3 border rounded">
                    <h5 className="text-sm font-medium mb-1">Surface des menuiseries murs</h5>
                    <p className="text-lg font-semibold">{newRoom.menuiseriesMursSurface || "0.00"} m²</p>
                  </div>
                  <div className="bg-white p-3 border rounded">
                    <h5 className="text-sm font-medium mb-1">Surface des menuiseries plafond</h5>
                    <p className="text-lg font-semibold">{newRoom.menuiseriesPlafondSurface || "0.00"} m²</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-4">
              <Button onClick={handleAddRoom} className="flex items-center">
                {editingRoom ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Mettre à jour
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter pièce
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {rooms.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Pièces ajoutées</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-left">
                      <th className="py-2 px-2 border">Nom</th>
                      <th className="py-2 px-2 border">Dimensions</th>
                      <th className="py-2 px-2 border">Surfaces (m²)</th>
                      <th className="py-2 px-2 border">Menuiseries</th>
                      <th className="py-2 px-2 border">Linéaires (m)</th>
                      <th className="py-2 px-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room.id} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-2 border font-medium">{room.name || `${room.type}${room.customName ? ` ${room.customName}` : ''}`}</td>
                        <td className="py-2 px-2 border">
                          <div className="text-xs">
                            <p>{room.length}m × {room.width}m × {room.height}m</p>
                            <p>Plinthes: {room.plinthHeight}m</p>
                          </div>
                        </td>
                        <td className="py-2 px-2 border">
                          <div className="text-xs space-y-1">
                            <div className="grid grid-cols-2 gap-x-2">
                              <p className="font-medium">Brutes:</p>
                              <p></p>
                              <p>Sol: {room.surface} m²</p>
                              <p>Plafond: {room.surface} m²</p>
                              <p>Murs: {room.wallSurfaceRaw} m²</p>
                              <p>Plinthes: {room.totalPlinthSurface || "0"} m²</p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2">
                              <p className="font-medium">Menuiseries:</p>
                              <p></p>
                              <p>Murs: {room.menuiseriesMursSurface || "0"} m²</p>
                              <p>Plafond: {room.menuiseriesPlafondSurface || "0"} m²</p>
                              <p>Sol: {room.menuiseriesSolSurface || "0"} m²</p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2">
                              <p className="font-medium">Nettes:</p>
                              <p></p>
                              <p>Sol: {room.surfaceNetteSol || room.surface} m²</p>
                              <p>Plafond: {room.surfaceNettePlafond || room.surface} m²</p>
                              <p>Murs: {room.netWallSurface} m²</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-2 border">
                          <div className="text-xs">
                            <p>{room.menuiseries.length} menuiserie(s)</p>
                            <p className="mt-1">Surface totale: {room.totalMenuiserieSurface || "0"} m²</p>
                          </div>
                        </td>
                        <td className="py-2 px-2 border">
                          <div className="text-xs">
                            <p>Brut: {room.lineaireBrut || (parseFloat(room.length) * 2 + parseFloat(room.width) * 2).toFixed(2)} m</p>
                            <p>Plinthes: {room.totalPlinthLength || "0"} m</p>
                          </div>
                        </td>
                        <td className="py-2 px-2 border">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditRoom(room.id)}
                              className="flex items-center"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Éditer
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteRoom(room.id)}
                              className="flex items-center"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Supprimer
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td className="py-2 px-4 border font-medium" colSpan={2}>
                        Surface totale:
                      </td>
                      <td className="py-2 px-4 border font-medium" colSpan={4}>
                        {calculateTotalArea()} m²
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RenovationEstimator;
