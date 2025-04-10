
import React from 'react';
import { useClients } from '@/contexts/ClientsContext';

interface ClientDetailsProps {
  clientId: string;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({ clientId }) => {
  const { state: clientsState, getClientTypeName } = useClients();
  const clientSelectionne = clientsState.clients.find(c => c.id === clientId);
  
  if (!clientSelectionne) return null;
  
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="font-medium text-gray-700 mb-2">Détails du client</h3>
      <p><span className="font-semibold">Adresse:</span> {clientSelectionne.adresse}</p>
      <p>
        <span className="font-semibold">Contact:</span> {clientSelectionne.telephone}
        {clientSelectionne.email && ` / ${clientSelectionne.email}`}
      </p>
      {clientSelectionne.typeClient && (
        <p><span className="font-semibold">Type:</span> {getClientTypeName(clientSelectionne.typeClient)}</p>
      )}
      {clientSelectionne.autreInfo && (
        <p><span className="font-semibold">Info:</span> {clientSelectionne.autreInfo}</p>
      )}
      {clientSelectionne.infosComplementaires && (
        <p><span className="font-semibold">Détails:</span> {clientSelectionne.infosComplementaires}</p>
      )}
    </div>
  );
};
