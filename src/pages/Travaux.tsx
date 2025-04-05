
import React, { useState } from "react";
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
import { 
  ArrowLeft,
  Paintbrush,
  Hammer,
  Wrench,
  SquarePen,
  Home,
  Plus,
  X,
  Pencil
} from "lucide-react";
import { Link } from "react-router-dom";

// Types de travaux principaux
const travauxTypes = [
  { id: "murs", label: "Revêtement murs", icon: <Paintbrush className="h-4 w-4" /> },
  { id: "plafond", label: "Revêtement plafond", icon: <Paintbrush className="h-4 w-4" /> },
  { id: "sol", label: "Revêtement sol", icon: <Wrench className="h-4 w-4" /> },
  { id: "menuiseries", label: "Menuiseries", icon: <Hammer className="h-4 w-4" /> },
  { id: "electricite", label: "Electricité", icon: <SquarePen className="h-4 w-4" /> },
  { id: "plomberie", label: "Plomberie", icon: <SquarePen className="h-4 w-4" /> },
  { id: "platrerie", label: "Plâtrerie", icon: <SquarePen className="h-4 w-4" /> },
  { id: "maconnerie", label: "Maçonnerie", icon: <SquarePen className="h-4 w-4" /> }
];

// Sous-types de travaux associés à chaque type principal
const sousTravaux = {
  murs: [
    { id: "lessivage-travaux", label: "Lessivage pour travaux", prixUnitaire: 2.2 },
    { id: "lessivage-soigne", label: "Lessivage soigné en conservation", prixUnitaire: 3.5 },
    { id: "grattage", label: "Grattage, ouverture des fissures", prixUnitaire: 5 },
    { id: "rebouchage", label: "Rebouchage, ponçage", prixUnitaire: 20 },
    { id: "enduit-repassage", label: "Enduit repassé, ponçage", prixUnitaire: 25 },
    { id: "toile-renfort", label: "Toile de renfort anti-fissures", prixUnitaire: 15 },
    { id: "bande-calicot", label: "Bande Calicot anti-fissure", prixUnitaire: 10 },
    { id: "toile-verre", label: "Toile de verre à peindre", prixUnitaire: 18 },
    { id: "peinture-acrylique", label: "Peinture type acrylique", prixUnitaire: 30 },
    { id: "peinture-glycero", label: "Peinture type glycéro", prixUnitaire: 35 },
    { id: "vernis", label: "Vernis", prixUnitaire: 40 },
    { id: "enduit-decoratif", label: "Enduit décoratif", prixUnitaire: 45 },
    { id: "papier-peint", label: "Papier peint", prixUnitaire: 22 },
    { id: "faience", label: "Faïence / Carrelage", prixUnitaire: 80 },
    { id: "lambris", label: "Lambris", prixUnitaire: 60 },
    { id: "autre", label: "Autre", prixUnitaire: 0 }
  ],
  plafond: [
    { id: "lessivage-travaux", label: "Lessivage pour travaux", prixUnitaire: 2.5 },
    { id: "rebouchage", label: "Rebouchage, ponçage", prixUnitaire: 22 },
    { id: "peinture-acrylique", label: "Peinture type acrylique", prixUnitaire: 32 },
    { id: "peinture-glycero", label: "Peinture type glycéro", prixUnitaire: 38 },
    { id: "autre", label: "Autre", prixUnitaire: 0 }
  ],
  sol: [
    { id: "depose-ancien", label: "Dépose ancien revêtement", prixUnitaire: 15 },
    { id: "preparation", label: "Préparation support", prixUnitaire: 25 },
    { id: "carrelage", label: "Carrelage", prixUnitaire: 90 },
    { id: "parquet", label: "Parquet", prixUnitaire: 85 },
    { id: "stratifie", label: "Stratifié", prixUnitaire: 65 },
    { id: "moquette", label: "Moquette", prixUnitaire: 45 },
    { id: "linoleum", label: "Linoléum", prixUnitaire: 40 },
    { id: "beton-cire", label: "Béton ciré", prixUnitaire: 120 },
    { id: "autre", label: "Autre", prixUnitaire: 0 }
  ],
  menuiseries: [
    { id: "depose-porte", label: "Dépose porte", prixUnitaire: 50 },
    { id: "depose-fenetre", label: "Dépose fenêtre", prixUnitaire: 70 },
    { id: "pose-porte", label: "Pose porte", prixUnitaire: 180 },
    { id: "pose-porte-fenetre", label: "Pose porte-fenêtre", prixUnitaire: 280 },
    { id: "pose-fenetre", label: "Pose fenêtre", prixUnitaire: 250 },
    { id: "peinture-menuiserie", label: "Peinture menuiserie", prixUnitaire: 45 },
    { id: "autre", label: "Autre", prixUnitaire: 0 }
  ],
  electricite: [
    { id: "interrupteur", label: "Pose interrupteur", prixUnitaire: 40 },
    { id: "prise", label: "Pose prise", prixUnitaire: 45 },
    { id: "luminaire", label: "Pose luminaire", prixUnitaire: 70 },
    { id: "tableau", label: "Tableau électrique", prixUnitaire: 350 },
    { id: "autre", label: "Autre", prixUnitaire: 0 }
  ],
  plomberie: [
    { id: "evacuation", label: "Évacuation", prixUnitaire: 120 },
    { id: "alimentation", label: "Alimentation", prixUnitaire: 140 },
    { id: "sanitaire", label: "Sanitaire", prixUnitaire: 180 },
    { id: "autre", label: "Autre", prixUnitaire: 0 }
  ],
  platrerie: [
    { id: "cloison", label: "Cloison placo", prixUnitaire: 85 },
    { id: "doublage", label: "Doublage", prixUnitaire: 75 },
    { id: "faux-plafond", label: "Faux plafond", prixUnitaire: 90 },
    { id: "autre", label: "Autre", prixUnitaire: 0 }
  ],
  maconnerie: [
    { id: "ouverture", label: "Création ouverture", prixUnitaire: 450 },
    { id: "demolition", label: "Démolition", prixUnitaire: 250 },
    { id: "autre", label: "Autre", prixUnitaire: 0 }
  ]
};

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
  typeTravauxId: string;
  sousTypeId: string;
  sousTypeLabel: string;
  personnalisation: string;
  surface: number;
  prixUnitaire: number;
}

const Travaux = () => {
  const [pieces] = useState(piecesExemple);
  const [pieceSelectionnee, setPieceSelectionnee] = useState<number | null>(null);
  const [typeTravauxSelectionne, setTypeTravauxSelectionne] = useState<string | null>(null);
  const [sousTypeSelectionne, setSousTypeSelectionne] = useState<string | null>(null);
  const [personnalisation, setPersonnalisation] = useState("");
  const [surfaceModifiee, setSurfaceModifiee] = useState<number | null>(null);
  const [travauxAjoutes, setTravauxAjoutes] = useState<Travail[]>([]);

  // Sélectionner une pièce
  const selectionnerPiece = (pieceId: number) => {
    setPieceSelectionnee(pieceId);
    setTypeTravauxSelectionne(null);
    setSousTypeSelectionne(null);
    setPersonnalisation("");
    setSurfaceModifiee(null);
  };

  // Obtenir la pièce sélectionnée
  const getPieceSelectionnee = () => {
    return pieces.find(p => p.id === pieceSelectionnee) || null;
  };

  // Obtenir la surface appropriée selon le type de travaux
  const getSurfaceParDefaut = () => {
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
        return 0;
    }
  };

  // Ajouter un travail à la liste
  const ajouterTravail = () => {
    if (!pieceSelectionnee || !typeTravauxSelectionne || !sousTypeSelectionne) return;

    const surface = surfaceModifiee !== null ? surfaceModifiee : getSurfaceParDefaut();
    const sousType = sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux].find(st => st.id === sousTypeSelectionne);
    
    if (!sousType) return;

    const nouveauTravail: Travail = {
      id: `${Date.now()}`,
      typeTravauxId: typeTravauxSelectionne,
      sousTypeId: sousTypeSelectionne,
      sousTypeLabel: sousType.label,
      personnalisation: personnalisation,
      surface,
      prixUnitaire: sousType.prixUnitaire
    };

    setTravauxAjoutes([...travauxAjoutes, nouveauTravail]);
    setSousTypeSelectionne(null);
    setPersonnalisation("");
    setSurfaceModifiee(null);
  };

  // Supprimer un travail
  const supprimerTravail = (id: string) => {
    setTravauxAjoutes(travauxAjoutes.filter(t => t.id !== id));
  };

  // Modifier un travail (pour une future implémentation)
  const modifierTravail = (travail: Travail) => {
    // Logique de modification à implémenter
    console.log("Modification du travail:", travail);
  };

  // Calculer le total
  const calculerTotal = () => {
    return travauxAjoutes.reduce((total, travail) => {
      return total + (travail.surface * travail.prixUnitaire);
    }, 0);
  };

  // Filtrer les travaux par pièce
  const travauxParPiece = (pieceId: number) => {
    return travauxAjoutes.filter(t => pieceId === pieceSelectionnee);
  };

  // Formater le prix
  const formaterPrix = (prix: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(prix);
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

        <div className="mb-4">
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'estimateur
            </Link>
          </Button>
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
                          setSurfaceModifiee(null);
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
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un détail" />
                          </SelectTrigger>
                          <SelectContent>
                            {sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux].map(sousType => (
                              <SelectItem key={sousType.id} value={sousType.id}>
                                {sousType.label} ({formaterPrix(sousType.prixUnitaire)}/m²)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Personnalisation si "autre" est sélectionné */}
                    {sousTypeSelectionne === "autre" && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Personnalisation</label>
                        <Input
                          value={personnalisation}
                          onChange={(e) => setPersonnalisation(e.target.value)}
                          placeholder="Précisez le type de travaux"
                        />
                      </div>
                    )}

                    {/* Surface à traiter */}
                    {sousTypeSelectionne && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Surface à traiter (m²)</label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={surfaceModifiee !== null ? surfaceModifiee : getSurfaceParDefaut()}
                            onChange={(e) => setSurfaceModifiee(parseFloat(e.target.value) || 0)}
                          />
                          <Button variant="outline" onClick={() => setSurfaceModifiee(getSurfaceParDefaut())}>
                            Réinitialiser
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Surface par défaut: {getSurfaceParDefaut()} m²
                        </p>
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
                          const total = travail.surface * travail.prixUnitaire;
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
                                    {travail.surface} m² × {formaterPrix(travail.prixUnitaire)}/m² = {formaterPrix(total)}
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
