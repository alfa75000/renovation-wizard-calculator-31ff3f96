import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '@/contexts/ClientsContext';
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
import { Calendar, PlusCircle, Save, Trash, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

const InfosChantier: React.FC = () => {
  const navigate = useNavigate();
  const { state: clientsState, getClientTypeName } = useClients();
  const { 
    state: projectState, 
    isLoading, 
    isSaving,
    projects, 
    currentProjectId,
    hasUnsavedChanges,
    saveProject,
    saveProjectAsDraft,
    loadProject,
    createNewProject,
    deleteCurrentProject
  } = useProject();
  
  const [clientId, setClientId] = useState<string>('');
  const [nomProjet, setNomProjet] = useState<string>('');
  const [descriptionProjet, setDescriptionProjet] = useState<string>('');
  const [adresseChantier, setAdresseChantier] = useState<string>('');
  const [occupant, setOccupant] = useState<string>('');
  const [infoComplementaire, setInfoComplementaire] = useState<string>('');
  const [dateDevis, setDateDevis] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  
  const clientSelectionne = clientsState.clients.find(c => c.id === clientId);
  
  // Si un projet est sélectionné, charger ses informations
  useEffect(() => {
    if (currentProjectId) {
      const currentProject = projects.find(p => p.id === currentProjectId);
      if (currentProject) {
        setClientId(currentProject.client_id || '');
        setNomProjet(currentProject.name || '');
        setDescriptionProjet(currentProject.description || '');
        setAdresseChantier(currentProject.address || '');
        setOccupant(currentProject.occupant || '');
      }
    }
  }, [currentProjectId, projects]);
  
  const handleSave = async () => {
    if (!nomProjet) {
      toast.error('Veuillez saisir un nom de projet');
      return;
    }
    
    try {
      // Mettre à jour les informations du projet
      await saveProject(nomProjet);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du projet:', error);
      toast.error('Une erreur est survenue lors de la sauvegarde du projet');
    }
  };
  
  const handleSaveDraft = async () => {
    try {
      await saveProjectAsDraft();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du brouillon:', error);
      toast.error('Une erreur est survenue lors de la sauvegarde du brouillon');
    }
  };
  
  const handleChargerProjet = async (projetId: string) => {
    try {
      await loadProject(projetId);
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Une erreur est survenue lors du chargement du projet');
    }
  };
  
  const handleNouveauProjet = () => {
    createNewProject();
    // Réinitialiser le formulaire
    setClientId('');
    setNomProjet('');
    setDescriptionProjet('');
    setAdresseChantier('');
    setOccupant('');
    setInfoComplementaire('');
    setDateDevis(format(new Date(), 'yyyy-MM-dd'));
  };
  
  const handleDeleteProject = async () => {
    try {
      await deleteCurrentProject();
      // Réinitialiser le formulaire
      setClientId('');
      setNomProjet('');
      setDescriptionProjet('');
      setAdresseChantier('');
      setOccupant('');
      setInfoComplementaire('');
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      toast.error('Une erreur est survenue lors de la suppression du projet');
    }
  };
  
  return (
    <Layout
      title="Infos Chantier / Client"
      subtitle="Gérez les informations du projet et du client"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h2 className="text-xl font-semibold">Informations du projet</h2>
            {hasUnsavedChanges && (
              <Badge variant="outline" className="ml-2 text-amber-500 border-amber-500">
                Modifications non enregistrées
              </Badge>
            )}
          </div>
          
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
                  <p><span className="font-semibold">Type:</span> {getClientTypeName(clientSelectionne.typeClient)}</p>
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
              <Label htmlFor="nomProjet">Nom du projet</Label>
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
            
            <div className="pt-4 flex flex-wrap gap-4">
              <Button 
                onClick={handleSave} 
                disabled={isLoading || isSaving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Enregistrement...' : 'Enregistrer le projet'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleSaveDraft}
                disabled={isLoading || isSaving || !hasUnsavedChanges}
                className="flex items-center gap-2"
              >
                <FileCheck className="h-4 w-4" />
                Sauvegarder brouillon
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={handleNouveauProjet}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Nouveau projet
              </Button>
              
              {currentProjectId && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Trash className="h-4 w-4" />
                      Supprimer projet
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce projet ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Toutes les données du projet seront définitivement supprimées.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteProject}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/travaux')}
                className="ml-auto"
              >
                Aller aux travaux
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Projets enregistrés</h2>
            
            {isLoading ? (
              <div className="py-4 text-center text-gray-500">
                Chargement des projets...
              </div>
            ) : projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((projet) => {
                  const client = clientsState.clients.find(c => c.id === projet.client_id);
                  return (
                    <div 
                      key={projet.id} 
                      className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${currentProjectId === projet.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                      onClick={() => handleChargerProjet(projet.id)}
                    >
                      <h3 className="font-medium">{projet.name}</h3>
                      {client && (
                        <p className="text-sm text-gray-500">
                          Client: {client.nom} {client.prenom}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {projet.updated_at ? format(new Date(projet.updated_at), 'dd/MM/yyyy', { locale: fr }) : format(new Date(projet.created_at), 'dd/MM/yyyy', { locale: fr })}
                      </p>
                      {projectState.rooms.length > 0 && currentProjectId === projet.id && (
                        <div className="mt-1 text-xs text-green-600">
                          <span className="inline-block px-2 py-1 bg-green-50 rounded-full">
                            {projectState.rooms.length} pièces | {projectState.travaux.length} travaux
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
                
                {hasUnsavedChanges && (
                  <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-600">
                    Ce projet contient des modifications non enregistrées
                  </div>
                )}
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
