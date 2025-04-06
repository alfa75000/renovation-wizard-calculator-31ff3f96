
import React from 'react';
import { useClientChantier } from '@/contexts/ClientChantierContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Building, MapPin, Calendar, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ChantierForm: React.FC = () => {
  const { state, dispatch } = useClientChantier();
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_CHANTIER',
      payload: { [name]: value }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Informations chantier sauvegardées",
      description: "Les informations du chantier ont été enregistrées avec succès.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Informations Chantier
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom du chantier</Label>
            <Input
              id="nom"
              name="nom"
              value={state.chantier.nom}
              onChange={handleChange}
              placeholder="Rénovation appartement"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Adresse du chantier
            </Label>
            <Input
              id="adresse"
              name="adresse"
              value={state.chantier.adresse}
              onChange={handleChange}
              placeholder="Adresse du chantier"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="codePostal">Code postal</Label>
              <Input
                id="codePostal"
                name="codePostal"
                value={state.chantier.codePostal}
                onChange={handleChange}
                placeholder="75000"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                name="ville"
                value={state.chantier.ville}
                onChange={handleChange}
                placeholder="Paris"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateDebut" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Date de début
              </Label>
              <Input
                id="dateDebut"
                name="dateDebut"
                type="date"
                value={state.chantier.dateDebut}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFin" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Date de fin estimée
              </Label>
              <Input
                id="dateFin"
                name="dateFin"
                type="date"
                value={state.chantier.dateFin}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Description du chantier
            </Label>
            <Textarea
              id="description"
              name="description"
              value={state.chantier.description}
              onChange={handleChange}
              placeholder="Description détaillée du chantier..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full">Enregistrer les informations chantier</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChantierForm;
