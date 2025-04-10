
import React, { useState } from 'react';
import { useAutresSurfacesWithSupabase } from '@/hooks/useAutresSurfacesWithSupabase';
import { AutreSurface, TypeAutreSurface } from '@/types';
import AutresSurfacesList from './AutresSurfacesList';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AutreSurfaceForm from '@/features/renovation/components/AutreSurfaceForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';

export interface RoomCustomItemsProps {
  roomId: string;
  isLocalMode?: boolean;
  autresSurfaces?: AutreSurface[];
  onAddAutreSurface?: (surface: Omit<AutreSurface, 'id' | 'surface'>, quantity?: number) => Promise<AutreSurface[]> | AutreSurface[];
  onUpdateAutreSurface?: (id: string, surface: Partial<Omit<AutreSurface, 'id' | 'surface'>>) => Promise<AutreSurface> | AutreSurface;
  onDeleteAutreSurface?: (id: string) => Promise<void> | void;
}

const RoomCustomItems: React.FC<RoomCustomItemsProps> = ({
  roomId,
  isLocalMode = false,
  autresSurfaces: externalAutresSurfaces,
  onAddAutreSurface: externalAddHandler,
  onUpdateAutreSurface: externalUpdateHandler,
  onDeleteAutreSurface: externalDeleteHandler
}) => {
  const [showForm, setShowForm] = useState(false);
  
  // Utiliser le hook Supabase pour les autres surfaces si on n'est pas en mode local
  const {
    autresSurfaces: supabaseAutresSurfaces,
    typesAutresSurfaces,
    loading,
    error,
    addAutreSurface,
    updateAutreSurfaceItem,
    deleteAutreSurfaceItem
  } = useAutresSurfacesWithSupabase(isLocalMode ? undefined : roomId);
  
  // Déterminer quelles données utiliser (local ou Supabase)
  const autresSurfaces = isLocalMode ? externalAutresSurfaces || [] : supabaseAutresSurfaces;
  
  // Handlers pour les actions
  const handleAddSurface = async (surface: Omit<AutreSurface, 'id' | 'surface'>, quantity?: number) => {
    if (isLocalMode && externalAddHandler) {
      return externalAddHandler(surface, quantity);
    } else {
      return await addAutreSurface(surface, quantity);
    }
  };
  
  const handleUpdateSurface = async (id: string, changes: Partial<Omit<AutreSurface, 'id' | 'surface'>>) => {
    if (isLocalMode && externalUpdateHandler) {
      return externalUpdateHandler(id, changes);
    } else {
      const result = await updateAutreSurfaceItem(id, changes);
      return result || {} as AutreSurface;
    }
  };
  
  const handleDeleteSurface = async (id: string) => {
    if (isLocalMode && externalDeleteHandler) {
      externalDeleteHandler(id);
    } else {
      await deleteAutreSurfaceItem(id);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Autres surfaces</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setShowForm(!showForm)}
        >
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only">Ajouter une surface</span>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            {showForm && (
              <div className="mb-4">
                <AutreSurfaceForm
                  autresSurfaceTypes={typesAutresSurfaces || []}
                  onSubmit={(data, quantity) => {
                    handleAddSurface(data, quantity);
                    setShowForm(false);
                  }}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}
            
            <AutresSurfacesList
              surfaces={autresSurfaces}
              onUpdate={handleUpdateSurface}
              onDelete={handleDeleteSurface}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RoomCustomItems;
