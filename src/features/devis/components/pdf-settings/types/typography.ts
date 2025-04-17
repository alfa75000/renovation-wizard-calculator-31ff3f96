
// Liste des éléments du PDF qu'on peut personnaliser
export const PDF_ELEMENTS = [
  // Page de garde
  { id: 'insurance_info', name: "Informations d'assurance", section: 'Page de garde' },
  { id: 'company_slogan', name: 'Slogan entreprise', section: 'Page de garde' },
  { id: 'company_address', name: 'Coordonnées société', section: 'Page de garde' },
  { id: 'contact_labels', name: 'Téléphone et Email (Labels)', section: 'Page de garde' },
  { id: 'contact_values', name: 'Téléphone et Email (valeurs)', section: 'Page de garde' },
  { id: 'quote_number', name: 'Numéro de devis', section: 'Page de garde' },
  { id: 'quote_date', name: 'Date', section: 'Page de garde' },
  { id: 'quote_validity', name: 'Validité du devis', section: 'Page de garde' },
  { id: 'client_title', name: 'Titre "Client / Maître d\'ouvrage"', section: 'Page de garde' },
  { id: 'client_content', name: 'Contenu client', section: 'Page de garde' },
  { id: 'project_title', name: 'Titre "Chantier / Travaux"', section: 'Page de garde' },
  { id: 'project_labels', name: 'Labels', section: 'Page de garde' },
  { id: 'project_values', name: 'Valeurs', section: 'Page de garde' },
  
  // Pages détails
  { id: 'section_title', name: 'Titre de section', section: 'Détails' },
  { id: 'work_title', name: 'Titre travaux', section: 'Détails' },
  { id: 'work_description', name: 'Description travaux', section: 'Détails' },
  { id: 'quantity', name: 'Quantité', section: 'Détails' },
  { id: 'unit_price', name: 'Prix unitaire', section: 'Détails' },
  { id: 'total_price', name: 'Prix total', section: 'Détails' },
  
  // Page récapitulative
  { id: 'subtotal', name: 'Sous-total', section: 'Récapitulatif' },
  { id: 'vat', name: 'TVA', section: 'Récapitulatif' },
  { id: 'discount', name: 'Remise', section: 'Récapitulatif' },
  { id: 'total', name: 'Total TTC', section: 'Récapitulatif' },
  { id: 'payment_terms', name: 'Conditions de paiement', section: 'Récapitulatif' },
  { id: 'legal_notice', name: 'Mentions légales', section: 'Récapitulatif' }
];

