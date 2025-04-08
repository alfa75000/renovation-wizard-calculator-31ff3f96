
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useClients } from '@/contexts/ClientsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash, Search } from 'lucide-react';
import ClientForm from '@/features/admin/components/ClientForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const ClientsList: React.FC = () => {
  const { state, dispatch, isLoading, clientTypes, getClientTypeName } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [clientToEdit, setClientToEdit] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  // Filtrer les clients en fonction du terme de recherche
  const filteredClients = state.clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.nom.toLowerCase().includes(searchLower) ||
      (client.prenom && client.prenom.toLowerCase().includes(searchLower)) ||
      (client.email && client.email.toLowerCase().includes(searchLower)) ||
      (client.telephone && client.telephone.toLowerCase().includes(searchLower))
    );
  });

  const handleEditClient = (clientId: string) => {
    setClientToEdit(clientId);
    setIsFormOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    setClientToDelete(clientId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteClient = () => {
    if (clientToDelete) {
      dispatch({ type: 'DELETE_CLIENT', payload: clientToDelete });
      setIsDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const handleCloseForm = () => {
    setClientToEdit(null);
    setIsFormOpen(false);
  };

  return (
    <Layout title="Fiches Clients" subtitle="Gérez votre base de clients">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Liste des clients</CardTitle>
          <div className="flex space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setClientToEdit(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau client
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{clientToEdit ? 'Modifier un client' : 'Ajouter un client'}</DialogTitle>
                  <DialogDescription>
                    {clientToEdit
                      ? 'Modifiez les informations du client ci-dessous.'
                      : 'Remplissez le formulaire pour ajouter un nouveau client.'}
                  </DialogDescription>
                </DialogHeader>
                <ClientForm
                  clientId={clientToEdit}
                  onClose={handleCloseForm}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-t-2 border-blue-500 rounded-full"></div>
            </div>
          ) : filteredClients.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {client.nom} {client.prenom}
                      </TableCell>
                      <TableCell>{getClientTypeName(client.typeClient)}</TableCell>
                      <TableCell>
                        {client.telephone}
                        {client.email && (
                          <>
                            <br />
                            <span className="text-sm text-gray-500">{client.email}</span>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {client.adresse}
                        {client.codePostal && client.ville && (
                          <span className="text-sm text-gray-500">
                            <br />
                            {client.codePostal} {client.ville}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClient(client.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog open={isDeleteDialogOpen && clientToDelete === client.id} onOpenChange={(open) => {
                            if (!open) setClientToDelete(null);
                            setIsDeleteDialogOpen(open);
                          }}>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteClient(client.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer le client "{client.nom} {client.prenom}" ? 
                                  Cette action ne peut pas être annulée.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={confirmDeleteClient}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "Aucun client ne correspond à votre recherche" : "Aucun client enregistré"}
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ClientsList;
