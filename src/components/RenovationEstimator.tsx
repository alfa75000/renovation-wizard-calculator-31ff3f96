import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Check, Edit, Trash2, Plus, Home, Paint, Layout, ArrowDown, ArrowUp } from "lucide-react";

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
  doors: number;
  windows: number;
  paint: {
    walls: boolean;
    ceiling: boolean;
    woodwork: boolean;
  };
  floor: {
    type: string;
    removal: boolean;
  };
  menuiseries: Menuiserie[];
}

interface Menuiserie {
  id: string;
  type: string;
  largeur: string;
  hauteur: string;
  quantity: number;
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
    doors: 1,
    windows: 0,
    paint: {
      walls: true,
      ceiling: true,
      woodwork: true,
    },
    floor: {
      type: "Parquet",
      removal: false,
    },
    menuiseries: []
  });

  const [newMenuiserie, setNewMenuiserie] = useState<Omit<Menuiserie, "id">>({
    type: "Porte",
    largeur: "0.83",
    hauteur: "2.04",
    quantity: 1
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [showAllSections, setShowAllSections] = useState(true);

  const propertyTypes = ["Appartement", "Maison", "Studio", "Loft", "Autre"];
  const roomTypes = ["Salon", "Chambre", "Cuisine", "Salle de bain", "Toilettes", "Bureau", "Entrée", "Couloir", "Autre"];
  const flooringTypes = ["Parquet", "Carrelage", "Moquette", "Vinyle", "Béton ciré", "Autre"];
  const menuiserieTypes = ["Porte", "Fenêtre", "Porte-fenêtre", "Placard", "Volet", "Autre"];

  const handlePropertyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setNewRoom((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value === "true" ? true : value === "false" ? false : value,
        },
      }));
    } else {
      setNewRoom((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMenuiserieChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMenuiserie((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setNewRoom((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: checked,
        },
      }));
    } else {
      setNewRoom((prev) => ({ ...prev, [name]: checked }));
    }
  };

  useEffect(() => {
    if (newRoom.length && newRoom.width) {
      const calculatedSurface = (parseFloat(newRoom.length) * parseFloat(newRoom.width)).toFixed(2);
      setNewRoom((prev) => ({ ...prev, surface: calculatedSurface }));
    }
  }, [newRoom.length, newRoom.width]);

  useEffect(() => {
    if (newRoom.length && newRoom.width && newRoom.height) {
      const perimeter = 2 * (parseFloat(newRoom.length) + parseFloat(newRoom.width));
      const wallSurface = (perimeter * parseFloat(newRoom.height)).toFixed(2);
      setNewRoom((prev) => ({ ...prev, wallSurfaceRaw: wallSurface }));
    }
  }, [newRoom.length, newRoom.width, newRoom.height]);

  const handleAddMenuiserie = () => {
    const menuiserieItem = {
      ...newMenuiserie,
      id: Date.now().toString()
    };
    
    setNewRoom(prev => ({
      ...prev,
      menuiseries: [...prev.menuiseries, menuiserieItem]
    }));
    
    setNewMenuiserie({
      type: newMenuiserie.type,
      largeur: "0.83",
      hauteur: "2.04",
      quantity: 1
    });
    
    toast.success(`${menuiserieItem.type} ajouté`);
  };

  const handleRemoveMenuiserie = (menuiserieId: string) => {
    setNewRoom(prev => ({
      ...prev,
      menuiseries: prev.menuiseries.filter(item => item.id !== menuiserieId)
    }));
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
      doors: 1,
      windows: 0,
      paint: {
        walls: true,
        ceiling: true,
        woodwork: true,
      },
      floor: {
        type: "Parquet",
        removal: false,
      },
      menuiseries: []
    });
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
    return rooms
      .reduce((total, room) => total + parseFloat(room.surface || "0"), 0)
      .toFixed(2);
  };

  const calculatePaintNeeded = (surface: number) => {
    return ((surface * 0.25) / 10).toFixed(2);
  };

  const toggleSections = () => {
    setShowAllSections(!showAllSections);
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
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 border p-3 rounded bg-white">
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
                      Ajouter
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
                          <th className="border px-2 py-1 text-left text-xs">Dimensions</th>
                          <th className="border px-2 py-1 text-left text-xs">Qté</th>
                          <th className="border px-2 py-1 text-left text-xs">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newRoom.menuiseries.map((item) => (
                          <tr key={item.id} className="border-t hover:bg-gray-50">
                            <td className="border px-2 py-1 text-sm">{item.type}</td>
                            <td className="border px-2 py-1 text-sm">{item.largeur}m × {item.hauteur}m</td>
                            <td className="border px-2 py-1 text-sm">{item.quantity}</td>
                            <td className="border px-2 py-1">
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleRemoveMenuiserie(item.id)}
                                className="h-6 px-2 text-xs"
                              >
                                Supprimer
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <Label htmlFor="floor.type">Type de sol</Label>
                <select
                  id="floorType"
                  name="floor.type"
                  value={newRoom.floor.type}
                  onChange={handleRoomChange}
                  className="w-full p-2 border rounded mt-1"
                >
                  {flooringTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="floorRemoval"
                  name="floor.removal"
                  checked={newRoom.floor.removal}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="floorRemoval">Dépose de l'ancien sol</Label>
              </div>
            </div>
            
            <h4 className="text-md font-medium mt-4 mb-2">Peinture à prévoir</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="paintWalls"
                  name="paint.walls"
                  checked={newRoom.paint.walls}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="paintWalls">Murs</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="paintCeiling"
                  name="paint.ceiling"
                  checked={newRoom.paint.ceiling}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="paintCeiling">Plafond</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="paintWoodwork"
                  name="paint.woodwork"
                  checked={newRoom.paint.woodwork}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="paintWoodwork">Boiseries</Label>
              </div>
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

      {rooms.length > 0 && (
        <div className="flex justify-center mb-4">
          <Button 
            variant="outline" 
            onClick={toggleSections}
            className="flex items-center"
          >
            {showAllSections ? (
              <>
                <ArrowUp className="h-4 w-4 mr-2" />
                Masquer les détails
              </>
            ) : (
              <>
                <ArrowDown className="h-4 w-4 mr-2" />
                Afficher tous les détails
              </>
            )}
          </Button>
        </div>
      )}

      {rooms.length > 0 && showAllSections && (
        <>
          <Card className="mb-8 shadow-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Récapitulatif des surfaces et volumes</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-md room-card">
                  <h3 className="font-medium">Surface au sol totale</h3>
                  <p className="text-2xl">{calculateTotalArea()} m²</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md room-card">
                  <h3 className="font-medium">Surface des murs à peindre</h3>
                  <p className="text-2xl">
                    {rooms
                      .reduce(
                        (total, room) =>
                          total +
                          (room.paint.walls
                            ? parseFloat(room.wallSurfaceRaw || "0")
                            : 0),
                        0
                      )
                      .toFixed(2)}{" "}
                    m²
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md room-card">
                  <h3 className="font-medium">Surface des plafonds</h3>
                  <p className="text-2xl">
                    {rooms
                      .reduce(
                        (total, room) =>
                          total +
                          (room.paint.ceiling ? parseFloat(room.surface || "0") : 0),
                        0
                      )
                      .toFixed(2)}{" "}
                    m²
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Paint className="h-5 w-5 mr-2" />
                <h2 className="text-xl font-semibold">Traitements de Peinture</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-md room-card">
                  <h3 className="font-medium mb-2">Murs</h3>
                  <Separator className="my-2" />
                  <p className="mb-2">
                    Surface totale:{" "}
                    <span className="font-semibold">
                      {rooms
                        .reduce(
                          (total, room) =>
                            total +
                            (room.paint.walls
                              ? parseFloat(room.wallSurfaceRaw || "0")
                              : 0),
                          0
                        )
                        .toFixed(2)}{" "}
                      m²
                    </span>
                  </p>
                  <p>
                    Peinture nécessaire (2 couches):{" "}
                    <span className="font-semibold">
                      {calculatePaintNeeded(
                        rooms.reduce(
                          (total, room) =>
                            total +
                            (room.paint.walls
                              ? parseFloat(room.wallSurfaceRaw || "0")
                              : 0),
                          0
                        )
                      )}{" "}
                      L
                    </span>
                  </p>
                </div>
                <div className="p-4 border rounded-md room-card">
                  <h3 className="font-medium mb-2">Plafonds</h3>
                  <Separator className="my-2" />
                  <p className="mb-2">
                    Surface totale:{" "}
                    <span className="font-semibold">
                      {rooms
                        .reduce(
                          (total, room) =>
                            total +
                            (room.paint.ceiling ? parseFloat(room.surface || "0") : 0),
                          0
                        )
                        .toFixed(2)}{" "}
                      m²
                    </span>
                  </p>
                  <p>
                    Peinture nécessaire (2 couches):{" "}
                    <span className="font-semibold">
                      {calculatePaintNeeded(
                        rooms.reduce(
                          (total, room) =>
                            total +
                            (room.paint.ceiling ? parseFloat(room.surface || "0") : 0),
                          0
                        )
                      )}{" "}
                      L
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 shadow-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Traitements de Sol</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {flooringTypes.map((floorType) => {
                  const roomsWithFloorType = rooms.filter(
                    (room) => room.floor.type === floorType
                  );
                  const totalSurfaceForType = roomsWithFloorType
                    .reduce((total, room) => total + parseFloat(room.surface || "0"), 0)
                    .toFixed(2);

                  if (roomsWithFloorType.length === 0) return null;

                  return (
                    <div key={floorType} className="p-4 bg-gray-50 rounded-md room-card">
                      <h3 className="font-medium mb-2">{floorType}</h3>
                      <Separator className="my-2" />
                      <p className="mb-1">Surface totale: <span className="font-semibold">{totalSurfaceForType} m²</span></p>
                      <p className="text-sm text-gray-600">
                        Pièces:{" "}
                        {roomsWithFloorType
                          .map(
                            (room) =>
                              room.name || `${room.type}${room.customName ? ` ${room.customName}` : ''}`
                          )
                          .join(", ")}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-gray-50 rounded-md mb-4 room-card">
                <h3 className="font-medium mb-2">Dépose de sol à prévoir</h3>
                <Separator className="my-2" />
                <p>
                  Surface totale:{" "}
                  {rooms
                    .reduce(
                      (total, room) =>
                        total + (room.floor.removal ? parseFloat(room.surface || "0") : 0),
                      0
                    )
                    .toFixed(2)}{" "}
                  m²
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default RenovationEstimator;
