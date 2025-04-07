import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Room } from '@/types';
import { useCalculSurfaces } from '@/hooks/useCalculSurfaces';
import { Check, Plus } from 'lucide-react';
import MenuiseriesList from './MenuiseriesList';
import AutresSurfacesList from './AutresSurfacesList';
import { useMenuiseries } from '@/hooks/useMenuiseries';
import { useAutresSurfaces } from '@/hooks/useAutresSurfaces';
import MenuiserieForm from './MenuiserieForm';
import { Separator } from '@/components/ui/separator';

interface RoomFormProps {
  onAddRoom: (room: Omit<Room, 'id'>) => void;
  editingRoom: Room | null;
  roomTypes: string[];
}

const RoomForm: React.FC<RoomFormProps> = ({ onAddRoom, editingRoom, roomTypes }) => {
  const { calculerToutesSurfaces } = useCalculSurfaces();
  const { 
    menuiseries, 
    setMenuiseries,
    addMenuiserie, 
    updateMenuiserie, 
    deleteMenuiserie 
  } = useMenuiseries();

  const { 
    autresSurfaces, 
    setAutresSurfaces,
    addAutreSurface, 
    updateAutreSurface, 
    deleteAutreSurface 
  } = useAutresSurfaces();

  const [newRoom, setNewRoom] = useState<Omit<Room, 'id'>>({
    name: "",
    customName: "",
    type: "Salon",
    length: 0,
    width: 0,
    height: 2.5,
    surface: 0,
    plinthHeight: 0.1,
    wallSurfaceRaw: 0,
    menuiseries: [],
    autresSurfaces: [],
    totalPlinthLength: 0,
    totalPlinthSurface: 0,
    menuiseriesMursSurface: 0,
    menuiseriesPlafondSurface: 0,
    menuiseriesSolSurface: 0,
    autresSurfacesMurs: 0,
    autresSurfacesPlafond: 0,
    autresSurfacesSol: 0,
    netWallSurface: 0,
    surfaceNetteSol: 0,
    surfaceBruteSol: 0,
    surfaceNettePlafond: 0,
    surfaceBrutePlafond: 0,
    surfaceBruteMurs: 0,
    surfaceNetteMurs: 0,
    surfaceMenuiseries: 0,
    totalMenuiserieSurface: 0,
    lineaireBrut: 0,
    lineaireNet: 0
  });

  // Chargement de la pièce à éditer
  useEffect(() => {
    if (editingRoom) {
      setNewRoom(editingRoom);
      setMenuiseries(editingRoom.menuiseries);
      setAutresSurfaces(editingRoom.autresSurfaces);
    } else {
      resetForm();
    }
  }, [editingRoom]);

  // Mise à jour des surfaces calculées
  useEffect(() => {
    if (newRoom.length && newRoom.width && newRoom.height) {
      const roomWithMenuiseries = {
        ...newRoom,
        menuiseries,
        autresSurfaces
      };
      
      const calculatedValues = calculerToutesSurfaces(roomWithMenuiseries);
      setNewRoom(prev => ({
        ...prev,
        ...calculatedValues
      }));
    }
  }, [newRoom.length, newRoom.width, newRoom.height, newRoom.plinthHeight, menuiseries, autresSurfaces]);

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'length' || name === 'width' || name === 'height' || name === 'plinthHeight') {
      setNewRoom(prev => ({ 
        ...prev, 
        [name]: parseFloat(value) || 0 
      }));
    } else {
      setNewRoom(prev => ({ ...prev, [name]: value }));
    }
  };

  const generateRoomName = (type: string, customName: string = ""): string => {
    if (editingRoom) return editingRoom.name;
    
    const roomTypeCount = Math.floor(Math.random() * 100) + 1;
    const baseRoomName = `${type} ${roomTypeCount}`;
    return customName ? `${baseRoomName} (${customName})` : baseRoomName;
  };

  const handleSubmit = () => {
    if (!newRoom.length || !newRoom.width || !newRoom.height) {
      alert("Veuillez remplir toutes les dimensions de la pièce");
      return;
    }

    const roomToAdd = {
      ...newRoom,
      name: generateRoomName(newRoom.type, newRoom.customName),
      menuiseries,
      autresSurfaces
    };

    onAddRoom(roomToAdd);
    resetForm();
  };

  const resetForm = () => {
    setNewRoom({
      name: "",
      customName: "",
      type: "Salon",
      length: 0,
      width: 0,
      height: 2.5,
      surface: 0,
      plinthHeight: 0.1,
      wallSurfaceRaw: 0,
      menuiseries: [],
      autresSurfaces: [],
      totalPlinthLength: 0,
      totalPlinthSurface: 0,
      menuiseriesMursSurface: 0,
      menuiseriesPlafondSurface: 0,
      menuiseriesSolSurface: 0,
      autresSurfacesMurs: 0,
      autresSurfacesPlafond: 0,
      autresSurfacesSol: 0,
      netWallSurface: 0,
      surfaceNetteSol: 0,
      surfaceBruteSol: 0,
      surfaceNettePlafond: 0,
      surfaceBrutePlafond: 0,
      surfaceBruteMurs: 0,
      surfaceNetteMurs: 0,
      surfaceMenuiseries: 0,
      totalMenuiserieSurface: 0,
      lineaireBrut: 0,
      lineaireNet: 0
    });
    setMenuiseries([]);
    setAutresSurfaces([]);
  };

  return (
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
            value={newRoom.customName || ''}
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
            value={generateRoomName(newRoom.type, newRoom.customName || '')}
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
            value={newRoom.length || ''}
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
            value={newRoom.width || ''}
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
            value={newRoom.height || ''}
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
            value={newRoom.plinthHeight || ''}
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
            value={newRoom.surface || ''}
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
            value={newRoom.wallSurfaceRaw || ''}
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
            value={newRoom.totalPlinthLength || ''}
            readOnly
            className="mt-1 bg-gray-100"
          />
        </div>
      </div>

      <Separator className="my-6" />
      
      <MenuiserieForm 
        onAddMenuiserie={(menuiserie, quantity) => addMenuiserie(menuiserie, quantity)} 
      />
      
      <MenuiseriesList 
        menuiseries={menuiseries} 
        onEdit={updateMenuiserie} 
        onDelete={deleteMenuiserie} 
      />
      
      <Separator className="my-6" />
      
      <AutresSurfacesList 
        autresSurfaces={autresSurfaces} 
        onEdit={updateAutreSurface} 
        onDelete={deleteAutreSurface} 
        onAdd={addAutreSurface} 
      />

      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleSubmit} 
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
  );
};

export default RoomForm;
