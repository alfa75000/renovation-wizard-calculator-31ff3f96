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
import { formaterPrix, formaterQuantite, arrondir2Decimales } from "@/lib/utils";

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

// Taux de TVA disponibles
const tauxTVA = [
  { id: "0", taux: 0, label: "0 %" },
  { id: "5.5", taux: 5.5, label: "5,5 %" },
  { id: "10", taux: 10, label: "10 %" },
  { id: "20", taux: 20, label: "20 %" },
  { id: "autre", taux: 0, label: "Autre" }
];

// Type pour un travail
interface Travail {
  id: string;
  pieceId: number;
  pieceName: string;
  typeTravauxId: string;
  typeTravauxLabel: string;
  sousTypeId: string;
  sousTypeLabel: string;
  personnalisation: string;
  quantite: number;
  unite: string;
  prixFournitures: number;
  prixMainOeuvre: number;
  prixUnitaire: number;
  tauxTVA: number; // Ajout du taux de TVA
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
  const [prixFournitures, setPrixFournitures] = useState<number | null>(null);
  const [prixMainOeuvre, setPrixMainOeuvre] = useState<number | null>(null);
  const [tauxTVASelectionne, setTauxTVASelectionne] = useState<number>(10); // 10% par défaut
  const [tauxTVAAutre, setTauxTVAAutre] = useState<number>(0);

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
    setPrixFournitures(null);
    setPrixMainOeuvre(null);
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

  // Calculer le prix unitaire total avec arrondi
  const calculerPrixUnitaire = (prixFourn: number, prixMO: number) => {
    return arrondir2Decimales(prixFourn + prixMO);
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

    const typeTravauxObj = travauxTypes.find(t => t.id === typeTravauxSelectionne);
    if (!typeTravauxObj) return;

    // Calculer prix fournitures avec arrondi à 2 décimales
    const prixFournituresDefaut = arrondir2Decimales(
      (prixFournitures !== null ? prixFournitures : 
      (sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux]?.find(
        st => st.id === sousTypeSelectionne)?.prixUnitaire || 0) * 0.4)
    );
    
    // Calculer prix main d'œuvre avec arrondi à 2 décimales
    const prixMainOeuvreDefaut = arrondir2Decimales(
      (prixMainOeuvre !== null ? prixMainOeuvre : 
      (sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux]?.find(
        st => st.id === sousTypeSelectionne)?.prixUnitaire || 0) * 0.6)
    );

    const prixFourn = prixFournitures !== null ? arrondir2Decimales(prixFournitures) : prixFournituresDefaut;
    const prixMO = prixMainOeuvre !== null ? arrondir2Decimales(prixMainOeuvre) : prixMainOeuvreDefaut;
    const prixTotal = calculerPrixUnitaire(prixFourn, prixMO);
    
    let tauxFinal = tauxTVASelectionne;
    if (tauxTVASelectionne === 0 && tauxTVAAutre > 0) {
      tauxFinal = arrondir2Decimales(tauxTVAAutre);
    }

    const nouveauTravail: Travail = {
      id: `${Date.now()}`,
      pieceId: piece.id,
      pieceName: piece.nom,
      typeTravauxId: typeTravauxSelectionne,
      typeTravauxLabel: typeTravauxObj.label,
      sousTypeId: sousTypeSelectionne,
      sousTypeLabel: sousType.label,
      personnalisation: personnalisation,
      quantite: arrondir2Decimales(quantite),
      unite,
      prixFournitures: prixFourn,
      prixMainOeuvre: prixMO,
      prixUnitaire: prixTotal,
      tauxTVA: tauxFinal
    };

    setTravauxAjoutes([...travauxAjoutes, nouveauTravail]);
    setSousTypeSelectionne(null);
    setPersonnalisation("");
    setQuantiteModifiee(null);
    setUniteSelectionnee(null);
    setPrixFournitures(null);
    setPrixMainOeuvre(null);
    
    toast({
      title: "Travail ajouté",
      description: `${typeTravauxObj.label}: ${sousType.label} ajouté pour ${piece.nom}`,
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
    setPrixFournitures(travail.prixFournitures);
    setPrixMainOeuvre(travail.prixMainOeuvre);
    
    supprimerTravail(travail.id);
  };

  // Calculer le total
  const calculerTotal = () => {
    return parseFloat(travauxAjoutes.reduce((total, travail) => {
      return total + (travail.quantite * travail.prixUnitaire);
    }, 0).toFixed(2));
  };

  // Filtrer les travaux par pièce
  const travauxParPiece = (pieceId: number) => {
    return travauxAjoutes.filter(t => t.pieceId === pieceId);
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
                          setPrixFournitures(null);
                          setPrixMainOeuvre(null);
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Prestations</label>
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

                              // Réinitialiser les prix personnalisés
                              setPrixFournitures(null);
                              setPrixMainOeuvre(null);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une prestation" />
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

                        <div>
                          <label className="block text-sm font-medium mb-1">Taux de TVA Principal</label>
                          <div className="flex gap-2">
                            <Select 
                              value={tauxTVASelectionne === 0 && tauxTVAAutre > 0 ? "autre" : tauxTVASelectionne.toString()} 
                              onValueChange={(value) => {
                                if (value === "autre") {
                                  setTauxTVASelectionne(0);
                                } else {
                                  setTauxTVASelectionne(parseFloat(value));
                                }
                              }}
                            >
                              <SelectTrigger className="flex-grow">
                                <SelectValue placeholder="Sélectionnez un taux de TVA" />
                              </SelectTrigger>
                              <SelectContent>
                                {tauxTVA.map(taux => (
                                  <SelectItem key={taux.id} value={taux.id}>
                                    {taux.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            {(tauxTVASelectionne === 0 || tauxTVA.find(t => t.id === "autre")?.id === tauxTVASelectionne.toString()) && (
                              <div className="flex items-center">
                                <Input 
                                  type="number"
                                  value={tauxTVAAutre}
                                  onChange={(e) => setTauxTVAAutre(parseFloat(e.target.value) || 0)}
                                  className="w-24"
                                  min="0"
                                  max="100"
                                  step="0.1"
                                />
                                <span className="ml-1">%</span>
                              </div>
                            )}
                          </div>
                        </div>
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
                              step="0.01"
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
                          Quantité par défaut: {formaterQuantite(getQuantiteParDefaut())} {getUniteParDefaut()}
                        </p>
                      </div>
                    )}

                    {/* Prix des fournitures et de la main d'œuvre */}
                    {sousTypeSelectionne && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1">Prix fournitures ({getUniteParDefaut()})</label>
                          <Input
                            type="number"
                            value={prixFournitures !== null ? prixFournitures : 
                              (sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux]?.find(st => st.id === sousTypeSelectionne)?.prixUnitaire || 0) * 0.4}
                            onChange={(e) => setPrixFournitures(parseFloat(e.target.value) || 0)}
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Prix main d'œuvre ({getUniteParDefaut()})</label>
                          <Input
                            type="number"
                            value={prixMainOeuvre !== null ? prixMainOeuvre : 
                              (sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux]?.find(st => st.id === sousTypeSelectionne)?.prixUnitaire || 0) * 0.6}
                            onChange={(e) => setPrixMainOeuvre(parseFloat(e.target.value) || 0)}
                            step="0.01"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Prix unitaire total: {formaterPrix(
                              (prixFournitures !== null ? prixFournitures : 
                                (sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux]?.find(st => st.id === sousTypeSelectionne)?.prixUnitaire || 0) * 0.4) + 
                              (prixMainOeuvre !== null ? prixMainOeuvre : 
                                (sousTravaux[typeTravauxSelectionne as keyof typeof sousTravaux]?.find(st => st.id === sousTypeSelectionne)?.prixUnitaire || 0) * 0.6)
                            )}/{getUniteParDefaut()}
                          </p>
                        </div>
                      </>
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
                          const total = parseFloat((travail.quantite * travail.prixUnitaire).toFixed(2));
                          const type = travauxTypes.find(t => t.id === travail.typeTravauxId);
                          
                          return (
                            <Card key={travail.id} className="p-3">
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-medium">
                                    {travail.typeTravauxLabel}: {travail.sousTypeLabel}
                                    {travail.personnalisation && ` (${travail.personnalisation})`}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {formaterQuantite(travail.quantite)} {travail.unite} × {formaterPrix(travail.prixUnitaire)}/{travail.unite}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Fournitures: {formaterPrix(travail.prixFournitures)} | Main d'œuvre: {formaterPrix(travail.prixMainOeuvre)} | TVA: {travail.tauxTVA}%
                                  </p>
                                </div>
                                <div className="flex flex-col items-end">
                                  <p className="font-medium">{formaterPrix(total)}</p>
                                  <div className="flex space-x-1 mt-1">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => modifierTravail(travail)}
                                      className="h-7 px-2 text-xs"
                                    >
                                      <Pencil className="h-3 w-3 mr-1" />
                                      Editer
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      size="sm" 
                                      onClick={() => supprimerTravail(travail.id)}
                                      className="h-7 px-2 text-xs"
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      Supprimer
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <Home className="h-10 w-10 mx-auto mb-4 opacity-50" />
                  <p>Veuillez sélectionner une pièce pour commencer</p>
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
