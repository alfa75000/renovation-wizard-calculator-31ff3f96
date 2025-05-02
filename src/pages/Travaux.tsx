import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlusCircle, ArrowLeft, ArrowRight, Paintbrush } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout"; // Assurez-vous que le chemin est correct
import { useProject } from "@/contexts/ProjectContext";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";
import { Room, Travail, MenuiserieItem, AutreSurfaceItem } from "@/types";
import { toast } from "sonner";
import TravailForm from "@/features/travaux/components/TravailForm";
import TravauxList from "@/features/travaux/components/TravauxList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
// Pas besoin d'importer useCalculSurfaces ici

// --- Composant PieceSelect ---
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
            {/* Utiliser optional chaining pour les propriétés */}
            {piece.name} ({piece.surface?.toFixed(2) ?? 'N/A'} m²)
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
// --- Fin Composant PieceSelect ---


// --- Composant Principal Travaux ---
const Travaux: React.FC = () => {
  const { state: projectState } = useProject();
  const { rooms } = projectState || { rooms: [] }; // Gestion état initial/null
  const { getTravauxForPiece, addTravail, deleteTravail, updateTravail } = useTravaux();

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [travailAModifier, setTravailAModifier] = useState<Travail | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string>("piece"); // 'piece' par défaut

  // Effet pour sélectionner la première pièce ou réinitialiser
  useEffect(() => {
    if (!selectedRoomId && rooms.length > 0) {
      setSelectedRoomId(rooms[0].id);
      setSelectedElementId("piece");
    }
    // Vérifier si la pièce sélectionnée existe toujours dans la liste
    if (selectedRoomId && !rooms.some(room => room.id === selectedRoomId)) {
      const newSelectedRoomId = rooms.length > 0 ? rooms[0].id : null;
      setSelectedRoomId(newSelectedRoomId);
      setSelectedElementId("piece"); // Réinitialiser le filtre aussi
    }
  }, [rooms, selectedRoomId]); // Retrait de setSelectedRoomId des dépendances pour éviter boucle potentielle

  // Calculer les infos de la pièce sélectionnée
  const selectedRoomInfo = useMemo(() => {
     return selectedRoomId ? rooms.find(room => room.id === selectedRoomId) ?? null : null;
  }, [selectedRoomId, rooms]);

  // Récupérer directement le linéaire net depuis l'objet Room
  const linearNetPlinthes = useMemo(() => {
    // Utilise la propriété confirmée 'lineaireNet'
    return selectedRoomInfo?.lineaireNet ?? 0;
  }, [selectedRoomInfo]);

  // Construction de la liste des éléments pour le Select
  const selectElements = useMemo(() => {
    if (!selectedRoomInfo) return [{ id: "piece", name: "Pièce (Tous travaux)" }];

    const elements: { id: string; name: string }[] = [
        { id: "piece", name: `Pièce : ${selectedRoomInfo.name} (Tous travaux)` },
        ...(linearNetPlinthes > 0 ? [{ id: "plinthes", name: `Plinthes (${linearNetPlinthes.toFixed(2)} ml)` }] : []),
    ];

    if (selectedRoomInfo.menuiseries?.length) {
        selectedRoomInfo.menuiseries.forEach((m: MenuiserieItem) => {
            const itemName = m.description || `Menuiserie (${m.largeur || '?'})x(${m.hauteur || '?'})`;
            elements.push({ id: `menuiserie-${m.id}`, name: itemName });
        });
    }
    if (selectedRoomInfo.autresSurfaces?.length) {
        selectedRoomInfo.autresSurfaces.forEach((a: AutreSurfaceItem) => {
             const itemName = a.description || `Autre Surface (${a.quantite} ${a.unite})`;
             elements.push({ id: `surface-${a.id}`, name: itemName });
        });
    }

    return elements;
  }, [selectedRoomInfo, linearNetPlinthes]);


  // Ouvre la sheet pour ajouter un travail
  const handleAddTravailClick = () => {
    if (!selectedRoomId) {
      toast.error("Veuillez d'abord sélectionner une pièce.");
      return;
    }
    setTravailAModifier(null); // Mode ajout
    setIsDrawerOpen(true);
  };

  // Ouvre la sheet pour modifier un travail existant
  const handleStartEditTravail = (travail: Travail) => {
    setTravailAModifier(travail); // Mode édition
    setIsDrawerOpen(true);
  };

  // Gère la soumission du formulaire depuis la sheet
  const handleSubmitTravail = (travailData: Omit<Travail, 'id'> | Travail) => {
    if (!selectedRoomId) {
        toast.error("Aucune pièce n'est sélectionnée pour ajouter le travail.");
        return;
    }

    try {
        if (travailAModifier && 'id' in travailData && travailData.id === travailAModifier.id) {
            // Modification : passer l'ID et les données mises à jour
            updateTravail(travailAModifier.id, travailData);
            toast.success("Le travail a été modifié avec succès.");
            setTravailAModifier(null);
        } else {
            // Ajout : s'assurer que pieceId est bien l'ID de la pièce sélectionnée
            addTravail({
                ...(travailData as Omit<Travail, 'id'>), // Exclure l'id potentiel venant du formulaire
                pieceId: selectedRoomId,
            });
            toast.success("Le travail a été ajouté avec succès.");
        }
        setIsDrawerOpen(false); // Fermer la sheet après succès
     } catch(error) {
        console.error("Erreur lors de la sauvegarde du travail:", error);
        toast.error("Erreur lors de l'enregistrement du travail.");
        // Ne pas fermer la sheet en cas d'erreur pour permettre correction
     }
  };

  return (
    <Layout
      title="Définir les Travaux"
      subtitle="Sélectionnez une pièce et ajoutez les travaux à effectuer"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne Sélection Pièce */}
        <Card className="order-2 lg:order-1">
          <CardHeader>
            <CardTitle>Pièces</CardTitle>
            <CardDescription>
              Sélectionnez une pièce pour voir ou ajouter des travaux
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PieceSelect
              pieces={rooms}
              selectedPieceId={selectedRoomId}
              onSelect={(id) => {
                 setSelectedRoomId(id);
                 setSelectedElementId("piece");
              }}
            />
          </CardContent>
        </Card>

        {/* Colonne Travaux */}
        <Card className="lg:col-span-2 order-1 lg:order-2">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                    Surface: {selectedRoomInfo.surface?.toFixed(2) ?? 'N/A'} m² - Hauteur: {selectedRoomInfo.hauteur?.toFixed(2) ?? 'N/A'} m
                 </CardDescription>
              )}
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <Button
                onClick={handleAddTravailClick}
                disabled={!selectedRoomId}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <PlusCircle className="h-4 w-4" />
                Ajouter un travail
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtre Select */}
            {selectedRoomId && (
                <div className="mb-6">
                    <Label htmlFor="element-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Ajouter un travail relatif à :
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
                    </div>
            )}

            <h3 className="text-lg font-medium mb-3 border-t pt-4">Liste des Travaux</h3>
            {/* Affichage de la liste */}
            <TravauxList
                pieceId={selectedRoomId}
                selectedRoomInfo={selectedRoomInfo}
                onStartEdit={handleStartEditTravail} // Passe le handler pour démarrer l'édition
            />
          </CardContent>
        </Card>
      </div>

      {/* Boutons de navigation */}
      <div className="flex justify-between mt-8">
        <Button asChild variant="outline" className="flex items-center gap-2">
          <Link to="/chantier">
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
             {selectedRoomInfo && <p className="text-sm text-muted-foreground">Pièce : {selectedRoomInfo.name}</p>}
          </SheetHeader>
          <div className="py-4">
            <TravailForm
              piece={selectedRoomInfo ?? undefined}
              onAddTravail={handleSubmitTravail}
              travailAModifier={travailAModifier}
              // Passer le contexte et le linéaire pré-calculé
              selectedElementContext={selectedElementId}
              calculatedLinear={selectedElementId === 'plinthes' ? linearNetPlinthes : undefined}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Layout>
  );
};

export default Travaux;