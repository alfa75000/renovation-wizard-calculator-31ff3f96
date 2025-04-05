
// Données des sous-types de travaux
const sousTravaux = {
  murs: [
    { id: "peinture", label: "Peinture", prixUnitaire: 25, unite: "M²" },
    { id: "papier-peint", label: "Papier peint", prixUnitaire: 22, unite: "M²" },
    { id: "faience", label: "Faïence", prixUnitaire: 80, unite: "M²" },
    { id: "enduit", label: "Enduit", prixUnitaire: 35, unite: "M²" }
  ],
  plafond: [
    { id: "peinture", label: "Peinture", prixUnitaire: 28, unite: "M²" },
    { id: "lambris", label: "Lambris", prixUnitaire: 45, unite: "M²" },
    { id: "faux-plafond", label: "Faux plafond", prixUnitaire: 65, unite: "M²" }
  ],
  sol: [
    { id: "carrelage", label: "Carrelage", prixUnitaire: 85, unite: "M²" },
    { id: "parquet", label: "Parquet", prixUnitaire: 75, unite: "M²" },
    { id: "stratifie", label: "Stratifié", prixUnitaire: 45, unite: "M²" },
    { id: "moquette", label: "Moquette", prixUnitaire: 35, unite: "M²" },
    { id: "linoleum", label: "Linoléum", prixUnitaire: 30, unite: "M²" }
  ],
  menuiseries: [
    { id: "fenetre", label: "Fenêtre", prixUnitaire: 400, unite: "Unité" },
    { id: "porte", label: "Porte", prixUnitaire: 300, unite: "Unité" },
    { id: "porte-fenetre", label: "Porte-fenêtre", prixUnitaire: 600, unite: "Unité" },
    { id: "volet", label: "Volet", prixUnitaire: 200, unite: "Unité" }
  ],
  electricite: [
    { id: "prise", label: "Prise", prixUnitaire: 30, unite: "Unité" },
    { id: "interrupteur", label: "Interrupteur", prixUnitaire: 25, unite: "Unité" },
    { id: "tableau", label: "Tableau électrique", prixUnitaire: 300, unite: "Unité" },
    { id: "luminaire", label: "Luminaire", prixUnitaire: 80, unite: "Unité" }
  ],
  plomberie: [
    { id: "robinetterie", label: "Robinetterie", prixUnitaire: 120, unite: "Unité" },
    { id: "sanitaire", label: "Sanitaire", prixUnitaire: 350, unite: "Unité" },
    { id: "evacuation", label: "Évacuation", prixUnitaire: 45, unite: "ML" }
  ],
  platrerie: [
    { id: "cloison", label: "Cloison", prixUnitaire: 70, unite: "M²" },
    { id: "doublage", label: "Doublage", prixUnitaire: 55, unite: "M²" },
    { id: "plafond", label: "Plafond", prixUnitaire: 65, unite: "M²" }
  ],
  maconnerie: [
    { id: "demolition", label: "Démolition", prixUnitaire: 80, unite: "M²" },
    { id: "ouverture", label: "Ouverture mur", prixUnitaire: 250, unite: "M²" },
    { id: "construction", label: "Construction mur", prixUnitaire: 150, unite: "M²" }
  ],
  autre: [
    { id: "autre", label: "Autre", prixUnitaire: 0, unite: "Unité" }
  ]
};

export default sousTravaux;
