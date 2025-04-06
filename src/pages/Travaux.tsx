
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import TravailForm from '@/features/travaux/components/TravailForm';
import TravauxList from '@/features/travaux/components/TravauxList';
import { useProject } from '@/contexts/ProjectContext';
import { Room, Travail, Piece } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

const Travaux: React.FC = () => {
  const { state, dispatch } = useProject();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTravail, setEditingTravail] = useState<Travail | null>(null);
  const [filteredTravaux, setFilteredTravaux] = useState<Travail[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredTravaux(state.travaux);
    } else {
      setFilteredTravaux(state.travaux.filter(travail => travail.pieceId === filter));
      
      // Mettre à jour la pièce sélectionnée
      const piece = roomsAsPieces.find(p => p.id === filter);
      setSelectedPiece(piece || null);
    }
  }, [state.travaux, filter]);

  const handleAddTravail = () => {
    setEditingTravail(null);
    setIsFormOpen(true);
  };

  const handleEditTravail = (travail: Travail) => {
    setEditingTravail(travail);
    setIsFormOpen(true);
    
    // Mettre à jour le filtre et la pièce sélectionnée
    setFilter(travail.pieceId);
    const piece = roomsAsPieces.find(p => p.id === travail.pieceId);
    setSelectedPiece(piece || null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTravail(null);
  };

  const handleDeleteTravail = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce travail ?')) {
      dispatch({ type: 'DELETE_TRAVAIL', payload: id });
      toast({
        title: 'Travail supprimé',
        description: 'Le travail a été supprimé avec succès.',
      });
    }
  };

  const handleSaveTravail = (travailData: Omit<Travail, 'id'>) => {
    if (editingTravail) {
      dispatch({ 
        type: 'UPDATE_TRAVAIL', 
        payload: { ...travailData, id: editingTravail.id } 
      });
      toast({
        title: 'Travail mis à jour',
        description: 'Le travail a été mis à jour avec succès.',
      });
    } else {
      dispatch({ 
        type: 'ADD_TRAVAIL', 
        payload: { ...travailData, id: uuidv4() } 
      });
      toast({
        title: 'Travail ajouté',
        description: 'Le nouveau travail a été ajouté avec succès.',
      });
    }
    setIsFormOpen(false);
    setEditingTravail(null);
  };

  // Convertir les objets Room en objets Piece pour les passer au formulaire
  const roomsAsPieces: Piece[] = state.rooms.map(room => {
    return {
      id: room.id,
      name: room.name,
      type: room.type,
      customName: room.customName || "",
      surface: room.surface,
      menuiseries: room.menuiseries || [],
      wallSurfaceRaw: room.wallSurfaceRaw,
      autresSurfaces: room.autresSurfaces || [],
      totalPlinthSurface: room.totalPlinthSurface,
      plinthHeight: room.plinthHeight,
      length: room.length,
      width: room.width,
      height: room.height,
      volume: room.volume || "0",
      
      // Propriétés supplémentaires pour correspondre à l'interface Piece
      surfaceNetteSol: room.surfaceNetteSol,
      surfaceNettePlafond: room.surfaceNettePlafond,
      surfaceNetteMurs: room.netWallSurface,
      lineaireNet: room.lineaireNet || "0",
      surfaceMenuiseries: room.totalMenuiserieSurface,
      netWallSurface: room.netWallSurface,
      totalPlinthLength: room.totalPlinthLength,
      totalMenuiserieSurface: room.totalMenuiserieSurface,
      menuiseriesMursSurface: room.menuiseriesMursSurface,
      menuiseriesPlafondSurface: room.menuiseriesPlafondSurface,
      menuiseriesSolSurface: room.menuiseriesSolSurface,
      autresSurfacesMurs: room.autresSurfacesMurs,
      autresSurfacesPlafond: room.autresSurfacesPlafond,
      autresSurfacesSol: room.autresSurfacesSol
    };
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour
            </Button>
          </Link>
          <h1 className="text-2xl font-bold ml-4">Gestion des Travaux</h1>
        </div>
        <Button onClick={handleAddTravail} disabled={isFormOpen}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un travail
        </Button>
      </div>

      {isFormOpen ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingTravail ? 'Modifier un travail' : 'Ajouter un travail'}</CardTitle>
          </CardHeader>
          <CardContent>
            <TravailForm
              piece={selectedPiece}
              onAddTravail={handleSaveTravail}
              travailAModifier={editingTravail}
            />
          </CardContent>
        </Card>
      ) : (
        <TravauxList
          pieceId={filter}
          onStartEdit={(id) => {
            const travail = state.travaux.find(t => t.id === id);
            if (travail) {
              handleEditTravail(travail);
            }
          }}
        />
      )}

      <div className="mt-6">
        <Link to="/recapitulatif">
          <Button className="w-full">
            <Save className="mr-2 h-4 w-4" /> Finaliser et voir le récapitulatif
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Travaux;
