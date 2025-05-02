import React from 'react';
// Retrait de useState car non utilisé
// Retrait de Select et associés car déplacés dans Travaux.tsx
import { useTravaux } from '../hooks/useTravaux'; // Gardé pour deleteTravail
import TravailCard from './TravailCard';
import { Button } from '@/components/ui/button'; // Gardé pour le message vide
import { PlusCircle } from 'lucide-react'; // Gardé pour le message vide
import { useToast } from '@/hooks/use-toast'; // Renommé useToast pour cohérence
import { Travail, Room } from '@/types'; // Room ajouté pour typer la nouvelle prop

interface TravauxListProps {
  pieceId: string | null; // Peut être null si aucune pièce sélectionnée
  selectedRoomInfo: Room | null; // Nouvelle prop pour les infos de la pièce
  onStartEdit: (travail: Travail) => void; // Modifié pour passer le travail entier
  // onAddTravailClick: () => void; // Ajouté pour le bouton dans le message vide
}

// Note: Le calcul des totaux a été retiré car il est plus logique
// de le faire dans la page Recapitulatif ou un composant dédié aux totaux par pièce.
// TravauxList se concentre sur l'affichage de la liste des cartes.

const TravauxList: React.FC<TravauxListProps> = ({
  pieceId,
  selectedRoomInfo, // Utilisation de la nouvelle prop
  onStartEdit,
  // onAddTravailClick
}) => {
  const { getTravauxForPiece, deleteTravail } = useTravaux();
  const { toast } = useToast(); // Correction du nom du hook

  // Utiliser pieceId pour obtenir les travaux, vérifier si pieceId est non-null
  const travaux = pieceId ? getTravauxForPiece(pieceId) : [];

  const handleDelete = (id: string) => {
    try {
        deleteTravail(id); // deleteTravail vient maintenant de useTravaux
        toast({
            title: "Travail supprimé",
            description: "Le travail a été supprimé avec succès",
            variant: "default", // Ou "success" si défini dans votre toaster
        });
    } catch (error){
         console.error("Erreur lors de la suppression du travail:", error);
         toast({
            title: "Erreur",
            description: "Impossible de supprimer le travail.",
            variant: "destructive",
         });
    }
  };

  // handleEdit appelle maintenant onStartEdit directement
  const handleEdit = (travail: Travail) => {
    console.log("TravauxList: Demande d'édition pour:", travail);
    onStartEdit(travail); // Passe l'objet travail complet
  };

  // Retrait de la logique pour trouver selectedRoomInfo ici

  if (!pieceId || !selectedRoomInfo) {
     return (
       <div className="text-center py-6 border rounded-md bg-gray-50">
         <p className="text-gray-500">Veuillez sélectionner une pièce.</p>
       </div>
     );
  }

  if (travaux.length === 0) {
    return (
      <div className="text-center py-6 border rounded-md bg-gray-50">
        <p className="text-gray-500 mb-4">Aucun travail n'a été ajouté pour cette pièce ({selectedRoomInfo.name}).</p>
        {/* Le bouton Ajouter est maintenant géré dans Travaux.tsx */}
        {/*
        <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onAddTravailClick} // Appel de la prop
        >
          <PlusCircle className="h-4 w-4" />
          Ajouter le premier travail
        </Button>
        */}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {travaux.map(travail => (
        <TravailCard
          key={travail.id}
          travail={travail}
          onDelete={() => handleDelete(travail.id)}
          onEdit={() => handleEdit(travail)} // Utilise la fonction handleEdit locale
        />
      ))}
       {/* Retrait de la section des totaux */}
    </div>
  );
};

export default TravauxList;