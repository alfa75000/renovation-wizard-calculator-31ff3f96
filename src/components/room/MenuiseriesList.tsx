
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Menuiserie } from '@/types';

interface MenuiseriesListProps {
  menuiseries: Menuiserie[];
  onEdit: (id: string, menuiserie: Partial<Omit<Menuiserie, 'id' | 'surface'>>) => Menuiserie | null;
  onDelete: (id: string) => void;
}

const MenuiseriesList: React.FC<MenuiseriesListProps> = ({ 
  menuiseries, 
  onEdit, 
  onDelete 
}) => {
  if (menuiseries.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-4 border rounded-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surface</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qté</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {menuiseries.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.largeur} × {item.hauteur} cm</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.surface.toFixed(2)} m²</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {item.surfaceImpactee === 'mur' ? 'Mur' : 
                 item.surfaceImpactee === 'plafond' ? 'Plafond' : 'Sol'}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
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
  );
};

export default MenuiseriesList;
