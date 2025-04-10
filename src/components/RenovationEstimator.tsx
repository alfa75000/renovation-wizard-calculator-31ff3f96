
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useProject } from "@/contexts/ProjectContext";
import { Room } from "@/types";
import PropertyCard from "@/features/property/components/PropertyCard";
import RoomsCard from "@/features/property/components/RoomsCard";
import { useProjectInitOnFirstRoom } from "@/features/project/hooks/useProjectInitOnFirstRoom";
import { findDefaultClientId } from "@/services/devisService";
import { generateDevisNumber } from "@/services/projectService";

const RenovationEstimator: React.FC = () => {
  const { 
    state, 
    dispatch, 
    createNewProject, 
    hasUnsavedChanges 
  } = useProject();
  
  const { property, rooms } = state;
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  
  // Variables d'état pour les informations du projet
  // Ces variables seront synchronisées via le hook useProjectInitOnFirstRoom
  const [clientId, setClientId] = useState<string>('');
  const [devisNumber, setDevisNumber] = useState<string>('');
  const [descriptionProjet, setDescriptionProjet] = useState<string>('');
  
  // Utiliser le hook pour initialiser les informations du projet lors de l'ajout de la première pièce
  const { isFirstRoom, setIsFirstRoom } = useProjectInitOnFirstRoom(
    clientId,
    setClientId,
    devisNumber,
    setDevisNumber,
    descriptionProjet,
    setDescriptionProjet
  );

  // Nettoyer sessionStorage au chargement du composant pour permettre l'initialisation
  // C'est important pour un nouveau projet
  useEffect(() => {
    if (rooms.length === 0) {
      sessionStorage.removeItem('project_initialized');
      sessionStorage.removeItem('project_init_toast_shown');
      setIsFirstRoom(true);
    }
  }, [rooms.length, setIsFirstRoom]);

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

  const resetProject = () => {
    createNewProject();
    setEditingRoomId(null);
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
