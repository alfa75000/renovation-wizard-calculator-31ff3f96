// src/features/devis/components/pdf-settings/types/typography.ts

// Liste des éléments du PDF qu'on peut personnaliser
export const PDF_ELEMENTS = [
  // Élément par défaut pour les styles globaux
  { id: 'default', name: "Styles par défaut", section: 'Général' },

  // === Page de garde ===
  { id: 'insurance_info', name: "Informations d'assurance", section: 'Page de garde' },
  { id: 'company_slogan', name: 'Slogan entreprise', section: 'Page de garde' },
  { id: 'company_address', name: 'Coordonnées société', section: 'Page de garde' },
  { id: 'contact_labels', name: 'Labels Contact', section: 'Page de garde' },
  { id: 'contact_values', name: 'Valeurs Contact', section: 'Page de garde' },
  { id: 'quote_number', name: 'Numéro de devis', section: 'Page de garde' },
  { id: 'quote_date', name: 'Date devis', section: 'Page de garde' },
  { id: 'quote_validity', name: 'Validité devis', section: 'Page de garde' },
  { id: 'client_title', name: "Titre Section Client", section: 'Page de garde' },
  { id: 'client_content', name: 'Contenu Bloc Client', section: 'Page de garde' },
  { id: 'project_title', name: 'Titre Section Projet', section: 'Page de garde' },
  { id: 'project_labels', name: 'Labels Projet', section: 'Page de garde' },
  { id: 'project_values', name: 'Valeurs Projet', section: 'Page de garde' },
  { id: 'cover_footer', name: 'Pied de page (Garde)', section: 'Page de garde' },
  // Espacements Page de Garde (si on veut les contrôler spécifiquement)
  { id: 'space_after_header', name: 'Espace après En-tête (Garde)', section: 'Page de garde Espacements' },
  { id: 'space_after_slogan', name: 'Espace après Slogan (Garde)', section: 'Page de garde Espacements' },
  // ... etc pour la page de garde

  // === Page de détail des travaux ===
  { id: 'detail_header', name: 'En-tête de page (Détails)', section: 'Détails des travaux' }, 
  { id: 'detail_title', name: 'Titre "DÉTAILS DES TRAVAUX"', section: 'Détails des travaux' },
  { id: 'detail_table_header', name: 'En-tête Tableau Détails', section: 'Détails des travaux' },
  { id: 'qty_column', name: 'Texte Colonne Quantité', section: 'Détails des travaux' },
  { id: 'price_column', name: 'Texte Colonne Prix Unit.', section: 'Détails des travaux' },
  { id: 'vat_column', name: 'Texte Colonne TVA', section: 'Détails des travaux' },
  { id: 'total_column', name: 'Texte Colonne Total HT', section: 'Détails des travaux' },
  { id: 'room_title', name: 'Titre de Pièce', section: 'Détails des travaux' },
  { id: 'work_details', name: 'Ligne Type/Sous-type travail', section: 'Détails des travaux' },
  { id: 'work_description_text', name: 'Texte Description travail', section: 'Détails des travaux' },
  { id: 'work_personalization_text', name: 'Texte Personnalisation travail', section: 'Détails des travaux' },
  { id: 'mo_supplies', name: 'Ligne MO/Fournitures', section: 'Détails des travaux' },
  { id: 'room_total', name: 'Ligne Total par Pièce', section: 'Détails des travaux' },
   // Espacements Page Détails (si besoin)
  { id: 'space_after_detail_title', name: 'Espace après Titre Détails', section: 'Détails Espacements' },
  { id: 'space_after_room_title', name: 'Espace après Titre Pièce', section: 'Détails Espacements' },
  { id: 'space_after_work_line', name: 'Espace après Ligne Travail', section: 'Détails Espacements' },
  { id: 'space_after_room_total', name: 'Espace après Total Pièce', section: 'Détails Espacements' },


  // === Page de récapitulatif ===
  { id: 'recap_title', name: 'Titre "RÉCAPITULATIF"', section: 'Récapitulatif' },
  { id: 'recap_table_header', name: 'En-tête Tableau Récap.', section: 'Récapitulatif' },
  // --- NOUVEAUX IDs pour le tableau récap ---
  { id: 'recap_designation_column', name: 'Texte Colonne Désignations (Récap)', section: 'Récapitulatif' },
  { id: 'recap_amount_column', name: 'Texte Colonne Montant HT (Récap)', section: 'Récapitulatif' },
  { id: 'signature_zone', name: 'Zone de Signature (Conteneur)', section: 'Récapitulatif' },
  { id: 'signature_text', name: 'Texte Explicatif Signature', section: 'Récapitulatif' },
  { id: 'approval_text', name: 'Texte "Bon pour accord..."', section: 'Récapitulatif' },
  { id: 'totals_table', name: 'Tableau Totaux (Conteneur)', section: 'Récapitulatif' },
  { id: 'ht_vat_totals', name: 'Lignes Totaux HT et TVA', section: 'Récapitulatif' },
  { id: 'ttc_total', name: 'Ligne Total TTC', section: 'Récapitulatif' },
  { id: 'salutation_text', name: 'Texte de Salutation', section: 'Récapitulatif' },
  // --- ★★★ NOUVEAUX IDs pour Espacements Récap ★★★ ---
  { id: 'space_after_recap_title', name: 'Espace après Titre Récap', section: 'Récapitulatif Espacements' },
  { id: 'space_after_recap_table', name: 'Espace après Tableau Récap Pièces', section: 'Récapitulatif Espacements' },
  { id: 'space_after_signature_text', name: 'Espace après Texte Signature', section: 'Récapitulatif Espacements' }, 
  { id: 'space_after_approval_text', name: 'Espace avant zone signature vide', section: 'Récapitulatif Espacements' }, 
  { id: 'space_after_signature_zone', name: 'Espace après Colonnes Signature/Totaux', section: 'Récapitulatif Espacements' }, 
  // ----------------------------------------------------

  // === Page CGV ===
  { id: 'cgv_title', name: 'Titre "CGV"', section: 'CGV' },
  { id: 'cgv_section_titles', name: 'Titres Sections CGV', section: 'CGV' },
  { id: 'cgv_content', name: 'Contenu Textuel CGV', section: 'CGV' },
  { id: 'cgv_footer', name: 'Pied de page (CGV)', section: 'CGV' }, 
  // --- ★★★ NOUVEAUX IDs pour Espacements CGV ★★★ ---
  { id: 'space_after_cgv_title', name: 'Espace après Titre CGV', section: 'CGV Espacements' },
  { id: 'space_after_cgv_section_title', name: 'Espace après Titre Section CGV', section: 'CGV Espacements' },
  { id: 'space_after_cgv_content', name: 'Espace après Paragraphe CGV', section: 'CGV Espacements' },
  { id: 'space_after_cgv_subsection_title', name: 'Espace après Titre Sous-Section CGV', section: 'CGV Espacements' },
  { id: 'space_between_cgv_bullets', name: 'Espace entre Puces CGV', section: 'CGV Espacements' },
  // -----------------------------------------------

] as const; // Ne pas oublier "as const"

// Dériver le type PdfElementId à partir de la constante PDF_ELEMENTS
export type PdfElementId = typeof PDF_ELEMENTS[number]['id'];
