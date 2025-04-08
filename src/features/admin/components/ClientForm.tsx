
import React, { useState, useEffect } from 'react';
import { 
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

const ClientForm: React.FC<ClientFormProps> = ({
  clientId,
  onClose,
  isOpen = true,
  onSubmit,
  isSubmitting = false,
  clientToEdit = null
}) => {
  const { state, dispatch, clientTypes, isLoading, error } = useClients();
  const [formData, setFormData] = useState<Client>({
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
    typeClient: '',
    autreInfo: '',
    infosComplementaires: ''
  });
  
  // État pour le dialogue d'alerte de confirmation
  const [confirmClose, setConfirmClose] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Initialiser le formulaire avec les données du client à éditer
  useEffect(() => {
    // Cas 1: nous avons un clientToEdit directement passé en prop
    if (clientToEdit) {
      setFormData(clientToEdit);
      return;
    }
    
    // Cas 2: nous avons un clientId, nous cherchons le client dans le state
    if (clientId) {
      const client = state.clients.find(c => c.id === clientId);
      if (client) {
        setFormData(client);
        return;
      }
    }
    
    // Cas 3: nouveau client
    setFormData({
      id: '', // ID vide pour les nouveaux clients
      nom: '',
      prenom: '',
      adresse: '',
      telephone: '',
      codePostal: '',
      ville: '',
      email: '',
      tel1: '',
      tel2: '',
      typeClient: clientTypes.length > 0 ? clientTypes[0].id : '',
      autreInfo: '',
      infosComplementaires: ''
    });
  }, [clientId, clientToEdit, state.clients, isOpen, clientTypes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeClientChange = (value: string) => {
    setFormData(prev => ({ ...prev, typeClient: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting || isSubmitting || isLoading) {
      return; // Éviter les soumissions multiples
    }
    
    setSubmitting(true);
    
    // S'assurer que tel1 est synchronisé avec telephone pour la compatibilité
    const updatedFormData = {
      ...formData,
      tel1: formData.tel1 || formData.telephone,
      telephone: formData.telephone || formData.tel1,
    };
    
    try {
      if (onSubmit) {
        // Si nous avons une fonction onSubmit personnalisée, nous l'utilisons
        await onSubmit(updatedFormData);
      } else {
        // Sinon, nous utilisons le dispatch du contexte
        if (clientId || clientToEdit) {
          // Mise à jour d'un client existant
          const id = clientId || (clientToEdit ? clientToEdit.id : '');
          if (id) {
            await dispatch({
              type: 'UPDATE_CLIENT',
              payload: { id, client: updatedFormData }
            });
          }
        } else {
          // Ajout d'un nouveau client
          await dispatch({ 
            type: 'ADD_CLIENT', 
            payload: updatedFormData 
          });
        }
      }
      
      if (!error) {
        onClose();
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      // L'erreur est déjà gérée dans le contexte
    } finally {
      setSubmitting(false);
    }
  };
  
  // Gérer la demande de fermeture
  const handleCloseRequest = () => {
    // Si le formulaire contient des données, montrer la confirmation
    if (formData.nom || formData.prenom || formData.adresse || formData.tel1 || formData.email) {
      setConfirmClose(true);
    } else {
      // Si formulaire vide, fermer directement
      onClose();
    }
  };
  
  // Confirmer la fermeture
  const confirmCloseDialog = () => {
    setConfirmClose(false);
    onClose();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input 
              id="nom" 
              name="nom" 
              value={formData.nom} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom</Label>
            <Input 
              id="prenom" 
              name="prenom" 
              value={formData.prenom} 
              onChange={handleChange} 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="adresse">Adresse</Label>
          <Textarea 
            id="adresse" 
            name="adresse" 
            value={formData.adresse} 
            onChange={handleChange} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="codePostal">Code Postal</Label>
            <Input 
              id="codePostal" 
              name="codePostal" 
              value={formData.codePostal} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ville">Ville</Label>
            <Input 
              id="ville" 
              name="ville" 
              value={formData.ville} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone principal</Label>
            <Input 
              id="telephone" 
              name="telephone" 
              value={formData.telephone} 
              onChange={handleChange} 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tel1">Téléphone secondaire 1</Label>
            <Input 
              id="tel1" 
              name="tel1" 
              value={formData.tel1} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tel2">Téléphone secondaire 2</Label>
            <Input 
              id="tel2" 
              name="tel2" 
              value={formData.tel2} 
              onChange={handleChange} 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="typeClient">Type de client</Label>
          <Select 
            value={formData.typeClient} 
            onValueChange={handleTypeClientChange}
          >
            <SelectTrigger id="typeClient">
              <SelectValue placeholder="Sélectionnez un type" />
            </SelectTrigger>
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
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="autreInfo">Autre info</Label>
          <Input 
            id="autreInfo" 
            name="autreInfo" 
            value={formData.autreInfo} 
            onChange={handleChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="infosComplementaires">Informations complémentaires</Label>
          <Textarea 
            id="infosComplementaires" 
            name="infosComplementaires" 
            value={formData.infosComplementaires} 
            onChange={handleChange} 
            className="h-24"
          />
        </div>
        
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
      
      {/* Dialogue de confirmation */}
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
