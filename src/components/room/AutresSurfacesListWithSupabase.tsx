
import React from 'react';
import RoomCustomItems from './RoomCustomItems';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAutresSurfacesWithSupabase } from '@/hooks/useAutresSurfacesWithSupabase';
import { Loader } from '@/components/ui/loader';
import { AutreSurface } from '@/types';
import { surfaceTypeToDb } from '@/utils/surfaceTypesAdapter';

interface AutresSurfacesListWithSupabaseProps {
  roomId: string;
}

const AutresSurfacesListWithSupabase: React.FC<AutresSurfacesListWithSupabaseProps> = ({ roomId }) => {
  const { autresSurfaces, loading, error, addAutreSurface, updateAutreSurfaceItem, deleteAutreSurfaceItem } = useAutresSurfacesWithSupabase(roomId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Autres surfaces</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <Loader />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Autres surfaces</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  const handleAddSurface = async (surface: any, quantity?: number) => {
    // Make sure we have a surfaceImpactee value in the correct format for the DB
    if (surface && surface.surfaceImpactee) {
      surface.surfaceImpactee = surfaceTypeToDb(surface.surfaceImpactee);
    }
    const result = await addAutreSurface(surface, quantity || 1);
    return result || [];
  };

  const handleUpdateSurface = async (id: string, changes: Partial<Omit<AutreSurface, 'id' | 'surface'>>) => {
    // Make sure we have a surfaceImpactee value in the correct format for the DB
    if (changes && changes.surfaceImpactee) {
      changes.surfaceImpactee = surfaceTypeToDb(changes.surfaceImpactee);
    }
    const result = await updateAutreSurfaceItem(id, changes);
    return result as AutreSurface; 
  };

  const handleDeleteSurface = async (id: string) => {
    await deleteAutreSurfaceItem(id);
  };

  return (
    <div className="mt-4">
      <RoomCustomItems 
        roomId={roomId}
        autresSurfaces={autresSurfaces} 
        onAddAutreSurface={handleAddSurface}
        onUpdateAutreSurface={handleUpdateSurface}
        onDeleteAutreSurface={handleDeleteSurface}
      />
    </div>
  );
};

export default AutresSurfacesListWithSupabase;
