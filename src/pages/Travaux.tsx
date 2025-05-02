import React, { useState, useEffect, useMemo } from "react"; // Ajout de useMemo
import { Button } from "@/components/ui/button";
import { ChevronRight, PlusCircle, ArrowLeft, ArrowRight, Paintbrush } from "lucide-react"; // Retrait Square (non utilisé ici)
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout"; // Assurez-vous que le chemin est correct
import { useProject } from "@/contexts/ProjectContext";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";
import { Room, Travail, MenuiserieItem, AutreSurfaceItem } from "@/types"; // Types ajoutés
import { toast } from "sonner"; // Utilisation de sonner directement
import TravailForm from "@/features/travaux/components/TravailForm";
// Retrait import TravailCard car utilisé dans TravauxList
import TravauxList from "@/features/travaux/components/TravauxList"; // Import de TravauxList
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // Ajout de Label

// Le composant PieceSelect reste tel quel
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
  // ... (code inchangé de PieceSelect)
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
            {piece.name} ({piece.surface?.toFixed(2)} m²) {/* Sécurisation de surface */}
          </Button>
        ))
      ) : (
        <div className="text-center py-4 text-gray-500">
          <p>Aucune pièce disponible.</p>
          <p className="text-sm mt-1">Ajoutez des pièces depuis la section "Infos Chantier".</p>
        </div>
      )}
    </div>
  );
};


const Travaux: React.FC = () => {
  const { state: projectState } = useProject();
  const { rooms } = projectState || { rooms: [] }; // Gérer le cas où projectState est null/undefined au début
  const { getTravauxForPiece, addTravail, deleteTravail, updateTravail } = useTravaux(); // updateTravail ajouté

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null); // Renommé pour clarté
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [travailAModifier, setTravailAModifier] = useState<Travail | null>(null);
  // L'état pour le filtre Select : 'piece', 'plinthes', 'menuiserie-ID', 'surface-ID'
  const [selectedElementId, setSelectedElementId] = useState<string>("piece");

  useEffect(() => {
    if (!selectedRoomId && rooms.length > 0) {
      setSelectedRoomId(rooms[0].id);
      setSelectedElementId("piece"); // Réinitialiser le filtre si la pièce change
    }

    if (selectedRoomId && !rooms.find(room => room.id === selectedRoomId)) {
      const newSelectedRoomId = rooms.length > 0 ? rooms[0].id : null;
      setSelectedRoomId(newSelectedRoomId);
      setSelectedElementId("piece"); // Réinitialiser le filtre
    }
  }, [rooms, selectedRoomId]);

  const selectedRoomInfo = useMemo(() => {
     return selectedRoomId ? rooms.find(room => room.id === selectedRoomId) ?? null : null;
  }, [selectedRoomId, rooms]);


  // Les travaux sont maintenant récupérés dans TravauxList, pas besoin ici
  // const travauxForSelectedRoom = selectedRoomId
  //   ? getTravauxForPiece(selectedRoomId)
  //   : [];

  const handleAddTravailClick = () => {
    if (!selectedRoomId) {
      toast.error("Veuillez d'abord sélectionner une pièce pour ajouter des travaux.");
      return;
    }
    setTravailAModifier(null); // Assure qu'on est en mode ajout
    setIsDrawerOpen(true);
  };

  // Renommé pour clarté, reçoit le travail complet de TravauxList/TravailCard
  const handleStartEditTravail = (travail: Travail) => {
    console.log("TravauxPage: Édition demandée pour:", travail);
    setTravailAModifier(travail);
    setIsDrawerOpen(true);
  };

  // Gère la soumission du formulaire (ajout ou modification)
  const handleSubmitTravail = (travailData: Omit<Travail, 'id'> | Travail) => {
    if (!selectedRoomId) return;

    try {
        if (travailAModifier && 'id' in travailData) {
            // Logique de modification
            updateTravail(travailAModifier.id, travailData);
            toast.success("Le travail a été modifié avec succès.");
            setTravailAModifier(null); // Réinitialiser après modif
        } else {
            // Logique d'ajout (assurer que pieceId est correct)
            addTravail({
                ...(travailData as Omit<Travail, 'id'>), // Cast si nécessaire
                pieceId: selectedRoomId,
            });
            toast.success("Le travail a été ajouté avec succès.");
        }
        setIsDrawerOpen(false);
     } catch(error) {
        console.error("Erreur lors de la sauvegarde du travail:", error);
        toast.error("Erreur lors de l'enregistrement du travail.");
     }
  };

  // La fonction handleDeleteTravail est maintenant dans TravauxList, on retire celle-ci

  // Construction de la liste des éléments pour le Select (CORRIGÉE et SÉCURISÉE)
  const selectElements = useMemo(() => {
    if (!selectedRoomInfo) return [];

    const elements = [
        { id: "piece", name: `Pièce : ${selectedRoomInfo.name}` },
        { id: "plinthes", name: "Plinthes" }, // Gardé tel quel pour l'instant
    ];

    // Ajout des menuiseries
    if (selectedRoomInfo.menuiseries && selectedRoomInfo.menuiseries.length > 0) {
        selectedRoomInfo.menuiseries.forEach((m: MenuiserieItem) => {
            // Créer un nom descriptif si possible
            const itemName = m.description || `Menuiserie ${m.largeur}x${m.hauteur}`; // Utiliser description si dispo
            elements.push({
                id: `menuiserie-${m.id}`,
                name: itemName
            });
        });
    }

    // Ajout des autres surfaces
    if (selectedRoomInfo.autresSurfaces && selectedRoomInfo.autresSurfaces.length > 0) {
        selectedRoomInfo.autresSurfaces.forEach((a: AutreSurfaceItem) => {
             // Créer un nom descriptif
             const itemName = a.description || `Autre Surface (${a.quantite} ${a.unite})`; // Utiliser description si dispo
             elements.push({
                id: `surface-${a.id}`,
                name: itemName
             });
        });
    }

    return elements;

  }, [selectedRoomInfo]);

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
              selectedPieceId={selectedRoomId} // Utilise le nouvel état renommé
              onSelect={(id) => {
                 setSelectedRoomId(id);
                 setSelectedElementId("piece"); // Réinitialise le filtre quand on change de pièce
              }}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 order-1 lg:order-2">
          <CardHeader className="flex flex-row items-center justify-between space-x-4">
            {/* Titre et description */}
            <div>
               <CardTitle className="flex items-center gap-2">
                <Paintbrush className="h-5 w-5" />
                {selectedRoomInfo
                  ? `Travaux pour ${selectedRoomInfo.name}`
                  : "Sélectionnez une pièce"
                }
              </CardTitle>
              {selectedRoomInfo && (
                 <CardDescription>
                    {selectedRoomInfo.name} ({selectedRoomInfo.surface?.toFixed(2)} m²)
                 </CardDescription>
              )}
            </div>
            {/* Bouton Ajouter */}
            <div className="flex-shrink-0">
              <Button
                onClick={handleAddTravailClick} // Utilise la nouvelle fonction
                disabled={!selectedRoomId}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Ajouter un travail
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtre Select ajouté ici */}
            {selectedRoomId && (
                <div className="mb-6"> {/* Augmentation de la marge */}
                    <Label htmlFor="element-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Afficher les travaux pour :
                    </Label>
                    <Select
                        value={selectedElementId}
                        onValueChange={setSelectedElementId}
                        disabled={!selectedRoomInfo}
                    >
                        <SelectTrigger id="element-filter" className="w-full">
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
                    {/* TODO: Ajouter la logique de filtrage des travaux basée sur selectedElementId */}
                    {/* Pour l'instant, TravauxList affiche toujours tous les travaux de la pièce */}
                    </div>
            )}


            <h3 className="text-lg font-medium mb-3 border-t pt-4">Liste des Travaux</h3>
            {/* Utilisation de TravauxList */}
            <TravauxList
                pieceId={selectedRoomId}
                selectedRoomInfo={selectedRoomInfo} // Passer les infos de la pièce
                onStartEdit={handleStartEditTravail} // Passer le handler d'édition
                // onAddTravailClick={handleAddTravailClick} // Passer le handler pour le bouton dans le message vide
            />
          </CardContent>
        </Card>
      </div>

      {/* Boutons de navigation */}
      <div className="flex justify-between mt-8">
        <Button asChild variant="outline" className="flex items-center gap-2">
          <Link to="/chantier"> {/* Correction du lien retour */}
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour Infos Chantier
          </Link>
        </Button>

        <Button asChild className="flex items-center gap-2">
          <Link to="/recapitulatif">
            Récapitulatif
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Panneau latéral pour le formulaire */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {travailAModifier ? "Modifier le travail" : "Ajouter un travail"}
            </SheetTitle>
             {/* Ajouter la description de la pièce ici si souhaité */}
             {selectedRoomInfo && <p className="text-sm text-muted-foreground">Pièce : {selectedRoomInfo.name}</p>}
          </SheetHeader>

          <div className="py-4">
            {/* S'assurer que selectedRoomInfo est passé si nécessaire au formulaire */}
            <TravailForm
              piece={selectedRoomInfo ?? undefined} // Passer la pièce sélectionnée
              onAddTravail={handleSubmitTravail} // Utilise la nouvelle fonction unifiée
              travailAModifier={travailAModifier}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Layout>
  );
};

export default Travaux;