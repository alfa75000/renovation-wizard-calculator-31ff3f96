
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useClients } from '@/contexts/ClientsContext';
import { UserPlus } from 'lucide-react';

interface ClientSelectionProps {
  clientId: string;
  setClientId: (id: string) => void;
  onAddClientToList: () => void;
}

export const ClientSelection: React.FC<ClientSelectionProps> = ({ 
  clientId, 
  setClientId,
  onAddClientToList
}) => {
  const { state: clientsState, getClientTypeName } = useClients();
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <Label htmlFor="client">Client</Label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddClientToList}
          className="gap-1"
          type="button"
        >
          <UserPlus className="h-4 w-4" />
          Ajouter Client
        </Button>
      </div>
      <Select 
        value={clientId} 
        onValueChange={(value) => setClientId(value)}
      >
        <SelectTrigger id="client" className="w-full">
          <SelectValue placeholder="Sélectionner un client" />
        </SelectTrigger>
        <SelectContent>
          {clientsState.clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.nom} {client.prenom}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
