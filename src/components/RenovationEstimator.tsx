
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Home, RefreshCw, Save, FileCheck } from "lucide-react";
import { formaterQuantite } from "@/lib/utils";
import { useProject } from "@/contexts/ProjectContext";
import { Room } from "@/types";
import RoomForm from "./room/RoomForm";
import RoomsList from "./room/RoomsList";
import { Badge } from "@/components/ui/badge";

const RenovationEstimator: React.FC = () => {
  const { 
    state, 
    dispatch, 
    saveProjectAsDraft, 
    createNewProject, 
    isLoading, 
    isSaving,
    hasUnsavedChanges 
  } = useProject();
  
  const { property, rooms } = state;
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  
  const roomTypes = ["Salon", "Chambre", "Cuisine", "Salle de bain", "Toilettes", "Bureau", "Entrée", "Couloir", "Autre"];
  const propertyTypes = ["Appartement", "Maison", "Studio", "Loft", "Autre"];

  const handlePropertyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let parsedValue: string | number = value;
    if (name === 'floors' || name === 'totalArea' || name === 'rooms' || name === 'ceilingHeight') {
      parsedValue = parseFloat(value) || 0;
    }
    
    dispatch({ 
      type: 'UPDATE_PROPERTY', 
      payload: { [name]: parsedValue } 
    });
  };

  const handleAddRoom = (room: Omit<Room, "id">) => {
    if (editingRoomId) {
      dispatch({
        type: 'UPDATE_ROOM',
        payload: {
          id: editingRoomId,
          room: { ...room, id: editingRoomId }
        }
      });
      setEditingRoomId(null);
      toast.success("Pièce mise à jour avec succès");
    } else {
      const newRoomWithId = { 
        ...room, 
        id: Date.now().toString(),
      };
      
      dispatch({
        type: 'ADD_ROOM',
        payload: newRoomWithId
      });
      
      toast.success(`${room.name} ajouté avec succès`);
    }
  };

  const handleEditRoom = (id: string) => {
    setEditingRoomId(id);
    toast("Édition de pièce en cours");
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
    return rooms.reduce((total, room) => total + room.surface, 0);
  };

  const handleSaveDraft = async () => {
    try {
      await saveProjectAsDraft();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du brouillon:', error);
      toast.error('Une erreur est survenue lors de la sauvegarde du brouillon');
    }
  };

  const resetProject = () => {
    createNewProject();
    setEditingRoomId(null);
  };

  const editingRoom = editingRoomId ? rooms.find(room => room.id === editingRoomId) || null : null;

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="mb-8 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Home className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">Type de bien à rénover</h2>
            
            <div className="flex items-center ml-auto gap-2">
              {hasUnsavedChanges && (
                <Badge variant="outline" className="mr-2 text-amber-500 border-amber-500">
                  Modifications non enregistrées
                </Badge>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSaveDraft}
                disabled={isLoading || isSaving || !hasUnsavedChanges}
                className="flex items-center gap-1"
              >
                {isSaving ? (
                  <span className="animate-spin mr-2">◌</span>
                ) : (
                  <FileCheck className="h-4 w-4" />
                )}
                Sauvegarder
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="reset" size="sm" className="flex items-center gap-1">
                    <RefreshCw className="h-4 w-4" />
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
            <h2 className="text-xl font-semibold">Pièces à rénover</h2>
          </div>
          
          <RoomForm 
            onAddRoom={handleAddRoom}
            editingRoom={editingRoom}
            roomTypes={roomTypes}
          />
          
          <RoomsList 
            rooms={rooms}
            onEditRoom={handleEditRoom}
            onDeleteRoom={handleDeleteRoom}
          />
          
          {rooms.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md flex justify-between items-center">
              <div>
                <span className="font-medium">Surface totale des pièces : </span>
                <span className="text-xl font-bold">{formaterQuantite(calculateTotalArea())} m²</span>
              </div>
              
              {hasUnsavedChanges && (
                <Button 
                  size="sm" 
                  onClick={handleSaveDraft} 
                  disabled={isSaving}
                  className="flex items-center gap-1"
                >
                  <Save className="h-4 w-4" />
                  Sauvegarder les modifications
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RenovationEstimator;
