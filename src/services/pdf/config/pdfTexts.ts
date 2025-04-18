
export const PDF_TEXTS = {
  CGV: {
    TITLE: 'CONDITIONS GÉNÉRALES DE VENTE',
    SECTIONS: [
      {
        title: 'Article 1 - Objet et champ d\'application',
        content: 'Les présentes conditions générales de vente s\'appliquent à toutes les prestations de services conclues...',
        subsections: [] // Ajout de la propriété subsections (même vide)
      },
      // Add other CGV sections as needed
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
