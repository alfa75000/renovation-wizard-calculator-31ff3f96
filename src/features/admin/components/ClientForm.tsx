
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { 
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client, typesClients } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useClients } from '@/contexts/ClientsContext';

interface ClientFormProps {
  clientId?: string | null;
  onClose: () => void;
  isOpen?: boolean;
  onSubmit?: (clientData: Client) => void;
  isSubmitting?: boolean;
  clientToEdit?: Client | null;
}

const DEFAULT_CLIENT_TYPE_ID = '4b3375f8-af78-455f-be8c-1d506df4f753';

const ClientForm: React.FC<ClientFormProps> = ({
  clientId,
  onClose,
  isOpen = true,
  onSubmit,
  isSubmitting = false,
  clientToEdit = null
}) => {
  const { state, dispatch, clientTypes, isLoading } = useClients();
  const [confirmClose, setConfirmClose] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Utilisation de react-hook-form pour gérer le formulaire
  const form = useForm<Client>({
    defaultValues: {
      id: '',
      nom: '',
      prenom: '',
      adresse: '',
      telephone: '',
      codePostal: '',
      ville: '',
      email: '',
      tel1: '',
      tel2: '',
      typeClient: DEFAULT_CLIENT_TYPE_ID,
      autreInfo: '',
      infosComplementaires: ''
    }
  });

  // Surveiller les changements du formulaire pour détecter s'il est modifié
  const isDirty = form.formState.isDirty;

  // Charger les données du client à éditer
  useEffect(() => {
    if (clientToEdit) {
      form.reset({
        ...clientToEdit,
        typeClient: clientToEdit.typeClient || DEFAULT_CLIENT_TYPE_ID
      });
      return;
    }
    
    if (clientId) {
      const client = state.clients.find(c => c.id === clientId);
      if (client) {
        form.reset({
          ...client,
          typeClient: client.typeClient || DEFAULT_CLIENT_TYPE_ID
        });
        return;
      }
    }
    
    // Réinitialiser le formulaire avec les valeurs par défaut
    form.reset({
      id: '',
      nom: '',
      prenom: '',
      adresse: '',
      telephone: '',
      codePostal: '',
      ville: '',
      email: '',
      tel1: '',
      tel2: '',
      typeClient: DEFAULT_CLIENT_TYPE_ID,
      autreInfo: '',
      infosComplementaires: ''
    });
  }, [clientId, clientToEdit, state.clients, isOpen, form]);

  const handleFormSubmit = async (data: Client) => {
    if (submitting || isSubmitting || isLoading) {
      return;
    }
    
    setSubmitting(true);
    
    const updatedFormData = {
      ...data,
      tel1: data.tel1 || data.telephone,
      telephone: data.telephone || data.tel1,
      typeClient: data.typeClient || DEFAULT_CLIENT_TYPE_ID
    };
    
    try {
      if (onSubmit) {
        await onSubmit(updatedFormData);
      } else {
        if (clientId || clientToEdit) {
          const id = clientId || (clientToEdit ? clientToEdit.id : '');
          if (id) {
            await dispatch({
              type: 'UPDATE_CLIENT',
              payload: { id, client: updatedFormData }
            });
          }
        } else {
          await dispatch({ 
            type: 'ADD_CLIENT', 
            payload: updatedFormData 
          });
        }
      }
      form.reset(form.getValues());
      onClose();
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseRequest = () => {
    if (isDirty) {
      setConfirmClose(true);
    } else {
      onClose();
    }
  };

  const confirmCloseDialog = () => {
    setConfirmClose(false);
    form.reset();
    onClose();
  };

  return (
    <>
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(handleFormSubmit)} 
          className="space-y-4" 
          autoComplete="off" // Désactiver l'autocomplétion pour tout le formulaire
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="nom">Nom *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      id="nom"
                      autoComplete="off"
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="prenom">Prénom</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      id="prenom"
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="adresse"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="adresse">Adresse</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    id="adresse"
                    autoComplete="off"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="codePostal"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="codePostal">Code Postal</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      id="codePostal"
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ville"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="ville">Ville</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      id="ville"
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="telephone">Téléphone principal</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      id="telephone"
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tel1"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="tel1">Téléphone secondaire 1</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      id="tel1"
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tel2"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="tel2">Téléphone secondaire 2</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      id="tel2"
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    id="email"
                    type="email"
                    autoComplete="off"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="typeClient"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="typeClient">Type de client</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value || DEFAULT_CLIENT_TYPE_ID}
                  value={field.value || DEFAULT_CLIENT_TYPE_ID}
                >
                  <FormControl>
                    <SelectTrigger id="typeClient">
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clientTypes.length > 0 ? (
                      clientTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))
                    ) : (
                      typesClients.map(type => (
                        <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="autreInfo"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="autreInfo">Autre info</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    id="autreInfo"
                    autoComplete="off"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="infosComplementaires"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="infosComplementaires">Informations complémentaires</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    id="infosComplementaires"
                    className="h-24"
                    autoComplete="off"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCloseRequest} 
              disabled={isSubmitting || submitting || isLoading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || submitting || isLoading}
            >
              {isSubmitting || submitting || isLoading ? 'Chargement...' : (clientId || clientToEdit) ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
      
      <AlertDialog open={confirmClose} onOpenChange={setConfirmClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Voulez-vous vraiment annuler ?</AlertDialogTitle>
            <AlertDialogDescription>
              Toutes les informations saisies seront perdues. Êtes-vous sûr de vouloir fermer ce formulaire ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmClose(false)}>Continuer la saisie</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCloseDialog}>Oui, annuler</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClientForm;
