import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Check, Edit, Trash2, Plus, Home, Layout, ArrowDown, ArrowUp } from "lucide-react";
import { formaterPrix, formaterQuantite, arrondir2Decimales } from "@/lib/utils";

interface Room {
  id: string;
  name: string;
  customName: string;
  type: string;
  length: string;
  width: string;
  height: string;
  surface: string;
  plinthHeight: string;
  wallSurfaceRaw: string;
  menuiseries: Menuiserie[];
  totalPlinthLength: string;
  totalPlinthSurface: string;
  totalMenuiserieSurface: string;
  netWallSurface: string;
}

interface Menuiserie {
  id: string;
  type: string;
  name: string;
  largeur: string;
  hauteur: string;
  quantity: number;
  surface: string;
}

interface PropertyType {
  type: string;
  floors: string;
  totalArea: string;
  rooms: string;
  ceilingHeight: string;
}

const RenovationEstimator: React.FC = () => {
  const [property, setProperty] = useState<PropertyType>({
    type: "Appartement",
    floors: "1",
    totalArea: "",
    rooms: "",
    ceilingHeight: "",
  });

  const [newRoom, setNewRoom] = useState<Omit<Room, "id">>({
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
    netWallSurface: ""
  });

  const [newMenuiserie, setNewMenuiserie] = useState<Omit<Menuiserie, "id" | "surface">>({
    type: "Porte",
    name: "",
    largeur: "0.83",
    hauteur: "2.04",
    quantity: 1
  });

  const [editingMenuiserie, setEditingMenuiserie] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);

  const propertyTypes = ["Appartement", "Maison", "Studio", "Loft", "Autre"];
  const roomTypes = ["Salon", "Chambre", "Cuisine", "Salle de bain", "Toilettes", "Bureau", "Entrée", "Couloir", "Autre"];
  const menuiserieTypes = ["Porte", "Fenêtre", "Porte-fenêtre", "Autre"];

  const getStandardDimensions = (type: string) => {
    switch (type) {
      case "Porte":
        return { largeur: "0.83", hauteur: "2.04" };
      case "Fenêtre":
        return { largeur: "1.20", hauteur: "1.00" };
      case "Porte-fenêtre":
        return { largeur: "1.50", hauteur: "2.04" };
      default:
        return { largeur: "0.83", hauteur: "2.04" };
    }
  };

  const handlePropertyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleMenuiserieChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "type") {
      const standardDimensions = getStandardDimensions(value);
      setNewMenuiserie((prev) => ({ 
        ...prev, 
        [name]: value,
        largeur: standardDimensions.largeur,
        hauteur: standardDimensions.hauteur
      }));
    } else {
      setNewMenuiserie((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (newRoom.length && newRoom.width) {
      const calculatedSurface = arrondir2Decimales(parseFloat(newRoom.length) * parseFloat(newRoom.width)).toString();
      setNewRoom((prev) => ({ ...prev, surface: calculatedSurface }));
    }
  }, [newRoom.length, newRoom.width]);

  useEffect(() => {
    if (newRoom.length && newRoom.width && newRoom.height) {
      const perimeter = 2 * (parseFloat(newRoom.length) + parseFloat(newRoom.width));
      const wallSurface = arrondir2Decimales(perimeter * parseFloat(newRoom.height)).toString();
      setNewRoom((prev) => ({ ...prev, wallSurfaceRaw: wallSurface }));
    }
  }, [newRoom.length, newRoom.width, newRoom.height]);

  useEffect(() => {
    if (newRoom.length && newRoom.width && newRoom.menuiseries.length > 0) {
      const perimeter = 2 * (parseFloat(newRoom.length) + parseFloat(newRoom.width));
      let doorWidths = 0;
      
      newRoom.menuiseries.forEach(item => {
        if (item.type === "Porte" || item.type === "Porte-fenêtre") {
          doorWidths += parseFloat(item.largeur) * item.quantity;
        }
      });
      
      const plinthLength = arrondir2Decimales(perimeter - doorWidths).toString();
      
      const plinthSurface = arrondir2Decimales(parseFloat(plinthLength) * parseFloat(newRoom.plinthHeight)).toString();
      
      let menuiserieSurface = 0;
      newRoom.menuiseries.forEach(item => {
        menuiserieSurface += parseFloat(item.surface) * item.quantity;
      });
      
      const netWallSurface = arrondir2Decimales(parseFloat(newRoom.wallSurfaceRaw) - menuiserieSurface).toString();
      
      setNewRoom(prev => ({
        ...prev,
        totalPlinthLength: plinthLength,
        totalPlinthSurface: plinthSurface,
        totalMenuiserieSurface: arrondir2Decimales(menuiserieSurface).toString(),
        netWallSurface: netWallSurface
      }));
    }
  }, [newRoom.menuiseries, newRoom.length, newRoom.width, newRoom.height, newRoom.plinthHeight, newRoom.wallSurfaceRaw]);

  const handleAddMenuiserie = () => {
    if (editingMenuiserie) {
      const updatedMenuiseries = newRoom.menuiseries.map(item => 
        item.id === editingMenuiserie ? {
          ...newMenuiserie,
          id: editingMenuiserie,
          surface: arrondir2Decimales(parseFloat(newMenuiserie.largeur) * parseFloat(newMenuiserie.hauteur)).toString()
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
          surface: arrondir2Decimales(parseFloat(newMenuiserie.largeur) * parseFloat(newMenuiserie.hauteur)).toString()
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
      quantity: 1
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
        quantity: menuiserieToEdit.quantity
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
        quantity: 1
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
      setRooms((prev) =>
        prev.map((room) =>
          room.id === editingRoom
            ? { ...newRoom, id: editingRoom }
            : room
        )
      );
      setEditingRoom(null);
      toast.success("Pièce mise à jour avec succès");
    } else {
      const roomName = newRoom.name || `${newRoom.type}${newRoom.customName ? ` ${newRoom.customName}` : ''}`;
      setRooms((prev) => [
        ...prev,
        { ...newRoom, id: Date.now().toString(), name: roomName },
      ]);
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
      netWallSurface: ""
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
    
    setRooms((prev) => prev.filter((room) => room.id !== id));
    toast.success(`${roomName} supprimé avec succès`);
  };

  const calculateTotalArea = () => {
    return arrondir2Decimales(
      rooms.reduce((total, room) => total + parseFloat(room.surface || "0"), 0)
    ).toString();
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col items-center justify-center mb-8 gradient-header text-white p-6 rounded-lg">
        <h1 className="text-3xl md:text-4xl font-bold">
          Wizard Rénovation
        </h1>
        <p className="mt-2 text-lg">Estimez facilement vos projets de rénovation</p>
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
                  value={newRoom.name || `${newRoom.type}${newRoom.customName ? ` ${newRoom.customName}` : ''}`}
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
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 border p-3 rounded bg-white">
                <div>
                  <Label htmlFor="menuiserieType">Type</Label>
                  <select
                    id="menuiserieType"
                    name="type"
                    value={newMenuiserie.type}
                    onChange={handleMenuiserieChange}
                    className="w-full p-2 border rounded mt-1"
                  >
                    {menuiserieTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
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
                  <Label htmlFor="menuiserieLargeur">Largeur (m)</Label>
                  <Input
                    id="menuiserieLargeur"
                    name="largeur"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newMenuiserie.largeur}
                    onChange={handleMenuiserieChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="menuiserieHauteur">Hauteur (m)</Label>
                  <Input
                    id="menuiserieHauteur"
                    name="hauteur"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newMenuiserie.hauteur}
                    onChange={handleMenuiserieChange}
                    className="mt-1"
                  />
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
                          <th className="border px-2 py-1 text-left text-xs">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newRoom.menuiseries.map((item) => (
                          <tr key={item.id} className="border-t hover:bg-gray-50">
                            <td className="border px-2 py-1 text-sm">{item.type}</td>
                            <td className="border px-2 py-1 text-sm">{item.name}</td>
                            <td className="border px-2 py-1 text-sm">{item.largeur}m × {item.hauteur}m</td>
                            <td className="border px-2 py-1 text-sm">{item.surface} m²</td>
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
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <th className="py-2 px-4 border">Nom</th>
                      <th className="py-2 px-4 border">Dimensions</th>
                      <th className="py-2 px-4 border">Surface</th>
                      <th className="py-2 px-4 border">Menuiseries</th>
                      <th className="py-2 px-4 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room.id} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-4 border">{room.name || `${room.type}${room.customName ? ` ${room.customName}` : ''}`}</td>
                        <td className="py-2 px-4 border">
                          {room.length}m × {room.width}m × {room.height}m
                        </td>
                        <td className="py-2 px-4 border">{room.surface} m²</td>
                        <td className="py-2 px-4 border">
                          {room.menuiseries.length} menuiserie(s)
                        </td>
                        <td className="py-2 px-4 border">
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
                      <td className="py-2 px-4 border font-medium" colSpan={3}>
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
