
import React, { useState, useEffect } from 'react';
import { useRoomCustomItemsWithSupabase } from '@/hooks/useRoomCustomItemsWithSupabase';
import { RoomCustomItem } from '@/types/supabase';
import { AutreSurface, TypeAutreSurface } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, AlertCircle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import AutreSurfaceForm from '@/features/renovation/components/AutreSurfaceForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useAutresSurfaces } from '@/hooks/useAutresSurfaces';
import { useContext } from '@/contexts/AutresSurfacesContext';

interface RoomCustomItemsProps {
  roomId?: string;
  // Nouvelles props pour le mode local
  isLocalMode?: boolean;
  autresSurfaces?: AutreSurface[];
  onAddAutreSurface?: (surface: Omit<AutreSurface, 'id' | 'surface'>, quantity?: number) => AutreSurface[];
  onUpdateAutreSurface?: (id: string, surface: Partial<Omit<AutreSurface, 'id' | 'surface'>>) => AutreSurface | null;
  onDeleteAutreSurface?: (id: string) => void;
}

const RoomCustomItems: React.FC<RoomCustomItemsProps> = ({ 
  roomId,
  isLocalMode = false,
  autresSurfaces = [],
  onAddAutreSurface,
  onUpdateAutreSurface,
  onDeleteAutreSurface
}) => {
  // Utiliser Supabase uniquement si on n'est pas en mode local
  const {
    customItems,
    loading,
    error,
    addCustomItem,
    updateCustomItem,
    deleteCustomItem,
    fetchCustomItemTypes
  } = useRoomCustomItemsWithSupabase(isLocalMode ? undefined : roomId);

  const { state: autresSurfacesState } = useContext();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [typesAutresSurfaces, setTypesAutresSurfaces] = useState<TypeAutreSurface[]>([]);

  useEffect(() => {
    const loadTypes = async () => {
      if (isLocalMode) {
        // Utiliser les types d'autres surfaces du contexte
        setTypesAutresSurfaces(autresSurfacesState.typesAutresSurfaces);
      } else {
        // Utiliser les types d'autres surfaces de Supabase
        const types = await fetchCustomItemTypes();
        setTypesAutresSurfaces(types.map(type => ({
          id: type.id,
          nom: type.name,
          description: type.description || '',
          largeur: type.largeur || 0,
          hauteur: type.hauteur || 0,
          surfaceImpacteeParDefaut: type.surface_impactee.toLowerCase() as any,
          estDeduction: type.adjustment_type === 'Déduire',
          impactePlinthe: type.impacte_plinthe
        })));
      }
    };
    
    loadTypes();
  }, [isLocalMode]);

  const handleSubmit = async (data: any) => {
    if (isLocalMode && onAddAutreSurface && !editingItemId) {
      // Mode local - ajout
      const newSurface: Omit<AutreSurface, 'id' | 'surface'> = {
        type: data.type || data.type_id,
        name: data.name,
        designation: data.designation || data.name,
        largeur: data.largeur,
        hauteur: data.hauteur,
        quantity: data.quantity || 1,
        surfaceImpactee: data.surfaceImpactee || data.surface_impactee,
        estDeduction: data.estDeduction || data.adjustment_type === 'deduire',
        impactePlinthe: data.impactePlinthe || data.impacte_plinthe,
        description: data.description || ''
      };
      
      onAddAutreSurface(newSurface, data.quantity);
      setShowAddForm(false);
    }
    else if (isLocalMode && onUpdateAutreSurface && editingItemId) {
      // Mode local - mise à jour
      const updatedSurface: Partial<Omit<AutreSurface, 'id' | 'surface'>> = {
        type: data.type || data.type_id,
        name: data.name,
        designation: data.designation || data.name,
        largeur: data.largeur,
        hauteur: data.hauteur,
        quantity: data.quantity || 1,
        surfaceImpactee: data.surfaceImpactee || data.surface_impactee,
        estDeduction: data.estDeduction || data.adjustment_type === 'deduire',
        impactePlinthe: data.impactePlinthe || data.impacte_plinthe,
        description: data.description || ''
      };
      
      onUpdateAutreSurface(editingItemId, updatedSurface);
      setEditingItemId(null);
    }
    else {
      // Mode Supabase
      const newItem: Omit<RoomCustomItem, 'id' | 'created_at'> = {
        room_id: roomId || '',
        type: data.type_id || 'custom',
        name: data.name,
        designation: data.designation || data.name,
        largeur: data.largeur,
        hauteur: data.hauteur,
        surface: data.surface,
        quantity: data.quantity,
        surface_impactee: data.surfaceImpactee || data.surface_impactee,
        adjustment_type: data.estDeduction || data.adjustment_type === 'deduire' ? 'Déduire' : 'Ajouter',
        impacte_plinthe: data.impactePlinthe || data.impacte_plinthe,
        description: data.description || null
      };

      if (editingItemId) {
        await updateCustomItem(editingItemId, newItem);
        setEditingItemId(null);
      } else {
        await addCustomItem(newItem);
        setShowAddForm(false);
      }
    }
  };

  const handleEdit = (item: RoomCustomItem | AutreSurface) => {
    setEditingItemId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      if (isLocalMode && onDeleteAutreSurface) {
        onDeleteAutreSurface(id);
      } else {
        await deleteCustomItem(id);
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingItemId(null);
  };

  // Fonction pour obtenir les items à afficher (en mode local ou Supabase)
  const getItemsToDisplay = (): (RoomCustomItem | AutreSurface)[] => {
    if (isLocalMode) {
      return autresSurfaces;
    } else {
      return customItems;
    }
  };

  const getFormattedItem = (item: RoomCustomItem | AutreSurface) => {
    if ('surface_impactee' in item) {
      // C'est un RoomCustomItem
      return {
        name: item.name,
        type: item.type,
        designation: item.designation || item.name,
        largeur: item.largeur,
        hauteur: item.hauteur,
        surface: item.surface,
        quantity: item.quantity,
        surfaceImpactee: item.surface_impactee.toLowerCase(),
        estDeduction: item.adjustment_type === 'Déduire',
        impactePlinthe: item.impacte_plinthe,
        description: item.description || '',
        id: item.id
      };
    } else {
      // C'est une AutreSurface
      return {
        name: item.name,
        type: item.type,
        designation: item.designation,
        largeur: item.largeur,
        hauteur: item.hauteur,
        surface: item.surface,
        quantity: item.quantity || 1,
        surfaceImpactee: item.surfaceImpactee,
        estDeduction: item.estDeduction,
        impactePlinthe: item.impactePlinthe,
        description: item.description || '',
        id: item.id
      };
    }
  };

  // Fonction pour déterminer si un item est une déduction
  const isItemDeduction = (item: RoomCustomItem | AutreSurface): boolean => {
    if ('adjustment_type' in item) {
      return item.adjustment_type === 'Déduire';
    } else {
      return item.estDeduction;
    }
  };

  // Fonction pour obtenir la surface impactée
  const getItemSurfaceImpactee = (item: RoomCustomItem | AutreSurface): string => {
    if ('surface_impactee' in item) {
      return item.surface_impactee;
    } else {
      return item.surfaceImpactee.charAt(0).toUpperCase() + item.surfaceImpactee.slice(1);
    }
  };

  // Ne pas afficher d'erreur si nous n'avons pas encore d'ID de pièce et qu'on n'est pas en mode local
  if (error && roomId && !isLocalMode) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Surfaces personnalisées</h3>
        {(roomId || isLocalMode) && !showAddForm && !editingItemId && (
          <Button
            onClick={() => setShowAddForm(true)}
            variant="outline"
            size="sm"
            disabled={loading && !isLocalMode}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter une surface
          </Button>
        )}
      </div>

      {loading && !isLocalMode && !getItemsToDisplay().length && (
        <div className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {!roomId && !isLocalMode && (
        <div className="py-8 text-center text-gray-500">
          <p>Les surfaces personnalisées pourront être ajoutées après la création de la pièce</p>
        </div>
      )}

      {((roomId && !loading && !getItemsToDisplay().length && !showAddForm && !isLocalMode) ||
        (isLocalMode && !getItemsToDisplay().length && !showAddForm)) && (
        <div className="py-8 text-center text-gray-500">
          <p>Aucune surface personnalisée ajoutée</p>
          <p className="text-sm">
            Ajoutez des surfaces personnalisées pour prendre en compte des éléments
            spécifiques dans vos calculs (niches, trémies, etc.)
          </p>
        </div>
      )}

      {showAddForm && (roomId || isLocalMode) && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ajouter une surface personnalisée</CardTitle>
            <CardDescription>
              Définissez les caractéristiques de la surface à ajouter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AutreSurfaceForm
              roomId={roomId}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              typesAutresSurfaces={typesAutresSurfaces}
            />
          </CardContent>
        </Card>
      )}

      {editingItemId && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Modifier la surface</CardTitle>
            <CardDescription>
              Modifiez les caractéristiques de cette surface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AutreSurfaceForm
              roomId={roomId}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              itemToEdit={getFormattedItem(
                getItemsToDisplay().find(item => item.id === editingItemId)!
              )}
              typesAutresSurfaces={typesAutresSurfaces}
            />
          </CardContent>
        </Card>
      )}

      {getItemsToDisplay().length > 0 && !editingItemId && (
        <div className="space-y-3 mt-4">
          {getItemsToDisplay().map((item) => (
            <Card key={item.id} className={isItemDeduction(item) ? 'border-red-200' : 'border-green-200'}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {item.name}
                      {isItemDeduction(item) ? (
                        <Badge variant="destructive" className="ml-2">
                          <ArrowDownCircle className="h-3 w-3 mr-1" />
                          Déduction
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="ml-2 bg-green-600 hover:bg-green-700">
                          <ArrowUpCircle className="h-3 w-3 mr-1" />
                          Ajout
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {item.designation || item.name} - Surface impactée: {getItemSurfaceImpactee(item)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Dimensions:</span> {item.largeur}m × {item.hauteur}m
                  </div>
                  <div>
                    <span className="font-medium">Quantité:</span> {item.quantity}
                  </div>
                  <div>
                    <span className="font-medium">Surface totale:</span> {item.surface}m²
                  </div>
                  <div>
                    <span className="font-medium">Impacte plinthes:</span> {'impacte_plinthe' in item ? (item.impacte_plinthe ? 'Oui' : 'Non') : (item.impactePlinthe ? 'Oui' : 'Non')}
                  </div>
                </div>
                {(('description' in item && item.description) || ('description' in item && item.description)) && (
                  <>
                    <Separator className="my-2" />
                    <div className="text-sm">
                      <span className="font-medium">Description:</span> {'description' in item ? item.description : item.description}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomCustomItems;
