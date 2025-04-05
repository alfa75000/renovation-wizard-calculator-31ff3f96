import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  Paintbrush,
  Hammer,
  Wrench,
  SquarePen,
  Home,
  Plus,
  X,
  Pencil,
  Save,
  ArrowRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Types de travaux principaux
const travauxTypes = [
  { id: "murs", label: "Revêtement murs", icon: <Paintbrush className="h-4 w-4" /> },
  { id: "plafond", label: "Revêtement plafond", icon: <Paintbrush className="h-4 w-4" /> },
  { id: "sol", label: "Revêtement sol", icon: <Wrench className="h-4 w-4" /> },
  { id: "menuiseries", label: "Menuiseries", icon: <Hammer className="h-4 w-4" /> },
  { id: "electricite", label: "Electricité", icon: <SquarePen className="h-4 w-4" /> },
  { id: "plomberie", label: "Plomberie", icon: <SquarePen className="h-4 w-4" /> },
  { id: "platrerie", label: "Plâtrerie", icon: <SquarePen className="h-4 w-4" /> },
  { id: "maconnerie", label: "Maçonnerie", icon: <SquarePen className="h-4 w-4" /> },
  { id: "autre", label: "Autre", icon: <Wrench className="h-4 w-4" /> }
];

// Sous-types de travaux associés à chaque type principal
const sousTravaux = {
  murs: [
    { id: "lessivage-travaux", label: "Lessivage pour travaux", prixUnitaire: 2.2, unite: "M²" },
    { id: "lessivage-soigne", label: "Lessivage soigné en conservation", prixUnitaire: 3.5, unite: "M²" },
    { id: "grattage", label: "Grattage, ouverture des fissures", prixUnitaire: 5, unite: "M²" },
    { id: "rebouchage", label: "Rebouchage, ponçage", prixUnitaire: 20, unite: "M²" },
    { id: "enduit-repassage", label: "Enduit repassé, ponçage", prixUnitaire: 25, unite: "M²" },
    { id: "toile-renfort", label: "Toile de renfort anti-fissures", prixUnitaire: 15, unite: "M²" },
    { id: "bande-calicot", label: "Bande Calicot anti-fissure", prixUnitaire: 10, unite: "Ml" },
    { id: "toile-verre", label: "Toile de verre à peindre", prixUnitaire: 18, unite: "M²" },
    { id: "peinture-acrylique", label: "Peinture type acrylique", prixUnitaire: 30, unite: "M²" },
    { id: "peinture-glycero", label: "Peinture type glycéro", prixUnitaire: 35, unite: "M²" },
    { id: "vernis", label: "Vernis", prixUnitaire: 40, unite: "M²" },
    { id: "enduit-decoratif", label: "Enduit décoratif", prixUnitaire: 45, unite: "M²" },
    { id: "papier-peint", label: "Papier peint", prixUnitaire: 22, unite: "M²" },
    { id: "faience", label: "Faïence / Carrelage", prixUnitaire: 80, unite: "M²" },
    { id: "lambris", label: "Lambris", prixUnitaire: 60, unite: "M²" },
    { id: "autre", label: "Autre", prixUnitaire: 0, unite: "M²" }
  ],
  plafond: [
    { id: "lessivage-travaux", label: "Lessivage pour travaux", prixUnitaire: 2.5, unite: "M²" },
    { id: "rebouchage", label: "Rebouchage, ponçage", prixUnitaire: 22, unite: "M²" },
    { id: "peinture-acrylique", label: "Peinture type acrylique", prixUnitaire: 32, unite: "M²" },
    { id: "peinture-glycero", label: "Peinture type glycéro", prixUnitaire: 38, unite: "M²" },
    { id: "autre", label: "Autre", prixUnitaire: 0, unite: "M²" }
  ],
  sol: [
    { id: "depose-ancien", label: "Dépose ancien revêtement", prixUnitaire: 15, unite: "M²" },
    { id: "preparation", label: "Préparation support", prixUnitaire: 25, unite: "M²" },
    { id: "carrelage", label: "Carrelage", prixUnitaire: 90, unite: "M²" },
    { id: "parquet", label: "Parquet", prixUnitaire: 85, unite: "M²" },
    { id: "stratifie", label: "Stratifié", prixUnitaire: 65, unite: "M²" },
    { id: "moquette", label: "Moquette", prixUnitaire: 45, unite: "M²" },
    { id: "linoleum", label: "Linoléum", prixUnitaire: 40, unite: "M²" },
    { id: "beton-cire", label: "Béton ciré", prixUnitaire: 120, unite: "M²" },
    { id: "autre", label: "Autre", prixUnitaire: 0, unite: "M²" }
  ],
  menuiseries: [
    { id: "depose-porte", label: "Dépose porte", prixUnitaire: 50, unite: "Ens." },
    { id: "depose-fenetre", label: "Dépose fenêtre", prixUnitaire: 70, unite: "Ens." },
    { id: "pose-porte", label: "Pose porte", prixUnitaire: 180, unite: "Ens." },
    { id: "pose-porte-fenetre", label: "Pose porte-fenêtre", prixUnitaire: 280, unite: "Ens." },
    { id: "pose-fenetre", label: "Pose fenêtre", prixUnitaire: 250, unite: "Ens." },
    { id: "peinture-menuiserie", label: "Peinture menuiserie", prixUnitaire: 45, unite: "M²" },
    { id: "autre", label: "Autre", prixUnitaire: 0, unite: "Unité" }
  ],
  electricite: [
    { id: "interrupteur", label: "Pose interrupteur", prixUnitaire: 40, unite: "Unité" },
    { id: "prise", label: "Pose prise", prixUnitaire: 45, unite: "Unité" },
    { id: "luminaire", label: "Pose luminaire", prixUnitaire: 70, unite: "Unité" },
    { id: "tableau", label: "Tableau électrique", prixUnitaire: 350, unite: "Unité" },
    { id: "autre", label: "Autre", prixUnitaire: 0, unite: "Unité" }
  ],
  plomberie: [
    { id: "evacuation", label: "Évacuation", prixUnitaire: 120, unite: "Ml" },
    { id: "alimentation", label: "Alimentation", prixUnitaire: 140, unite: "Ml" },
    { id: "sanitaire", label: "Sanitaire", prixUnitaire: 180, unite: "Unité" },
    { id: "autre", label: "Autre", prixUnitaire: 0, unite: "Unité" }
  ],
  platrerie: [
    { id: "cloison", label: "Cloison placo", prixUnitaire: 85, unite: "M²" },
    { id: "doublage", label: "Doublage", prixUnitaire: 75, unite: "M²" },
    { id: "faux-plafond", label: "Faux plafond", prixUnitaire: 90, unite: "M²" },
    { id: "autre", label: "Autre", prixUnitaire: 0, unite: "M²" }
  ],
  maconnerie: [
    { id: "ouverture", label: "Création ouverture", prixUnitaire: 450, unite: "Forfait" },
    { id: "demolition", label: "Démolition", prixUnitaire: 250, unite: "M3" },
    { id: "autre", label: "Autre", prixUnitaire: 0, unite: "Forfait" }
  ],
  autre: [
    { id: "autre", label: "Personnalisé", prixUnitaire: 0, unite: "Unité" }
  ]
};

// Unités disponibles
const unites = ["M²", "Ml", "M3", "Unité", "Ens.", "Forfait"];

// Exemple de pièces (à remplacer par les données réelles)
const piecesExemple = [
  { 
    id: 1, 
    nom: "Salon", 
    surface: 25, 
    surfaceMurs: 65, 
    plinthes: 18, 
    surfacePlinthes: 1.8,
    surfaceMenuiseries: 4.2,
    surfaceNetMurs: 60.8,
    menuiseries: [
      { id: 1, nom: "Porte 1", type: "porte", largeur: 0.83, hauteur: 2.04, surface: 1.69 },
      { id: 2, nom: "Fenêtre 1", type: "fenêtre", largeur: 1.2, hauteur: 1.0, surface: 1.2 }
    ]
  },
  { 
    id: 2, 
    nom: "Chambre", 
    surface: 15, 
    surfaceMurs: 45, 
    plinthes: 14, 
    surfacePlinthes: 1.4,
    surfaceMenuiseries: 2.89,
    surfaceNetMurs: 42.11,
    menuiseries: [
      { id: 1, nom: "Porte 1", type: "porte", largeur: 0.83, hauteur: 2.04, surface: 1.69 },
      { id: 2, nom: "Fenêtre 1", type: "fenêtre", largeur: 1.2, hauteur: 1.0, surface: 1.2 }
    ]
  }
];

// Type pour un travail
interface Travail {
  id: string;
  pieceId: number;
  pieceName: string;
  typeTravauxId: string;
  sousTypeId: string;
  sousTypeLabel: string;
  personnalisation: string;
  quantite: number;
  unite: string;
  prixUnitaire: number;
}

const Travaux = () => {
  const navigate = useNavigate();
  const [pieces] = useState(piecesExemple);
  const [pieceSelectionnee, setPieceSelectionnee] = useState<number | null>(null);
  const [typeTravauxSelectionne, setTypeTravauxSelectionne] = useState<string | null>(null);
  const [sousTypeSelectionne, setSousTypeSelectionne] = useState<string | null>(null);
  const [personnalisation, setPersonnalisation] = useState("");
  const [quantiteModifiee, setQuantiteModifiee] = useState<number | null>(null);
  const [uniteSelectionnee, setUniteSelectionnee] = useState<string | null>(null);
  const [travauxAjoutes, setTravauxAjoutes] = useState<Travail[]>([]);
  const [prixPerso, setPrixPerso] = useState<number | null>(null);

  // Chargement des travaux depuis le localStorage au montage du composant
  useEffect(() => {
    const travauxSauvegardes = localStorage.getItem('travaux');
    if (travauxSauvegardes) {
      setTravauxAjoutes(JSON.parse(travauxSauvegardes));
    }
  }, []);

  // Sélectionner une pièce
  const selectionnerPiece = (pieceId: number) => {
    setPieceSelectionnee(pieceId);
    setTypeTravauxSelectionne(null);
    setSousTypeSelectionne(null);
    setPersonnalisation("");
    setQuantiteModifiee(null);
    setUniteSelectionnee(null);
    setPrixPerso(null);
  };

  // Obtenir la pièce sélectionnée
  const getPieceSelectionnee = () => {
    return pieces.find(p => p.id === pieceSelectionnee) || null;
  };

  // Obtenir la surface appropriée selon le type de travaux
  const getQuantiteParDefaut = () => {
    const piece = getPieceSelectionnee();
    if (!piece || !typeTravauxSelectionne) return 0;

    switch (typeTravauxSelectionne) {
      case "murs":
        return piece.surfaceNetMurs;
      case "plafond":
        return piece.surface;
      case "sol":
        return piece.surface;
      case "menuiseries":
        return piece.surfaceMenuiseries;
      default:
        return 1; // Valeur par défaut pour les autres types
    }
  };

  // Obtenir l'unité par défaut du sous-type sélectionné
  const getUniteParDefaut = () => {
    if (!typeTravauxSelectionne || !sousTypeSelectionne) return "M²";

    const sousType = sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux]?.find(
      st => st.id === sousTypeSelectionne
    );
    
    return sousType?.unite || "M²";
  };

  // Ajouter un travail à la liste
  const ajouterTravail = () => {
    if (!pieceSelectionnee || !typeTravauxSelectionne || !sousTypeSelectionne) return;

    const piece = getPieceSelectionnee();
    if (!piece) return;

    const quantite = quantiteModifiee !== null ? quantiteModifiee : getQuantiteParDefaut();
    const unite = uniteSelectionnee || getUniteParDefaut();
    
    const sousType = sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux].find(st => st.id === sousTypeSelectionne);
    if (!sousType) return;

    const nouveauTravail: Travail = {
      id: `${Date.now()}`,
      pieceId: piece.id,
      pieceName: piece.nom,
      typeTravauxId: typeTravauxSelectionne,
      sousTypeId: sousTypeSelectionne,
      sousTypeLabel: sousType.label,
      personnalisation: personnalisation,
      quantite,
      unite,
      prixUnitaire: prixPerso !== null ? prixPerso : sousType.prixUnitaire
    };

    setTravauxAjoutes([...travauxAjoutes, nouveauTravail]);
    setSousTypeSelectionne(null);
    setPersonnalisation("");
    setQuantiteModifiee(null);
    setUniteSelectionnee(null);
    setPrixPerso(null);
    
    toast({
      title: "Travail ajouté",
      description: `${sousType.label} ajouté pour ${piece.nom}`,
    });
  };

  // Supprimer un travail
  const supprimerTravail = (id: string) => {
    setTravauxAjoutes(travauxAjoutes.filter(t => t.id !== id));
    toast({
      title: "Travail supprimé",
      description: "Le travail a été supprimé avec succès",
    });
  };

  // Modifier un travail
  const modifierTravail = (travail: Travail) => {
    setPieceSelectionnee(travail.pieceId);
    
    setTypeTravauxSelectionne(travail.typeTravauxId);
    
    setSousTypeSelectionne(travail.sousTypeId);
    
    setPersonnalisation(travail.personnalisation);
    
    setQuantiteModifiee(travail.quantite);
    setUniteSelectionnee(travail.unite);
    
    setPrixPerso(travail.prixUnitaire);
    
    supprimerTravail(travail.id);
  };

  // Calculer le total
  const calculerTotal = () => {
    return travauxAjoutes.reduce((total, travail) => {
      return total + (travail.quantite * travail.prixUnitaire);
    }, 0);
  };

  // Filtrer les travaux par pièce
  const travauxParPiece = (pieceId: number) => {
    return travauxAjoutes.filter(t => t.pieceId === pieceId);
  };

  // Formater le prix
  const formaterPrix = (prix: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(prix);
  };

  // Enregistrer les travaux
  const enregistrerTravaux = () => {
    localStorage.setItem('travaux', JSON.stringify(travauxAjoutes));
    toast({
      title: "Travaux enregistrés",
      description: "Tous les travaux ont été enregistrés avec succès",
    });
  };

  // Naviguer vers la page de récapitulatif avec enregistrement automatique
  const naviguerVersRecapitulatif = () => {
    localStorage.setItem('travaux', JSON.stringify(travauxAjoutes));
    navigate('/recapitulatif');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-8 gradient-header text-white p-6 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold">
            Travaux à prévoir
          </h1>
          <p className="mt-2 text-lg">Sélectionnez les travaux pour chaque pièce</p>
        </div>

        <div className="mb-4 flex justify-between">
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'estimateur
            </Link>
          </Button>

          <div className="flex gap-2">
            <Button onClick={enregistrerTravaux} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Enregistrer les travaux
            </Button>
            
            <Button onClick={naviguerVersRecapitulatif} variant="default" className="flex items-center gap-2">
              Voir le récapitulatif
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sélection de pièce */}
          <Card className="shadow-md lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Pièces à rénover
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                {pieces.map(piece => (
                  <Button
                    key={piece.id}
                    variant={pieceSelectionnee === piece.id ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => selectionnerPiece(piece.id)}
                  >
                    {piece.nom} ({piece.surface} m²)
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configuration des travaux */}
          <Card className="shadow-md lg:col-span-2">
            <CardHeader>
              <CardTitle>Configuration des travaux</CardTitle>
            </CardHeader>
            <CardContent>
              {pieceSelectionnee ? (
                <>
                  <h3 className="text-lg font-medium mb-4">
                    {getPieceSelectionnee()?.nom}
                  </h3>

                  <div className="space-y-4">
                    {/* Sélection du type de travaux */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Type de travaux</label>
                      <Select 
                        value={typeTravauxSelectionne || ""} 
                        onValueChange={(value) => {
                          setTypeTravauxSelectionne(value);
                          setSousTypeSelectionne(null);
                          setPersonnalisation("");
                          setQuantiteModifiee(null);
                          setUniteSelectionnee(null);
                          setPrixPerso(null);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type de travaux" />
                        </SelectTrigger>
                        <SelectContent>
                          {travauxTypes.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              <div className="flex items-center">
                                {type.icon}
                                <span className="ml-2">{type.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sélection du sous-type */}
                    {typeTravauxSelectionne && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Détail des travaux</label>
                        <Select 
                          value={sousTypeSelectionne || ""} 
                          onValueChange={(value) => {
                            setSousTypeSelectionne(value);
                            // Réinitialiser personnalisation si ce n'est pas "autre"
                            if (value !== "autre") {
                              setPersonnalisation("");
                            }
                            
                            // Définir l'unité par défaut du sous-type
                            const sousType = sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux]?.find(
                              st => st.id === value
                            );
                            setUniteSelectionnee(sousType?.unite || null);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un détail" />
                          </SelectTrigger>
                          <SelectContent>
                            {sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux].map(sousType => (
                              <SelectItem key={sousType.id} value={sousType.id}>
                                {sousType.label} ({formaterPrix(sousType.prixUnitaire)}/{sousType.unite})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Personnalisation pour tous les sous-types */}
                    {sousTypeSelectionne && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Personnalisation</label>
                        <Input
                          value={personnalisation}
                          onChange={(e) => setPersonnalisation(e.target.value)}
                          placeholder="Précisez le type de travaux si nécessaire"
                        />
                      </div>
                    )}

                    {/* Quantité à traiter */}
                    {sousTypeSelectionne && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Quantité à traiter</label>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2">
                            <Input
                              type="number"
                              value={quantiteModifiee !== null ? quantiteModifiee : getQuantiteParDefaut()}
                              onChange={(e) => setQuantiteModifiee(parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <Select 
                            value={uniteSelectionnee || getUniteParDefaut()} 
                            onValueChange={setUniteSelectionnee}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Unité" />
                            </SelectTrigger>
                            <SelectContent>
                              {unites.map(unite => (
                                <SelectItem key={unite} value={unite}>
                                  {unite}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Quantité par défaut: {getQuantiteParDefaut()} {getUniteParDefaut()}
                        </p>
                      </div>
                    )}

                    {/* Prix unitaire personnalisé */}
                    {sousTypeSelectionne && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Prix unitaire</label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={prixPerso !== null ? prixPerso : (sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux]?.find(st => st.id === sousTypeSelectionne)?.prixUnitaire || 0)}
                            onChange={(e) => setPrixPerso(parseFloat(e.target.value) || 0)}
                          />
                          <Button variant="outline" onClick={() => {
                            const prixDefaut = sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux]?.find(st => st.id === sousTypeSelectionne)?.prixUnitaire || 0;
                            setPrixPerso(prixDefaut);
                          }}>
                            Réinitialiser
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Bouton d'ajout */}
                    {sousTypeSelectionne && (
                      <Button onClick={ajouterTravail} className="w-full mt-2">
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter ce travail
                      </Button>
                    )}
                  </div>

                  {/* Liste des travaux ajoutés */}
                  {travauxParPiece(pieceSelectionnee).length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Travaux ajoutés</h3>
                      <div className="space-y-3">
                        {travauxParPiece(pieceSelectionnee).map(travail => {
                          const total = travail.quantite * travail.prixUnitaire;
                          const type = travauxTypes.find(t => t.id === travail.typeTravauxId);
                          
                          return (
                            <Card key={travail.id} className="p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    {type?.icon}
                                    <span className="font-medium ml-2">
                                      {type?.label}: {travail.sousTypeLabel}
                                      {travail.personnalisation && ` (${travail.personnalisation})`}
                                    </span>
                                  </div>
                                  <div className="text-sm mt-1">
                                    {travail.quantite} {travail.unite} × {formaterPrix(travail.prixUnitaire)}/{travail.unite} = {formaterPrix(total)}
                                  </div>
                                </div>
                                <div className="flex space-x-1">
                                  <Button variant="ghost" size="sm" onClick={() => modifierTravail(travail)}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => supprimerTravail(travail.id)}>
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                        
                        <div className="mt-4 text-right">
                          <p className="text-lg font-bold">
                            Total: {formaterPrix(calculerTotal())}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Veuillez sélectionner une pièce pour configurer les travaux
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Travaux;
