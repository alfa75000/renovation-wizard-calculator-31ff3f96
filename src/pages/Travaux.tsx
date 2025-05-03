
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlusCircle, ArrowLeft, ArrowRight, Paintbrush, Square } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { useProject } from "@/contexts/ProjectContext";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";
import { Room, Travail } from "@/types";
import { toast } from "sonner";
import TravailForm from "@/features/travaux/components/TravailForm";
import TravailCard from "@/features/travaux/components/TravailCard";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface PieceSelectProps {
  pieces: Room[];
  selectedPieceId: string | null;
  onSelect: (pieceId: string) => void;
}

const PieceSelect: React.FC<PieceSelectProps> = ({ 
  pieces, 
  selectedPieceId, 
  onSelect 
}) => {
  return (
    <div className="flex flex-col space-y-2">
      {pieces.length > 0 ? (
        pieces.map(piece => (
          <Button
            key={piece.id}
            variant={selectedPieceId === piece.id ? "default" : "outline"}
            className="justify-start"
            onClick={() => onSelect(piece.id)}
          >
            {piece.name} ({piece.surface.toFixed(2)} m²)
          </Button>
        ))
      ) : (
        <div className="text-center py-4 text-gray-500">
          <p>Aucune pièce disponible.</p>
          <p className="text-sm mt-1">Ajoutez des pièces depuis l'estimateur principal.</p>
        </div>
      )}
    </div>
  );
};

const Travaux: React.FC = () => {
  const { state: projectState } = useProject();
  const { rooms } = projectState;
  const { getTravauxForPiece, addTravail, deleteTravail } = useTravaux();

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [travailAModifier, setTravailAModifier] = useState<Travail | null>(null);
  const [selectedElement, setSelectedElement] = useState<string>("piece");
  
  useEffect(() => {
    if (!selectedRoom && rooms.length > 0) {
      setSelectedRoom(rooms[0].id);
    }
    
    if (selectedRoom && !rooms.find(room => room.id === selectedRoom)) {
      setSelectedRoom(rooms.length > 0 ? rooms[0].id : null);
    }
  }, [rooms, selectedRoom]);

  const selectedRoomInfo = selectedRoom 
    ? rooms.find(room => room.id === selectedRoom)
    : null;

  const travauxForSelectedRoom = selectedRoom 
    ? getTravauxForPiece(selectedRoom)
    : [];

  const handleAddTravail = () => {
    if (!selectedRoom) {
      toast.error("Veuillez d'abord sélectionner une pièce pour ajouter des travaux.");
      return;
    }
    setTravailAModifier(null);
    setIsDrawerOpen(true);
  };

  const handleEditTravail = (travail: Travail) => {
    setTravailAModifier(travail);
    setIsDrawerOpen(true);
  };

  const handleSubmitTravail = (travailData: Omit<Travail, 'id'>) => {
    if (!selectedRoom) return;
    
    if (travailAModifier) {
      toast.info("La modification de travaux n'est pas encore implémentée");
      setIsDrawerOpen(false);
      return;
    }
    
    addTravail({
      ...travailData,
      pieceId: selectedRoom,
    });
    
    setIsDrawerOpen(false);
    toast.success("Le travail a été ajouté avec succès.");
  };

  const handleDeleteTravail = (travailId: string) => {
    deleteTravail(travailId);
    toast.success("Le travail a été supprimé avec succès.");
  };

  // Construction de la liste des éléments pour le Select
  const selectElements = selectedRoomInfo ? [
    { id: "piece", name: selectedRoomInfo.name },
    { id: "plinthes", name: "Plinthes" },
    ...(selectedRoomInfo.menuiseries?.map(m => ({ 
      id: `menuiserie-${m.id}`, 
      name: m.name || `${m.type} (${m.largeur}x${m.hauteur})` 
    })) || []),
    ...(selectedRoomInfo.autresSurfaces?.map(a => ({ 
      id: `surface-${a.id}`, 
      name: a.name || a.designation || `${a.type}` 
    })) || [])
  ] : [];

  return (
    <Layout
      title="Définir les Travaux"
      subtitle="Sélectionnez une pièce et ajoutez les travaux à effectuer"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="order-2 lg:order-1">
          <CardHeader>
            <CardTitle>Pièces</CardTitle>
            <CardDescription>
              Sélectionnez une pièce pour ajouter ou voir les travaux
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PieceSelect
              pieces={rooms} 
              selectedPieceId={selectedRoom}
              onSelect={setSelectedRoom}
            />
          </CardContent>
        </Card>

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
                {selectedRoomInfo 
                  ? `${selectedRoomInfo.name} (${selectedRoomInfo.surface.toFixed(2)} m²)`
                  : "Veuillez sélectionner une pièce"
                }
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleAddTravail}
                disabled={!selectedRoom}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Ajouter un travail
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par élément
              </label>
              <Select 
                value={selectedElement} 
                onValueChange={setSelectedElement}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un élément" />
                </SelectTrigger>
                <SelectContent>
                  {selectElements.map(element => (
                    <SelectItem key={element.id} value={element.id}>
                      {element.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <h3 className="text-lg font-medium mb-3">Travaux</h3>
            {travauxForSelectedRoom.length > 0 ? (
              <div className="space-y-4">
                {travauxForSelectedRoom.map(travail => (
                  <TravailCard
                    key={travail.id}
                    travail={travail}
                    onEdit={() => handleEditTravail(travail)}
                    onDelete={() => handleDeleteTravail(travail.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border rounded-md bg-gray-50">
                <p className="text-gray-500 mb-4">
                  {selectedRoom 
                    ? "Aucun travail n'a été ajouté pour cette pièce."
                    : "Veuillez sélectionner une pièce pour afficher ou ajouter des travaux."
                  }
                </p>
                {selectedRoom && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleAddTravail}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Ajouter des travaux
                  </Button>
                )}
              </div>
            )}
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

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {travailAModifier ? "Modifier un travail" : "Ajouter un travail"}
            </SheetTitle>
          </SheetHeader>
          
          <div className="py-4">
            <TravailForm 
              piece={selectedRoomInfo}
              onAddTravail={handleSubmitTravail}
              travailAModifier={travailAModifier}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Layout>
  );
};

export default Travaux;
