
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash, Edit, Mail, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import { Client, ClientType } from '@/types/supabase';

const AdminClientsListe: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientTypes, setClientTypes] = useState<ClientType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les clients depuis Supabase
  const loadClients = async () => {
    setIsLoading(true);
    try {
      // Récupérer les types de clients
      const { data: typesData, error: typesError } = await supabase
        .from('client_types')
        .select('*');
      
      if (typesError) throw typesError;
      setClientTypes(typesData || []);
      
      // Récupérer les clients
      const { data, error } = await supabase
        .from('clients')
        .select('*');
      
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      toast.error("Impossible de charger les clients");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const getClientTypeName = (typeId: string) => {
    const clientType = clientTypes.find(type => type.id === typeId);
    return clientType ? clientType.name : 'Type inconnu';
  };

  const handleDeleteClient = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        const { error } = await supabase
          .from('clients')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        setClients(clients.filter(client => client.id !== id));
        toast.success("Client supprimé avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression du client:", error);
        toast.error("Erreur lors de la suppression du client");
      }
    }
  };

  return (
    <Card>
      <CardHeader className="bg-slate-50">
        <CardTitle className="text-xl font-semibold flex items-center">
          Liste des Clients
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Gérez les clients de votre entreprise
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un client
          </Button>
        </div>

        <Separator className="my-4" />

        {isLoading ? (
          <p className="text-center py-4">Chargement des clients...</p>
        ) : clients.length === 0 ? (
          <p className="text-center py-4">Aucun client disponible</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    {client.first_name ? `${client.first_name} ${client.name}` : client.name}
                  </TableCell>
                  <TableCell>{getClientTypeName(client.client_type_id)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {client.email && (
                        <span className="flex items-center text-sm text-gray-600">
                          <Mail className="h-3 w-3 mr-1" /> {client.email}
                        </span>
                      )}
                      {client.phone && (
                        <span className="flex items-center text-sm text-gray-600 mt-1">
                          <Phone className="h-3 w-3 mr-1" /> {client.phone}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {client.address && (
                      <div className="text-sm text-gray-600">
                        <div>{client.address}</div>
                        <div>{client.postal_code} {client.city}</div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mr-1"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClient(client.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminClientsListe;
