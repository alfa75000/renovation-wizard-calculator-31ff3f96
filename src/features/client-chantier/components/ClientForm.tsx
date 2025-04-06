
import React from 'react';
import { useClientChantier } from '@/contexts/ClientChantierContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ClientForm: React.FC = () => {
  const { state, dispatch } = useClientChantier();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_CLIENT',
      payload: { [name]: value }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Informations client sauvegardées",
      description: "Les informations du client ont été enregistrées avec succès.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Informations Client
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                name="nom"
                value={state.client.nom}
                onChange={handleChange}
                placeholder="Nom du client"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                name="prenom"
                value={state.client.prenom}
                onChange={handleChange}
                placeholder="Prénom du client"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={state.client.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone" className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                Téléphone
              </Label>
              <Input
                id="telephone"
                name="telephone"
                value={state.client.telephone}
                onChange={handleChange}
                placeholder="06 12 34 56 78"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Adresse
            </Label>
            <Input
              id="adresse"
              name="adresse"
              value={state.client.adresse}
              onChange={handleChange}
              placeholder="Adresse du client"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="codePostal">Code postal</Label>
              <Input
                id="codePostal"
                name="codePostal"
                value={state.client.codePostal}
                onChange={handleChange}
                placeholder="75000"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                name="ville"
                value={state.client.ville}
                onChange={handleChange}
                placeholder="Paris"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Enregistrer les informations client</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClientForm;
