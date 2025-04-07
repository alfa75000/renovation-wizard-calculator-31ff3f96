
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { AutreSurface } from '@/types';
import AutreSurfaceForm from '@/features/renovation/components/AutreSurfaceForm';
import { useAutresSurfaces } from '@/contexts/AutresSurfacesContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface AutresSurfacesListProps {
  autresSurfaces: AutreSurface[];
  onEdit: (id: string, surface: Partial<Omit<AutreSurface, 'id' | 'surface'>>) => AutreSurface | null;
  onDelete: (id: string) => void;
  onAdd: (surface: Omit<AutreSurface, 'id' | 'surface'>, quantity: number) => AutreSurface[];
}

const AutresSurfacesList: React.FC<AutresSurfacesListProps> = ({ 
  autresSurfaces, 
  onEdit, 
  onDelete,
  onAdd
}) => {
  const { state: autresSurfacesState } = useAutresSurfaces();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingSurfaceId, setEditingSurfaceId] = useState<string | null>(null);
  
  const handleAddAutreSurface = (autreSurface: Omit<AutreSurface, 'id' | 'surface'>) => {
    if (editingSurfaceId) {
      onEdit(editingSurfaceId, autreSurface);
      setEditingSurfaceId(null);
    } else {
      onAdd(autreSurface, autreSurface.quantity || 1);
    }
    
    setIsDrawerOpen(false);
  };
  
  const handleEditAutreSurface = (id: string) => {
    setEditingSurfaceId(id);
    setIsDrawerOpen(true);
  };
  
  const getCurrentAutreSurface = (): Omit<AutreSurface, 'id' | 'surface'> | null => {
    if (!editingSurfaceId) return null;
    
    const surface = autresSurfaces.find(item => item.id === editingSurfaceId);
    if (!surface) return null;
    
    return {
      type: surface.type,
      name: surface.name,
      designation: surface.designation,
      largeur: surface.largeur,
      hauteur: surface.hauteur,
      quantity: surface.quantity,
      surfaceImpactee: surface.surfaceImpactee,
      estDeduction: surface.estDeduction
    };
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Autres Surfaces</h3>
        <Button 
          onClick={() => {
            setEditingSurfaceId(null);
            setIsDrawerOpen(true);
          }}
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une surface
        </Button>
      </div>
      
      {autresSurfaces.length > 0 ? (
        <div className="mt-4 border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surface</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qté</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opération</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {autresSurfaces.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.largeur.toFixed(2)} × {item.hauteur.toFixed(2)} m</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.surface.toFixed(2)} m²</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {item.surfaceImpactee === 'mur' ? 'Mur' : 
                     item.surfaceImpactee === 'plafond' ? 'Plafond' : 'Sol'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {item.estDeduction ? 'Déduction' : 'Ajout'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAutreSurface(item.id)}
                      className="mr-1 h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(item.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-6 border rounded-md bg-gray-50">
          <p className="text-gray-500">Aucune surface supplémentaire ajoutée</p>
        </div>
      )}
      
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingSurfaceId ? "Modifier une surface" : "Ajouter une surface"}
            </SheetTitle>
          </SheetHeader>
          
          <div className="py-4">
            <AutreSurfaceForm 
              onAddAutreSurface={handleAddAutreSurface}
              editingSurface={editingSurfaceId}
              currentSurface={getCurrentAutreSurface()}
              onCancelEdit={() => setEditingSurfaceId(null)}
              typesAutresSurfaces={autresSurfacesState.typesAutresSurfaces}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AutresSurfacesList;
