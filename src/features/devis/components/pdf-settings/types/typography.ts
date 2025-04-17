
import { z } from 'zod';

export const TextAlignmentEnum = z.enum(['left', 'center', 'right', 'justify']);
export type TextAlignment = z.infer<typeof TextAlignmentEnum>;

export const BorderPositionEnum = z.enum(['top', 'right', 'bottom', 'left']);
export type BorderPosition = z.infer<typeof BorderPositionEnum>;

export interface ElementSpacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ElementBorder {
  positions: BorderPosition[];
  color: string;
  width: number;
}

export interface TypographyElement {
  id: string;
  name: string;
  section: string;
  fontFamily: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  color: string;
  spacing: ElementSpacing;
  alignment: TextAlignment;
  border?: ElementBorder;
}

// Liste complète des éléments du PDF dans l'ordre d'apparition
export const PDF_ELEMENTS: TypographyElement[] = [
  // --- Page de garde ---
  {
    id: 'validityPeriod',
    name: 'Durée de validité',
    section: 'Page de garde',
    fontFamily: 'Roboto',
    fontSize: 10,
    isBold: false,
    isItalic: true,
    color: '#333333',
    spacing: { top: 5, right: 0, bottom: 10, left: 0 },
    alignment: 'right'
  },
  {
    id: 'companySlogan',
    name: 'Slogan entreprise',
    section: 'Page de garde',
    fontFamily: 'Roboto',
    fontSize: 14,
    isBold: true,
    isItalic: false,
    color: '#333333',
    spacing: { top: 0, right: 0, bottom: 20, left: 0 },
    alignment: 'center'
  },
  {
    id: 'companyInfo',
    name: 'Coordonnées société',
    section: 'Page de garde',
    fontFamily: 'Roboto',
    fontSize: 10,
    isBold: false,
    isItalic: false,
    color: '#333333',
    spacing: { top: 0, right: 0, bottom: 10, left: 0 },
    alignment: 'left'
  },
  {
    id: 'quoteNumber',
    name: 'Numéro de devis',
    section: 'Page de garde',
    fontFamily: 'Roboto',
    fontSize: 12,
    isBold: true,
    isItalic: false,
    color: '#333333',
    spacing: { top: 20, right: 0, bottom: 10, left: 0 },
    alignment: 'left'
  },
  {
    id: 'quoteDate',
    name: 'Date du devis',
    section: 'Page de garde',
    fontFamily: 'Roboto',
    fontSize: 10,
    isBold: false,
    isItalic: false,
    color: '#333333',
    spacing: { top: 0, right: 0, bottom: 20, left: 0 },
    alignment: 'left'
  },
  {
    id: 'clientTitle',
    name: 'Titre "Client / Maître d\'ouvrage"',
    section: 'Page de garde',
    fontFamily: 'Roboto',
    fontSize: 12,
    isBold: true,
    isItalic: false,
    color: '#333333',
    spacing: { top: 20, right: 0, bottom: 10, left: 0 },
    alignment: 'left'
  },
  {
    id: 'clientInfo',
    name: 'Informations client',
    section: 'Page de garde',
    fontFamily: 'Roboto',
    fontSize: 10,
    isBold: false,
    isItalic: false,
    color: '#333333',
    spacing: { top: 0, right: 0, bottom: 20, left: 0 },
    alignment: 'left'
  },
  {
    id: 'projectTitle',
    name: 'Titre "Chantier / Travaux"',
    section: 'Page de garde',
    fontFamily: 'Roboto',
    fontSize: 12,
    isBold: true,
    isItalic: false,
    color: '#333333',
    spacing: { top: 20, right: 0, bottom: 10, left: 0 },
    alignment: 'left'
  },
  {
    id: 'projectInfo',
    name: 'Informations chantier',
    section: 'Page de garde',
    fontFamily: 'Roboto',
    fontSize: 10,
    isBold: false,
    isItalic: false,
    color: '#333333',
    spacing: { top: 0, right: 0, bottom: 20, left: 0 },
    alignment: 'left'
  },
  // --- Page détails des travaux ---
  {
    id: 'pageHeader',
    name: 'En-tête de page',
    section: 'Détails des travaux',
    fontFamily: 'Roboto',
    fontSize: 8,
    isBold: false,
    isItalic: false,
    color: '#333333',
    spacing: { top: 20, right: 40, bottom: 10, left: 40 },
    alignment: 'right'
  },
  {
    id: 'detailsTitle',
    name: 'Titre "DÉTAILS DES TRAVAUX"',
    section: 'Détails des travaux',
    fontFamily: 'Roboto',
    fontSize: 14,
    isBold: true,
    isItalic: false,
    color: '#333333',
    spacing: { top: 20, right: 0, bottom: 20, left: 0 },
    alignment: 'center'
  },
  {
    id: 'tableHeader',
    name: 'En-tête du tableau détails',
    section: 'Détails des travaux',
    fontFamily: 'Roboto',
    fontSize: 10,
    isBold: true,
    isItalic: false,
    color: '#333333',
    spacing: { top: 10, right: 5, bottom: 10, left: 5 },
    alignment: 'center',
    border: {
      positions: ['top', 'right', 'bottom', 'left'],
      color: '#e5e7eb',
      width: 1
    }
  },
  {
    id: 'roomTitle',
    name: 'Titre de pièce',
    section: 'Détails des travaux',
    fontFamily: 'Roboto',
    fontSize: 12,
    isBold: true,
    isItalic: false,
    color: '#333333',
    spacing: { top: 15, right: 0, bottom: 10, left: 0 },
    alignment: 'left'
  },
  {
    id: 'workDescription',
    name: 'Description des travaux',
    section: 'Détails des travaux',
    fontFamily: 'Roboto',
    fontSize: 10,
    isBold: false,
    isItalic: false,
    color: '#333333',
    spacing: { top: 5, right: 5, bottom: 5, left: 5 },
    alignment: 'left'
  },
  {
    id: 'workDetails',
    name: 'Détails MO/Fournitures',
    section: 'Détails des travaux',
    fontFamily: 'Roboto',
    fontSize: 9,
    isBold: false,
    isItalic: true,
    color: '#4D7C8A',
    spacing: { top: 2, right: 5, bottom: 2, left: 5 },
    alignment: 'left'
  },
  // --- Page récapitulatif ---
  {
    id: 'summaryTitle',
    name: 'Titre "RÉCAPITULATIF"',
    section: 'Récapitulatif',
    fontFamily: 'Roboto',
    fontSize: 14,
    isBold: true,
    isItalic: false,
    color: '#333333',
    spacing: { top: 20, right: 0, bottom: 20, left: 0 },
    alignment: 'center'
  },
  {
    id: 'summaryTableHeader',
    name: 'En-tête tableau récapitulatif',
    section: 'Récapitulatif',
    fontFamily: 'Roboto',
    fontSize: 10,
    isBold: true,
    isItalic: false,
    color: '#333333',
    spacing: { top: 10, right: 5, bottom: 10, left: 5 },
    alignment: 'left',
    border: {
      positions: ['top', 'right', 'bottom', 'left'],
      color: '#e5e7eb',
      width: 1
    }
  },
  {
    id: 'signatureText',
    name: 'Texte de signature',
    section: 'Récapitulatif',
    fontFamily: 'Roboto',
    fontSize: 9,
    isBold: false,
    isItalic: false,
    color: '#333333',
    spacing: { top: 20, right: 0, bottom: 10, left: 0 },
    alignment: 'left'
  },
  {
    id: 'signaturePoints',
    name: 'Points signature',
    section: 'Récapitulatif',
    fontFamily: 'Roboto',
    fontSize: 9,
    isBold: false,
    isItalic: false,
    color: '#333333',
    spacing: { top: 5, right: 0, bottom: 5, left: 10 },
    alignment: 'left'
  },
  {
    id: 'totalsTable',
    name: 'Tableau des totaux',
    section: 'Récapitulatif',
    fontFamily: 'Roboto',
    fontSize: 10,
    isBold: true,
    isItalic: false,
    color: '#333333',
    spacing: { top: 5, right: 5, bottom: 5, left: 5 },
    alignment: 'right',
    border: {
      positions: ['top', 'bottom'],
      color: '#e5e7eb',
      width: 1
    }
  },
  {
    id: 'salutationText',
    name: 'Texte de salutation',
    section: 'Récapitulatif',
    fontFamily: 'Roboto',
    fontSize: 10,
    isBold: false,
    isItalic: false,
    color: '#333333',
    spacing: { top: 20, right: 0, bottom: 20, left: 0 },
    alignment: 'justify'
  },
  // --- Conditions Générales de Vente ---
  {
    id: 'cgvTitle',
    name: 'Titre "CONDITIONS GÉNÉRALES DE VENTE"',
    section: 'CGV',
    fontFamily: 'Roboto',
    fontSize: 14,
    isBold: true,
    isItalic: false,
    color: '#333333',
    spacing: { top: 30, right: 0, bottom: 20, left: 0 },
    alignment: 'center'
  },
  {
    id: 'cgvSectionTitle',
    name: 'Titres de sections CGV',
    section: 'CGV',
    fontFamily: 'Roboto',
    fontSize: 12,
    isBold: true,
    isItalic: false,
    color: '#333333',
    spacing: { top: 15, right: 0, bottom: 10, left: 0 },
    alignment: 'left'
  },
  {
    id: 'cgvContent',
    name: 'Contenu CGV',
    section: 'CGV',
    fontFamily: 'Roboto',
    fontSize: 9,
    isBold: false,
    isItalic: false,
    color: '#333333',
    spacing: { top: 5, right: 0, bottom: 5, left: 0 },
    alignment: 'justify'
  },
  // --- Pied de page ---
  {
    id: 'footer',
    name: 'Pied de page',
    section: 'Commun',
    fontFamily: 'Roboto',
    fontSize: 7,
    isBold: false,
    isItalic: false,
    color: '#333333',
    spacing: { top: 10, right: 40, bottom: 20, left: 40 },
    alignment: 'center'
  }
];
