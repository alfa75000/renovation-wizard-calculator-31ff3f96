
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '@/contexts/ClientsContext';
import { useProjetChantier } from '@/contexts/ProjetChantierContext';
import { useProject } from '@/contexts/ProjectContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const InfosChantier: React.FC = () => {
  const navigate = useNavigate();
  const { state: clientsState } = useClients();
  const { state: projetState, sauvegarderProjet, chargerProjet, genererNomFichier, nouveauProjet } = useProjetChantier();
  const { state: projectState } = useProject();
  
  const [clientId, setClientId] = useState<string>('');
  const [nomProjet, setNomProjet] = useState<string>('');
  const [descriptionProjet, setDescriptionProjet] = useState<string>('');
  const [adresseChantier, setAdresseChantier] = useState<string>('');
  const [occupant, setOccupant] = useState<string>('');
  const [infoComplementaire, setInfoComplementaire] = useState<string>('');
  const [dateDevis, setDateDevis] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [nomFichier, setNomFichier] = useState<string>('');
  
  const clientSelectionne = clientsState.clients.find(c => c.id === clientId);
  
  // Mise à jour du formulaire si un projet actif est chargé
  useEffect(() => {
    if (projetState.projetActif) {
      setClientId(projetState.projetActif.clientId);
      setNomProjet(projetState.projetActif.nomProjet || '');
      setDescriptionProjet(projetState.projetActif.description);
      setAdresseChantier(projetState.projetActif.adresse);
      setOccupant(projetState.projetActif.occupant || '');
      setInfoComplementaire(projetState.projetActif.infoComplementaire || '');
    }
  }, [projetState.projetActif]);
  
  // Mise à jour du nom de fichier proposé
  useEffect(() => {
    if (clientId && nomProjet) {
      const client = clientsState.clients.find(c => c.id === clientId);
      if (client) {
        const nom = client.nom || '';
        setNomFichier(genererNomFichier({ nomProjet, adresse: adresseChantier }, nom));
      }
    }
  }, [clientId, nomProjet, adresseChantier, clientsState.clients, genererNomFichier]);
  
  const handleSave = () => {
    if (!clientId) {
      toast.error('Veuillez sélectionner un client');
      return;
    }
    
    if (!nomProjet) {
      toast.error('Veuillez saisir un intitulé de projet');
      return;
    }
    
    // Sauvegarder le projet
    sauvegarderProjet({
      clientId,
      nomProjet,
      description: descriptionProjet,
      adresse: adresseChantier,
      occupant,
      infoComplementaire,
    });
    
    toast.success('Projet sauvegardé avec succès');
  };
  
  const handleChargerProjet = (projetId: string) => {
    chargerProjet(projetId);
    toast.info('Projet chargé');
  };
  
  const handleNouveauProjet = () => {
    nouveauProjet();
    // Réinitialiser le formulaire
    setClientId('');
    setNomProjet('');
    setDescriptionProjet('');
    setAdresseChantier('');
    setOccupant('');
    setInfoComplementaire('');
    setDateDevis(format(new Date(), 'yyyy-MM-dd'));
    setNomFichier('');
    toast.info('Nouveau projet initialisé');
  };
  
  return (
    <Layout
      title="Infos Chantier / Client"
      subtitle="Gérez les informations du projet et du client"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Informations du projet</h2>
          
          <div className="space-y-6">
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
            
            {clientSelectionne && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-700 mb-2">Détails du client</h3>
                <p><span className="font-semibold">Adresse:</span> {clientSelectionne.adresse}</p>
                <p>
                  <span className="font-semibold">Contact:</span> {clientSelectionne.telephone}
                  {clientSelectionne.email && ` / ${clientSelectionne.email}`}
                </p>
                {clientSelectionne.typeClient && (
                  <p><span className="font-semibold">Type:</span> {clientSelectionne.typeClient}</p>
                )}
                {clientSelectionne.autreInfo && (
                  <p><span className="font-semibold">Info:</span> {clientSelectionne.autreInfo}</p>
                )}
                {clientSelectionne.infosComplementaires && (
                  <p><span className="font-semibold">Détails:</span> {clientSelectionne.infosComplementaires}</p>
                )}
              </div>
            )}
            
            <div>
              <Label htmlFor="nomProjet">Intitulé du projet</Label>
              <Input 
                id="nomProjet" 
                value={nomProjet} 
                onChange={(e) => setNomProjet(e.target.value)}
                placeholder="Ex: Rénovation salle de bain"
              />
            </div>
            
            <div>
              <Label htmlFor="dateDevis">Date du devis</Label>
              <div className="relative">
                <Input 
                  id="dateDevis" 
                  type="date" 
                  value={dateDevis} 
                  onChange={(e) => setDateDevis(e.target.value)}
                />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="adresseChantier">Adresse du chantier</Label>
              <Input 
                id="adresseChantier" 
                value={adresseChantier} 
                onChange={(e) => setAdresseChantier(e.target.value)}
                placeholder="Ex: 15 rue de la Paix, 75001 Paris" 
              />
            </div>
            
            <div>
              <Label htmlFor="occupant">Occupant</Label>
              <Input 
                id="occupant" 
                value={occupant} 
                onChange={(e) => setOccupant(e.target.value)}
                placeholder="Nom de l'occupant si différent du client"
              />
            </div>
            
            <div>
              <Label htmlFor="descriptionProjet">Description du projet</Label>
              <Textarea 
                id="descriptionProjet" 
                value={descriptionProjet} 
                onChange={(e) => setDescriptionProjet(e.target.value)}
                placeholder="Description détaillée des travaux"
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="infoComplementaire">Informations complémentaires</Label>
              <Textarea 
                id="infoComplementaire" 
                value={infoComplementaire} 
                onChange={(e) => setInfoComplementaire(e.target.value)}
                placeholder="Autres informations importantes"
                rows={3}
              />
            </div>
            
            {nomFichier && (
              <div>
                <Label htmlFor="nomFichier">Nom du fichier proposé</Label>
                <Input 
                  id="nomFichier" 
                  value={nomFichier} 
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            )}
            
            <div className="pt-4 flex flex-wrap gap-4">
              <Button onClick={handleSave}>
                Sauvegarder le projet
              </Button>
              <Button variant="outline" onClick={() => navigate('/travaux')}>
                Aller aux travaux
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleNouveauProjet}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Nouveau projet
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Projets enregistrés</h2>
            
            {projetState.projets.length > 0 ? (
              <div className="space-y-4">
                {projetState.projets.map((projet) => {
                  const client = clientsState.clients.find(c => c.id === projet.clientId);
                  return (
                    <div 
                      key={projet.id} 
                      className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${projetState.projetActif?.id === projet.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                      onClick={() => handleChargerProjet(projet.id)}
                    >
                      <h3 className="font-medium">{projet.nomProjet || projet.nom}</h3>
                      <p className="text-sm text-gray-500">
                        Client: {client?.nom} {client?.prenom}
                      </p>
                      <p className="text-sm text-gray-500">
                        {projet.dateModification ? format(new Date(projet.dateModification), 'dd/MM/yyyy', { locale: fr }) : "Date inconnue"}
                      </p>
                      {projet.projectData && (
                        <div className="mt-1 text-xs text-green-600">
                          <span className="inline-block px-2 py-1 bg-green-50 rounded-full">
                            {projet.projectData.rooms.length} pièces | 
                            {projet.projectData.travaux ? projet.projectData.travaux.length : 0} travaux
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">Aucun projet enregistré</p>
            )}
          </div>
          
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Résumé du projet</h2>
            
            {projectState.rooms.length > 0 ? (
              <div>
                <p><span className="font-semibold">Pièces:</span> {projectState.rooms.length}</p>
                <p><span className="font-semibold">Type de propriété:</span> {projectState.property.type}</p>
                <p><span className="font-semibold">Surface totale:</span> {projectState.property.totalArea} m²</p>
                <p><span className="font-semibold">Nombre de travaux:</span> {projectState.travaux.length}</p>
              </div>
            ) : (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTitle>Aucune pièce définie</AlertTitle>
                <AlertDescription>
                  Commencez par définir les pièces de votre projet dans la page d'accueil.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InfosChantier;
