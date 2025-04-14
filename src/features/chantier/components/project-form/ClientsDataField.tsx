
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface ClientsDataFieldProps {
  clientsData: string;
  setClientsData: (data: string) => void;
}

export const ClientsDataField: React.FC<ClientsDataFieldProps> = ({
  clientsData,
  setClientsData
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="clientsData">Liste et données des client(s) à afficher</Label>
      <Textarea
        id="clientsData"
        value={clientsData}
        onChange={(e) => setClientsData(e.target.value)}
        className="min-h-32 font-mono text-sm"
        placeholder="Les clients ajoutés apparaîtront ici..."
      />
    </div>
  );
};
