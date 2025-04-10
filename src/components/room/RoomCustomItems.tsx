
import React, { useState, useEffect } from 'react';
import { useRoom } from '@/hooks/useRoom';
import { useAutresSurfaces } from '@/hooks/useAutresSurfaces';
import { AutreSurface, TypeAutreSurface } from '@/types';
import { AutresSurfacesList } from './AutresSurfacesList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AutreSurfaceForm } from '@/features/renovation/components/AutreSurfaceForm';
import { useAutresSurfacesWithSupabase } from '@/hooks/useAutresSurfacesWithSupabase';
import { Loader } from '@/components/ui/loader';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { PlusCircle, UploadCloud, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export interface RoomCustomItemsProps {
  roomId: string;
}

const RoomCustomItems = ({ roomId }: RoomCustomItemsProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncingToSupabase, setSyncingToSupabase] = useState(false);
  const { room } = useRoom(roomId);
  const { 
    autresSurfaces: localAutresSurfaces, 
    typesAutresSurfaces: localTypesAutresSurfaces, 
    addAutreSurface: addLocalAutreSurface,
    updateAutreSurfaceItem: updateLocalAutreSurface,
    deleteAutreSurfaceItem: deleteLocalAutreSurface
  } = useAutresSurfaces();
  
  // Hooks pour Supabase
  const {
    autresSurfaces: supabaseAutresSurfaces,
    typesAutresSurfaces: supabaseTypesAutresSurfaces,
    loading: supabaseLoading,
    error: supabaseError,
    addAutreSurface: addSupabaseAutreSurface,
    updateAutreSurfaceItem: updateSupabaseAutreSurface,
    deleteAutreSurfaceItem: deleteSupabaseAutreSurface,
    synchronizeLocalSurfaces
  } = useAutresSurfacesWithSupabase(roomId);
  
  // État pour suivre la source des données (local ou Supabase)
  const [useSupabase, setUseSupabase] = useState(true);
  
  // Données à afficher en fonction de la source
  const autresSurfaces = useSupabase ? supabaseAutresSurfaces : localAutresSurfaces.filter(s => s.id.includes(roomId));
  const typesAutresSurfaces = useSupabase ? supabaseTypesAutresSurfaces : localTypesAutresSurfaces;
  
  // Fonction pour ajouter une autre surface
  const handleAddAutreSurface = async (surface: Omit<AutreSurface, 'id' | 'surface'>, quantity: number = 1) => {
    setLoading(true);
    try {
      if (useSupabase) {
        // Ajouter via Supabase
        const addedItems = await addSupabaseAutreSurface(surface, quantity);
        if (addedItems.length > 0) {
          toast.success(`Surface ajoutée avec succès`);
          setIsFormOpen(false);
        }
      } else {
        // Ajouter en local
        for (let i = 0; i < quantity; i++) {
          await addLocalAutreSurface({
            ...surface,
            id: `${roomId}-${Date.now()}-${i}`,
            surface: surface.largeur * surface.hauteur,
          });
        }
        toast.success(`Surface ajoutée avec succès`);
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la surface:', error);
      toast.error('Impossible d\'ajouter la surface');
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour mettre à jour une autre surface
  const handleUpdateAutreSurface = async (id: string, changes: Partial<Omit<AutreSurface, 'id' | 'surface'>>) => {
    setLoading(true);
    try {
      if (useSupabase) {
        // Mettre à jour via Supabase
        const updated = await updateSupabaseAutreSurface(id, changes);
        if (updated) {
          toast.success('Surface mise à jour avec succès');
        }
      } else {
        // Mettre à jour en local
        await updateLocalAutreSurface(id, changes);
        toast.success('Surface mise à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la surface:', error);
      toast.error('Impossible de mettre à jour la surface');
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour supprimer une autre surface
  const handleDeleteAutreSurface = async (id: string) => {
    setLoading(true);
    try {
      if (useSupabase) {
        // Supprimer via Supabase
        await deleteSupabaseAutreSurface(id);
        toast.success('Surface supprimée avec succès');
      } else {
        // Supprimer en local
        await deleteLocalAutreSurface(id);
        toast.success('Surface supprimée avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la surface:', error);
      toast.error('Impossible de supprimer la surface');
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour synchroniser les surfaces locales vers Supabase
  const handleSyncToSupabase = async () => {
    if (!roomId) return;
    
    setSyncingToSupabase(true);
    try {
      // Filtrer les surfaces locales pour cette pièce
      const surfacesToSync = localAutresSurfaces.filter(s => s.id.includes(roomId));
      
      // Convertir pour Supabase (retirer les IDs locaux)
      const convertedSurfaces = surfacesToSync.map(s => ({
        room_id: roomId,
        type: 'autre',
        name: s.name,
        designation: s.designation,
        largeur: s.largeur,
        hauteur: s.hauteur,
        surface: s.surface,
        quantity: s.quantity,
        surface_impactee: s.surfaceImpactee === 'mur' ? 'Mur' : 
                        s.surfaceImpactee === 'plafond' ? 'Plafond' : 'Sol',
        adjustment_type: s.estDeduction ? 'Déduire' : 'Ajouter',
        impacte_plinthe: s.impactePlinthe,
        description: s.description,
        updated_at: new Date().toISOString()
      }));
      
      const success = await synchronizeLocalSurfaces(roomId, surfacesToSync);
      
      if (success) {
        toast.success('Synchronisation avec Supabase réussie');
        setUseSupabase(true);
      } else {
        toast.error('Échec de la synchronisation avec Supabase');
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation avec Supabase:', error);
      toast.error('Erreur lors de la synchronisation avec Supabase');
    } finally {
      setSyncingToSupabase(false);
    }
  };
  
  // Affichage conditionnel en fonction de l'état de chargement et des erreurs
  if (useSupabase && supabaseLoading && autresSurfaces.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Autres surfaces</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Loader />
        </CardContent>
      </Card>
    );
  }
  
  if (useSupabase && supabaseError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Autres surfaces</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de chargement</AlertTitle>
            <AlertDescription>
              Impossible de charger les données depuis Supabase. 
              {supabaseError}
            </AlertDescription>
          </Alert>
          <Button 
            variant="secondary" 
            onClick={() => setUseSupabase(false)} 
            className="mt-4"
          >
            Utiliser les données locales
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Autres surfaces</CardTitle>
        <div className="flex space-x-2">
          {!useSupabase && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleSyncToSupabase}
              disabled={syncingToSupabase}
            >
              {syncingToSupabase ? (
                <Loader size="sm" className="mr-2" />
              ) : (
                <UploadCloud className="h-4 w-4 mr-2" />
              )}
              Synchroniser avec Supabase
            </Button>
          )}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Ajouter une autre surface</DialogTitle>
              </DialogHeader>
              <AutreSurfaceForm 
                typesAutresSurfaces={typesAutresSurfaces}
                onSubmit={handleAddAutreSurface}
                onCancel={() => setIsFormOpen(false)}
                loading={loading}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <AutresSurfacesList 
          surfaces={autresSurfaces} 
          onUpdate={handleUpdateAutreSurface}
          onDelete={handleDeleteAutreSurface}
          loading={loading}
        />
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          {useSupabase ? 'Données synchronisées avec Supabase' : 'Données locales (non synchronisées)'}
        </div>
      </CardFooter>
    </Card>
  );
};

export default RoomCustomItems;
