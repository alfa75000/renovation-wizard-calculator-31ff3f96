
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClients } from '@/contexts/ClientsContext';

interface ClientSelectionProps {
  clientId: string;
  setClientId: (id: string) => void;
}

export const ClientSelection: React.FC<ClientSelectionProps> = ({ 
  clientId, 
  setClientId 
}) => {
  const { state: clientsState } = useClients();
  
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="client">Client</Label>
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
    </div>
  );
};

