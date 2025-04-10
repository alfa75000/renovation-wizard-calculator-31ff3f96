
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useProject } from "@/contexts/ProjectContext";
import { Room } from "@/types";
import PropertyCard from "@/features/property/components/PropertyCard";
import RoomsCard from "@/features/property/components/RoomsCard";
import { generateDevisNumber, findDefaultClientId } from "@/services/devisService";

const RenovationEstimator: React.FC = () => {
  const { 
    state, 
    dispatch, 
    createNewProject, 
    hasUnsavedChanges 
  } = useProject();
  
  const { property, rooms } = state;
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [isFirstRoom, setIsFirstRoom] = useState<boolean>(true);
  
  const roomTypes = ["Salon", "Chambre", "Cuisine", "Salle de bain", "Toilettes", "Bureau", "Entrée", "Couloir", "Autre"];

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

  const handleAddRoom = async (room: Omit<Room, "id">) => {
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

      // Vérifier si c'est la première pièce ajoutée
      if (rooms.length === 0 && isFirstRoom) {
        setIsFirstRoom(false);
        
        try {
          // Déclencher la génération automatique immédiatement ici
          const clientId = await findDefaultClientId();
          const devisNumber = await generateDevisNumber();
          
          // On déclenche aussi l'événement pour la page InfosChantier
          const event = new CustomEvent('firstRoomAdded', {
            detail: {
              roomName: room.name,
              clientId: clientId,
              devisNumber: devisNumber
            }
          });
          window.dispatchEvent(event);
          
          // Toast pour indiquer que la génération automatique a été effectuée
          toast.info("Les informations du projet ont été initialisées automatiquement");
        } catch (error) {
          console.error("Erreur lors de la génération des informations:", error);
        }
      }
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
    
    // Réinitialiser le flag si toutes les pièces sont supprimées
    if (rooms.length === 1) { // Si cette pièce est la dernière
      setIsFirstRoom(true);
    }
  };

  const resetProject = () => {
    createNewProject();
    setEditingRoomId(null);
    setIsFirstRoom(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PropertyCard 
        property={property}
        hasUnsavedChanges={hasUnsavedChanges}
        onPropertyChange={handlePropertyChange}
        onResetProject={resetProject}
      />

      <RoomsCard 
        rooms={rooms}
        editingRoomId={editingRoomId}
        roomTypes={roomTypes}
        onAddRoom={handleAddRoom}
        onEditRoom={handleEditRoom}
        onDeleteRoom={handleDeleteRoom}
      />
    </div>
  );
};

export default RenovationEstimator;
