
// Liste des éléments du PDF qu'on peut personnaliser
export const PDF_ELEMENTS = [
  // Page de garde
  { id: 'title', name: 'Titre principal', section: 'Page de garde' },
  { id: 'subtitle', name: 'Sous-titre', section: 'Page de garde' },
  { id: 'client_info', name: 'Informations client', section: 'Page de garde' },
  { id: 'project_info', name: 'Informations projet', section: 'Page de garde' },
  { id: 'company_info', name: 'Informations société', section: 'Page de garde' },
  
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
