
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  PlusCircle,
  ArrowLeft,
  ArrowRight,
  Paintbrush,
  Home,
  DoorOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import TravauxList from "@/features/travaux/components/TravauxList";
import PieceSelect from "@/features/travaux/components/PieceSelect";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProject } from "@/contexts/ProjectContext";
import { useEffect as useEffectMock, useState as useStateMock } from "react";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";
import { TypeTravauxItem, SousTypeTravauxItem, surfacesReference, useTravauxTypes } from "@/contexts/TravauxTypesContext";
import { Floor, Room, RoomWithFloor, Work } from "@/types";
import { toast } from "@/components/ui/use-toast";
import TravailForm from "@/features/travaux/components/TravailForm";

// Types de travaux avec détails
export interface DetailedSousType extends SousTypeTravauxItem {
  price: number; // Prix calculé selon quantité
  quantity: number; // Quantité en m², mètres linéaires, unités, etc.
  typeTravauxLabel: string; // Nom du type de travaux parent
  totalSurface: number; // Surface totale à conserver
}

export interface DetailedTravailItem {
  id: string;
  typeTravauxId: string;
  sousTypeId: string;
  roomId: string;
  floorId: string;
  sousType: DetailedSousType;
  price: number;
  tva: number;
  quantity: number;
  unite: string;
}

const Travaux = () => {
  // Context et hooks
  const { state: projectState } = useProject();
  const { floors, rooms } = projectState;
  
  const { state: travauxTypesState } = useTravauxTypes();
  const { types } = travauxTypesState;
  
  const { travaux, addTravail, deleteTravail } = useTravaux();

  // États
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMur, setSelectedMur] = useState<string | null>(null);

  // Filtrer les pièces par étage sélectionné
  const roomsInSelectedFloor = selectedFloor 
    ? rooms.filter(room => room.floorId === selectedFloor)
    : [];

  // Travaux pour la pièce sélectionnée
  const travauxForSelectedRoom = selectedRoom 
    ? travaux.filter(work => work.roomId === selectedRoom)
    : [];

  // Quand les étages ou pièces changent, mettre à jour la sélection
  useEffect(() => {
    // Si aucun étage sélectionné et qu'il y a des étages, sélectionner le premier
    if (!selectedFloor && floors.length > 0) {
      setSelectedFloor(floors[0].id);
    }
    
    // Si l'étage actuel n'existe plus, sélectionner le premier
    if (selectedFloor && !floors.find(floor => floor.id === selectedFloor)) {
      setSelectedFloor(floors.length > 0 ? floors[0].id : null);
    }
    
    // Si aucune pièce sélectionnée et qu'il y a des pièces dans l'étage sélectionné
    if (selectedFloor && !selectedRoom && roomsInSelectedFloor.length > 0) {
      setSelectedRoom(roomsInSelectedFloor[0].id);
    }
    
    // Si la pièce actuelle n'existe plus dans l'étage sélectionné
    if (selectedRoom && !roomsInSelectedFloor.find(room => room.id === selectedRoom)) {
      setSelectedRoom(roomsInSelectedFloor.length > 0 ? roomsInSelectedFloor[0].id : null);
    }
  }, [floors, rooms, selectedFloor, roomsInSelectedFloor]);

  // Informations sur la pièce sélectionnée
  const selectedRoomInfo = selectedRoom 
    ? rooms.find(room => room.id === selectedRoom)
    : null;
  
  // Informations sur l'étage sélectionné
  const selectedFloorInfo = selectedFloor 
    ? floors.find(floor => floor.id === selectedFloor)
    : null;

  // Pièces avec étage
  const roomsWithFloors: RoomWithFloor[] = rooms.map(room => {
    const floor = floors.find(floor => floor.id === room.floorId);
    return {
      ...room,
      floorName: floor ? floor.name : "Étage inconnu",
    };
  });

  // Ouvrir le tiroir pour ajouter un nouveau travail
  const handleAddTravail = () => {
    if (!selectedRoom) {
      toast({
        title: "Aucune pièce sélectionnée",
        description: "Veuillez d'abord sélectionner une pièce pour ajouter des travaux.",
        variant: "destructive",
      });
      return;
    }
    setIsDrawerOpen(true);
  };

  // Soumettre un nouveau travail
  const handleSubmitTravail = (travailData: Work) => {
    if (!selectedRoom || !selectedFloor) return;
    
    addTravail({
      ...travailData,
      roomId: selectedRoom,
      floorId: selectedFloor,
    });
    
    setIsDrawerOpen(false);
    
    toast({
      title: "Travail ajouté",
      description: "Le travail a été ajouté avec succès.",
    });
  };

  // Supprimer un travail
  const handleDeleteTravail = (id: string) => {
    deleteTravail(id);
    toast({
      title: "Travail supprimé",
      description: "Le travail a été supprimé avec succès.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-8 bg-blue-600 text-white p-6 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Paintbrush className="h-8 w-8" />
            Définir les Travaux
          </h1>
          <p className="mt-2 text-lg text-center">
            Sélectionnez une pièce et ajoutez les travaux à effectuer
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Page de saisie
            </Link>
          </Button>
          <Button asChild variant="default" className="flex items-center gap-2">
            <Link to="/travaux">
              <Paintbrush className="h-4 w-4" />
              Définir les travaux
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/recapitulatif">
              <ChevronRight className="h-4 w-4" />
              Récapitulatif
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/parametres">
              Paramètres
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sélection de pièce */}
          <Card className="order-2 lg:order-1">
            <CardHeader>
              <CardTitle>Pièces</CardTitle>
              <CardDescription>
                Sélectionnez une pièce pour ajouter ou voir les travaux
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PieceSelect
                rooms={roomsWithFloors as Room[]} 
                floors={floors}
                selectedFloor={selectedFloor}
                selectedRoom={selectedRoom}
                onFloorChange={setSelectedFloor}
                onRoomChange={setSelectedRoom}
                onMurChange={setSelectedMur}
              />
            </CardContent>
          </Card>

          {/* Liste des travaux */}
          <Card className="lg:col-span-2 order-1 lg:order-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Paintbrush className="h-5 w-5" />
                  {selectedRoomInfo 
                    ? `Travaux pour ${selectedRoomInfo.name}`
                    : "Travaux"
                  }
                </CardTitle>
                <CardDescription>
                  {selectedRoomInfo && selectedFloorInfo 
                    ? `${selectedFloorInfo.name} - ${selectedRoomInfo.name} (${selectedRoomInfo.area} m²)`
                    : "Veuillez sélectionner une pièce"
                  }
                </CardDescription>
              </div>
              
              <Button 
                onClick={handleAddTravail}
                disabled={!selectedRoom}
                className="ml-auto"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un travail
              </Button>
            </CardHeader>
            <CardContent>
              <TravauxList 
                works={travauxForSelectedRoom} 
                onDelete={handleDeleteTravail}
                selectedRoom={selectedRoomInfo}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between mt-8">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la saisie
            </Link>
          </Button>
          
          <Button asChild className="flex items-center gap-2">
            <Link to="/recapitulatif">
              Récapitulatif
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Tiroir pour ajouter un nouveau travail */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Ajouter un travail</SheetTitle>
          </SheetHeader>
          
          <div className="py-4">
            <TravailForm 
              onSubmit={handleSubmitTravail} 
              onCancel={() => setIsDrawerOpen(false)}
              typesTravaux={types}
              selectedRoom={selectedRoomInfo}
              selectedMur={selectedMur}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Travaux;
