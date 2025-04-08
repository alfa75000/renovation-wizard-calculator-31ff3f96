
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client, typesClients } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  clientToEdit: Client | null;
  onSubmit: (clientData: Client) => void;
  isSubmitting?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({
  isOpen,
  onClose,
  clientToEdit,
  onSubmit,
  isSubmitting = false
}) => {
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
    typeClient: 'particulier',
    autreInfo: '',
    infosComplementaires: ''
  });
  
  // État pour le dialogue d'alerte de confirmation
  const [confirmClose, setConfirmClose] = useState(false);

  // Initialiser le formulaire avec les données du client à éditer
  useEffect(() => {
    if (clientToEdit) {
      setFormData(clientToEdit);
    } else {
      // Réinitialiser le formulaire pour un nouveau client
      setFormData({
        id: uuidv4(),
        nom: '',
        prenom: '',
        adresse: '',
        telephone: '',
        codePostal: '',
        ville: '',
        email: '',
        tel1: '',
        tel2: '',
        typeClient: 'particulier',
        autreInfo: '',
        infosComplementaires: ''
      });
    }
  }, [clientToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeClientChange = (value: string) => {
    setFormData(prev => ({ ...prev, typeClient: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // S'assurer que tel1 est synchronisé avec telephone pour la compatibilité
    const updatedFormData = {
      ...formData,
      tel1: formData.tel1 || formData.telephone,
      telephone: formData.telephone || formData.tel1,
    };
    
    onSubmit(updatedFormData);
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
      <Dialog open={isOpen} onOpenChange={handleCloseRequest}>
        <DialogContent className="sm:max-w-[600px]" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{clientToEdit ? 'Modifier le client' : 'Ajouter un client'}</DialogTitle>
            <DialogDescription>
              {clientToEdit 
                ? 'Modifiez les informations du client ci-dessous.' 
                : 'Remplissez les informations pour ajouter un nouveau client.'}
            </DialogDescription>
          </DialogHeader>
          
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
                  {typesClients.map(type => (
                    <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                  ))}
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
              <Button type="button" variant="outline" onClick={handleCloseRequest} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Chargement...' : clientToEdit ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
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
