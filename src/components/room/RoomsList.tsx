
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { Room } from '@/types';
import { formaterQuantite } from '@/lib/utils';

interface RoomsListProps {
  rooms: Room[];
  onEditRoom: (id: string) => void;
  onDeleteRoom: (id: string) => void;
}

const RoomsList: React.FC<RoomsListProps> = ({ rooms, onEditRoom, onDeleteRoom }) => {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-500">Aucune pièce ajoutée</h3>
        <p className="text-sm text-gray-400 mt-2">Utilisez le formulaire ci-dessus pour ajouter des pièces</p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surface brute</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surface nette</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Linéaire</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menuiseries</th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rooms.map((room) => (
            <tr key={room.id} className="hover:bg-gray-50">
              <td className="px-3 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{room.name}</div>
                <div className="text-sm text-gray-500">{room.type}</div>
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formaterQuantite(room.length)} × {formaterQuantite(room.width)} × {formaterQuantite(room.height)} m</div>
              </td>
              <td className="px-3 py-4">
                <div className="text-sm text-gray-900">Sol: {formaterQuantite(room.surface)} m²</div>
                <div className="text-sm text-gray-900">Murs: {formaterQuantite(room.wallSurfaceRaw)} m²</div>
                <div className="text-sm text-gray-900">Plafond: {formaterQuantite(room.surface)} m²</div>
              </td>
              <td className="px-3 py-4">
                <div className="text-sm font-semibold text-gray-900">Sol: {formaterQuantite(room.surfaceNetteSol)} m²</div>
                <div className="text-sm font-semibold text-gray-900">Murs: {formaterQuantite(room.netWallSurface)} m²</div>
                <div className="text-sm font-semibold text-gray-900">Plafond: {formaterQuantite(room.surfaceNettePlafond)} m²</div>
              </td>
              <td className="px-3 py-4">
                <div className="text-sm text-gray-900">Brut: {formaterQuantite(room.lineaireBrut || 0)} m</div>
                <div className="text-sm text-gray-900">Net: {formaterQuantite(room.lineaireNet)} m</div>
                <div className="text-sm text-gray-500">Plinthes: {formaterQuantite(room.totalPlinthSurface)} m²</div>
                <div className="text-sm text-gray-500">Hauteur: {formaterQuantite(room.plinthHeight)} m</div>
              </td>
              <td className="px-3 py-4">
                <div className="text-sm text-gray-900">Murs: {formaterQuantite(room.menuiseriesMursSurface)} m²</div>
                <div className="text-sm text-gray-900">Plafond: {formaterQuantite(room.menuiseriesPlafondSurface)} m²</div>
                <div className="text-sm text-gray-900">Sol: {formaterQuantite(room.menuiseriesSolSurface)} m²</div>
                <div className="text-sm text-gray-500 mt-2">{room.menuiseries.length} menuiseries</div>
                <div className="text-sm text-gray-500">{room.autresSurfaces ? room.autresSurfaces.length : 0} autres surfaces</div>
                <div className="text-sm text-gray-900 mt-2">Autres Murs: {formaterQuantite(room.autresSurfacesMurs)} m²</div>
                <div className="text-sm text-gray-900">Autres Plafond: {formaterQuantite(room.autresSurfacesPlafond)} m²</div>
                <div className="text-sm text-gray-900">Autres Sol: {formaterQuantite(room.autresSurfacesSol)} m²</div>
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditRoom(room.id)}
                  className="mr-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette pièce ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action supprimera définitivement la pièce "{room.name}" et toutes les données associées.
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDeleteRoom(room.id)} className="bg-red-500 hover:bg-red-600">
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomsList;
