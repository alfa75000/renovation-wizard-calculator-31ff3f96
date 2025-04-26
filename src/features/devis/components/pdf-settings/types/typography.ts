
// Liste des éléments du PDF qu'on peut personnaliser
export const PDF_ELEMENTS = [
  // Élément par défaut pour les styles globaux
  { id: 'default', name: "Styles par défaut", section: 'Général' },

  // Page de garde
  { id: 'insurance_info', name: "Informations d'assurance (partie droite)", section: 'Page de garde' },
  { id: 'company_slogan', name: 'Slogan entreprise', section: 'Page de garde' },
  { id: 'company_address', name: 'Coordonnées société', section: 'Page de garde' },
  { id: 'contact_labels', name: 'Téléphone et Email (Labels)', section: 'Page de garde' },
  { id: 'contact_values', name: 'Téléphone et Email (valeurs)', section: 'Page de garde' },
  { id: 'quote_number', name: 'Numéro de devis', section: 'Page de garde' },
  { id: 'quote_date', name: 'Date', section: 'Page de garde' },
  { id: 'quote_validity', name: 'Validité du devis', section: 'Page de garde' },
  { id: 'client_title', name: "Titre \"Client / Maître d'ouvrage\"", section: 'Page de garde' },
  { id: 'client_content', name: 'Contenu client', section: 'Page de garde' },
  { id: 'project_title', name: 'Titre "Chantier / Travaux"', section: 'Page de garde' },
  { id: 'project_labels', name: 'Labels (Contenu Chantier / Travaux)', section: 'Page de garde' },
  { id: 'project_values', name: 'Valeurs (Contenu Chantier / Travaux)', section: 'Page de garde' },
  { id: 'cover_footer', name: 'Pied de page', section: 'Page de garde' },

  // Page de détail des travaux
  { id: 'detail_header', name: 'En-tête de page "DEVIS N°..."', section: 'Détails des travaux' },
  { id: 'detail_title', name: 'Titre "DÉTAILS DES TRAVAUX"', section: 'Détails des travaux' },
  { id: 'detail_table_header', name: 'En-tête du tableau détails', section: 'Détails des travaux' },
  { id: 'qty_column', name: 'Colonnes Qté', section: 'Détails des travaux' },
  { id: 'price_column', name: 'Colonnes Prix', section: 'Détails des travaux' },
  { id: 'vat_column', name: 'Colonnes TVA', section: 'Détails des travaux' },
  { id: 'total_column', name: 'Colonnes Total', section: 'Détails des travaux' },
  { id: 'room_title', name: 'Titre de chaque pièce', section: 'Détails des travaux' },
  { id: 'work_details', name: 'Lignes détail travaux', section: 'Détails des travaux' },
  { id: 'mo_supplies', name: 'Détails MO/Fournitures', section: 'Détails des travaux' },
  { id: 'room_total', name: 'Ligne total par pièce', section: 'Détails des travaux' },

  // Page de récapitulatif
  { id: 'recap_title', name: 'Titre "RÉCAPITULATIF"', section: 'Récapitulatif' },
  { id: 'recap_table_header', name: 'En-tête Tableau récapitulatif', section: 'Récapitulatif' },
  { id: 'signature_zone', name: 'Zone de signature (colonne gauche)', section: 'Récapitulatif' },
  { id: 'signature_text', name: 'Texte explicatif (signature)', section: 'Récapitulatif' },
  { id: 'approval_text', name: 'Texte « Bon pour accord, devis reçu avant exécution des travaux »', section: 'Récapitulatif' },
  { id: 'totals_table', name: 'Tableau des totaux (colonne droite)', section: 'Récapitulatif' },
  { id: 'ht_vat_totals', name: 'Totaux HT et TVA', section: 'Récapitulatif' },
  { id: 'ttc_total', name: 'Total TTC', section: 'Récapitulatif' },
  { id: 'salutation_text', name: 'Texte de salutation', section: 'Récapitulatif' },

  // Page CGV
  { id: 'cgv_title', name: 'Titre "CONDITIONS GÉNÉRALES DE VENTE"', section: 'CGV' },
  { id: 'cgv_section_titles', name: 'Titres de sections CGV', section: 'CGV' },
  { id: 'cgv_content', name: 'Contenu textuel CGV', section: 'CGV' },
  { id: 'cgv_footer', name: 'Pied de page', section: 'CGV' }
] as const;

// Dériver le type PdfElementId à partir de la constante PDF_ELEMENTS
export type PdfElementId = typeof PDF_ELEMENTS[number]['id'];
