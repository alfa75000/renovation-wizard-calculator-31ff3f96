
export const PDF_TEXTS = {
  CGV: {
    TITLE: 'CONDITIONS GÉNÉRALES DE VENTE',
    SECTIONS: [
      {
        title: 'Article 1 - Objet et champ d\'application',
        content: 'Les présentes conditions générales de vente s\'appliquent à toutes les prestations de services conclues...',
        subsections: []
      },
      {
        title: 'Article 2 - Prix et modalités de paiement',
        content: 'Les prix des services sont indiqués en euros hors taxes et sont soumis aux taux de TVA en vigueur...',
        subsections: []
      },
      {
        title: 'Article 3 - Délais d\'exécution',
        content: 'Les délais d\'exécution des prestations sont donnés à titre indicatif et ne constituent pas un engagement ferme...',
        subsections: []
      },
      {
        title: 'Article 4 - Réception des travaux',
        content: 'À l\'achèvement des travaux, un procès-verbal de réception sera établi contradictoirement entre les parties...',
        subsections: []
      },
      {
        title: 'Article 5 - Garanties',
        content: 'Les travaux exécutés par l\'entreprise sont garantis conformément à la législation en vigueur et aux dispositions du code civil...',
        subsections: []
      }
    ]
  },
  SIGNATURE: {
    CONTENT: 'Le client reconnaît avoir pris connaissance et accepté les présentes conditions générales de vente.',
    POINTS: [
      { text: 'Signature du client :', bold: true },
      { text: '(précédée de la mention "Bon pour accord")', bold: false }
    ]
  },
  SALUTATION: 'Nous vous remercions de votre confiance et restons à votre disposition pour toute information complémentaire.'
};

export default PDF_TEXTS;
