
import React, { useState, useEffect } from 'react';
import { useRoomCustomItemsWithSupabase } from '@/hooks/useRoomCustomItemsWithSupabase';
import { RoomCustomItem } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, AlertCircle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { AutreSurfaceForm } from '@/features/renovation/components/AutreSurfaceForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface RoomCustomItemsProps {
  roomId?: string;
}

const RoomCustomItems: React.FC<RoomCustomItemsProps> = ({ roomId }) => {
  const {
    customItems,
    loading,
    error,
    addCustomItem,
    updateCustomItem,
    deleteCustomItem,
    fetchCustomItemTypes
  } = useRoomCustomItemsWithSupabase(roomId);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [typesAutresSurfaces, setTypesAutresSurfaces] = useState<any[]>([]);

  useEffect(() => {
    const loadTypes = async () => {
      const types = await fetchCustomItemTypes();
      setTypesAutresSurfaces(types);
    };
    
    loadTypes();
  }, []);

  const handleSubmit = async (data: any) => {
    // Convertir les données au format attendu par l'API
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
  };

  const handleEdit = (item: RoomCustomItem) => {
    setEditingItemId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      await deleteCustomItem(id);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingItemId(null);
  };

  const getFormattedItem = (item: RoomCustomItem) => {
    // Convertir l'élément au format attendu par le formulaire
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
  };

  if (error) {
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
        {!showAddForm && !editingItemId && (
          <Button
            onClick={() => setShowAddForm(true)}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter une surface
          </Button>
        )}
      </div>

      {loading && !customItems.length && (
        <div className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {!loading && !customItems.length && !showAddForm && (
        <div className="py-8 text-center text-gray-500">
          <p>Aucune surface personnalisée ajoutée</p>
          <p className="text-sm">
            Ajoutez des surfaces personnalisées pour prendre en compte des éléments
            spécifiques dans vos calculs (niches, trémies, etc.)
          </p>
        </div>
      )}

      {showAddForm && (
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
              typesAutresSurfaces={typesAutresSurfaces.map(type => ({
                id: type.id,
                nom: type.name,
                description: type.description || '',
                largeur: type.largeur || 0,
                hauteur: type.hauteur || 0,
                surfaceImpacteeParDefaut: type.surface_impactee.toLowerCase(),
                estDeduction: type.adjustment_type === 'Déduire',
                impactePlinthe: type.impacte_plinthe
              }))}
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
                customItems.find(item => item.id === editingItemId)!
              )}
              typesAutresSurfaces={typesAutresSurfaces.map(type => ({
                id: type.id,
                nom: type.name,
                description: type.description || '',
                largeur: type.largeur || 0,
                hauteur: type.hauteur || 0,
                surfaceImpacteeParDefaut: type.surface_impactee.toLowerCase(),
                estDeduction: type.adjustment_type === 'Déduire',
                impactePlinthe: type.impacte_plinthe
              }))}
            />
          </CardContent>
        </Card>
      )}

      {customItems.length > 0 && !editingItemId && (
        <div className="space-y-3 mt-4">
          {customItems.map((item) => (
            <Card key={item.id} className={item.adjustment_type === 'Déduire' ? 'border-red-200' : 'border-green-200'}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {item.name}
                      {item.adjustment_type === 'Déduire' ? (
                        <Badge variant="destructive" className="ml-2">
                          <ArrowDownCircle className="h-3 w-3 mr-1" />
                          Déduction
                        </Badge>
                      ) : (
                        <Badge variant="success" className="ml-2 bg-green-600">
                          <ArrowUpCircle className="h-3 w-3 mr-1" />
                          Ajout
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {item.designation || item.name} - Surface impactée: {item.surface_impactee}
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
                    <span className="font-medium">Impacte plinthes:</span> {item.impacte_plinthe ? 'Oui' : 'Non'}
                  </div>
                </div>
                {item.description && (
                  <>
                    <Separator className="my-2" />
                    <div className="text-sm">
                      <span className="font-medium">Description:</span> {item.description}
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
