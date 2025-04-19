
export const DARK_BLUE = "#002855";

export const PDF_TEXTS = {
  // Texte de signature sur le devis - Version mise à jour
  SIGNATURE: {
    CONTENT: "En signant ce devis, le Client reconnaît avoir reçu le devis ainsi que les conditions générales, ci-joint, avant l'exécution des travaux. Mention manuscrite obligatoire :",
    POINTS: [
      { text: "• Date et signature du client.", bold: false },
      { text: "• « Bon pour accord, devis reçu avant exécution des travaux »", bold: true }
    ]
  },
  
  // Texte de salutation
  SALUTATION: "En espérant avoir répondu à vos attentes, je reste à votre disposition pour tout complément d'information ou précision concernant ce devis. Je vous prie d'accepter, Madame, Monsieur, mes plus sincères salutations. LAJILI Aniss.",
  
  // Conditions générales de vente
  CGV: {
    TITLE: "CONDITIONS GÉNÉRALES DE VENTE",
    SECTIONS: [
      {
        title: "1. Validité du devis",
        content: "Le présent devis est établi conformément à la législation en vigueur. Il est valable 3 mois (sauf mentions contraire) à compter de sa date d'émission."
      },
      {
        title: "2. Application du taux réduit de TVA",
        content: "Toute variation du taux de TVA entre la date d'émission et la réalisation des travaux sera entièrement répercutée au Client.\n\nConformément aux articles 279-0 bis et 278-0 bis A du Code Général des Impôts, certains travaux réalisés dans des locaux à usage d'habitation achevés depuis plus de deux ans peuvent bénéficier d'un taux réduit de TVA (5,5 % ou 10 %, selon la nature des travaux).\n\nEn acceptant ce devis, le Client atteste sur l'honneur que les conditions nécessaires à l'application du taux réduit sont réunies. Il s'engage à fournir, à la demande de l'entreprise, l'attestation simplifiée (formulaire n°1301-SD) exigée par l'administration fiscale. En cas de fausse déclaration, le Client est solidairement responsable du redressement fiscal, y compris du paiement du complément de TVA.\n\nNota : Pour les travaux d'entretien inférieurs à 300 € TTC, cette attestation n'est pas exigée, sous réserve que la facture précise que le bien a plus de deux ans, ainsi que la nature des travaux et le lieu d'intervention."
      },
      {
        title: "3. Conditions de règlement et de vente",
        content: "Un acompte de 30 % ainsi que le règlement des fournitures sont exigés à la commande. Le solde est dû à réception des travaux, sur présentation de la facture. Le règlement devra intervenir sous 7 jours calendaires après facturation.\n\nPour tout devis supérieur à 1 000 € TTC, l'entreprise pourra demander un ou plusieurs acomptes intermédiaires, en fonction de l'avancement des travaux.",
        subsections: [
          {
            title: "➤ Retards et impayés",
            content: "Tout retard de paiement entraînera, de plein droit et sans mise en demeure :",
            bullets: [
              "Des pénalités de retard au taux de 15 % annuels (1,25 % par mois entamé) sur le montant TTC dû.",
              "Une indemnité forfaitaire de 40 € pour frais de recouvrement (article D.441-5 du Code de commerce).",
              "La facturation de tous frais supplémentaires engagés (relances, recouvrement, huissier, avocat…)."
            ],
            content_after: "L'entreprise pourra suspendre ou retarder les travaux sans responsabilité si les paiements ne sont pas conformes. Elle décline toute responsabilité pour les conséquences de cette suspension (retard de chantier, dégradations, désordres, pénalités de retard, etc.)."
          },
          {
            title: "➤ Clause de réserve de propriété",
            content: "Les fournitures, matériaux, équipements et installations posés restent la propriété de l'entreprise jusqu'au paiement intégral du montant dû. En cas de non-paiement, l'entreprise se réserve le droit d'en exiger la restitution immédiate, sans préjudice pour les prestations déjà effectuées."
          },
          {
            title: "➤ Commandes et fournitures",
            content: "Toute commande de matériel, sur stock ou sur mesure, est définitive. Les produits sont ni repris ni échangés, sauf accord exceptionnel de l'entreprise.\n\nEn cas de retour accepté, tous les frais engagés (transport, frais de reprise, frais de traitement ou de restockage du fournisseur) seront à la charge exclusive du Client."
          }
        ]
      },
      {
        title: "4. Assurances et garanties",
        content: "Les garanties légales (garantie de parfait achèvement, biennale, décennale) prennent effet à la date de la facture finale, matérialisant la réception des travaux.\n\nLe point de départ de ces garanties est fixé à la date de facturation, même si le solde n'a pas encore été réglé. Cependant, en l'absence de paiement intégral ou en cas de non-respect des conditions générales de vente, l'entreprise se réserve le droit de suspendre toute couverture d'assurance et d'engager toute procédure utile."
      },
      {
        title: "5. Conditions d'intervention",
        content: "Les travaux sont réalisés dans des locaux libérés de tout encombrement (meubles, objets personnels, marchandises…).\n\nLe Client s'engage à préparer les lieux, à garantir l'accès libre et sécurisé au chantier et à permettre l'intervention des équipes dans des conditions normales (accès à l'eau, électricité, sanitaires, local de pause…).\n\nLes horaires d'intervention sont définis de 8h à 17h30, du lundi au vendredi."
      }
    ]
  }
};

export const PDF_STYLES = {
  header: {
    fontSize: 8,
    color: DARK_BLUE,
    margin: [0, 5, 0, 10]
  },
  roomTitle: {
    fontSize: 9,
    bold: true,
    color: DARK_BLUE,
    fillColor: '#f3f4f6',
    padding: [5, 3, 5, 3],
    margin: [0, 10, 0, 5]
  },
  tableHeader: {
    fontSize: 9,
    bold: true,
    color: DARK_BLUE
  },
  italic: {
    italics: true
  }
};

export const PDF_MARGINS = {
  COVER: [40, 40, 40, 40],
  DETAILS: [30, 70, 30, 40],
  RECAP: [40, 40, 40, 40]
};
