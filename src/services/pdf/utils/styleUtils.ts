
import { ElementSettings, defaultElementSettings } from '@/features/devis/components/pdf-settings/types/elementSettings';
import { PdfSettings } from '../config/pdfSettingsTypes';
import { Content } from 'pdfmake/interfaces';

/**
 * ID des éléments du PDF pour référence dans les paramètres de style
 */
export const ELEMENT_IDS = {
  // Éléments de la page de couverture
  COVER_TITLE: 'cover_title',
  COVER_SUBTITLE: 'cover_subtitle',
  COVER_COMPANY_NAME: 'cover_company_name',
  COVER_CLIENT_INFO: 'cover_client_info',
  COVER_PROJECT_INFO: 'cover_project_info',
  COVER_DEVIS_INFO: 'cover_devis_info',
  COVER_SIGNATURE: 'cover_signature',
  
  // Éléments des pages de détails
  ROOM_TITLE: 'room_title',
  DETAILS_DESCRIPTION: 'details_description',
  DETAILS_QUANTITY: 'details_quantity',
  DETAILS_PRICE: 'details_price',
  DETAILS_TVA: 'details_tva',
  DETAILS_TOTAL: 'details_total',
  DETAILS_EXTRAS: 'details_extras',
  DETAILS_ROOM_TOTAL: 'details_room_total',
  
  // Éléments de la page récapitulative
  RECAP_TITLE: 'recap_title',
  RECAP_ROOM_LABEL: 'recap_room_label',
  RECAP_ROOM_TOTAL: 'recap_room_total',
  RECAP_TOTAL_HT: 'recap_total_ht',
  RECAP_TOTAL_TVA: 'recap_total_tva',
  RECAP_TOTAL_TTC: 'recap_total_ttc',
  RECAP_SIGNATURE: 'recap_signature',
  RECAP_SALUTATION: 'recap_salutation'
};

/**
 * Récupère les paramètres de style d'un élément spécifique
 * @param elementId - ID de l'élément
 * @param settings - Paramètres PDF globaux
 * @returns ElementSettings - Paramètres de style pour l'élément
 */
export function getElementSettings(elementId: string, settings?: PdfSettings | null): ElementSettings {
  if (!settings || !settings.elements || !settings.elements[elementId]) {
    return defaultElementSettings;
  }
  
  // Fusion avec les valeurs par défaut pour s'assurer que tous les paramètres sont présents
  return {
    ...defaultElementSettings,
    ...settings.elements[elementId]
  };
}

/**
 * Convertit les paramètres de style d'un élément en format compatible avec pdfmake
 * @param elementId - ID de l'élément
 * @param settings - Paramètres PDF globaux
 * @returns Object - Objet de style au format pdfmake
 */
export function convertToPdfStyle(elementId: string, settings?: PdfSettings | null): Partial<Content> {
  const elementSettings = getElementSettings(elementId, settings);
  
  // Construction de l'objet de style au format pdfmake
  const pdfStyle: any = {
    font: elementSettings.fontFamily,
    fontSize: elementSettings.fontSize,
    bold: elementSettings.isBold,
    italics: elementSettings.isItalic,
    color: elementSettings.color,
    alignment: elementSettings.alignment,
    margin: [
      elementSettings.spacing.left,
      elementSettings.spacing.top, 
      elementSettings.spacing.right,
      elementSettings.spacing.bottom
    ]
  };
  
  // Ajout des bordures si au moins une bordure est activée
  const hasBorders = elementSettings.border.top || 
                     elementSettings.border.right || 
                     elementSettings.border.bottom || 
                     elementSettings.border.left;
  
  if (hasBorders) {
    pdfStyle.border = [
      elementSettings.border.top ? elementSettings.border.width : 0,
      elementSettings.border.right ? elementSettings.border.width : 0,
      elementSettings.border.bottom ? elementSettings.border.width : 0,
      elementSettings.border.left ? elementSettings.border.width : 0
    ];
    pdfStyle.borderColor = elementSettings.border.color;
  }
  
  return pdfStyle;
}

/**
 * Convertit les bordures en format ligne de table pour pdfmake
 * @param elementId - ID de l'élément
 * @param settings - Paramètres PDF globaux
 * @returns Function - Fonction de rappel pour le layout de table pdfmake
 */
export function createTableBorderLayout(elementId: string, settings?: PdfSettings | null): any {
  const elementSettings = getElementSettings(elementId, settings);
  
  return {
    hLineWidth: (i: number, node: any) => {
      return (elementSettings.border.top && i === 0) || 
             (elementSettings.border.bottom && i === node.table.body.length) ? 
             elementSettings.border.width : 0;
    },
    vLineWidth: (i: number, node: any) => {
      return (elementSettings.border.left && i === 0) || 
             (elementSettings.border.right && i === node.table.widths.length) ? 
             elementSettings.border.width : 0;
    },
    hLineColor: () => elementSettings.border.color,
    vLineColor: () => elementSettings.border.color,
    paddingLeft: () => elementSettings.spacing.left,
    paddingRight: () => elementSettings.spacing.right,
    paddingTop: () => elementSettings.spacing.top,
    paddingBottom: () => elementSettings.spacing.bottom
  };
}

/**
 * Récupère les paramètres de couleur du PDF
 * @param settings - Paramètres PDF globaux
 * @returns Object - Couleurs du PDF avec valeurs par défaut
 */
export function getPdfColors(settings?: PdfSettings | null): PdfSettings['colors'] {
  const defaultColors = {
    mainText: '#333333',
    detailsText: '#4D7C8A',
    coverLines: '#002855',
    detailsLines: '#4D7C8A',
    totalBoxLines: '#e5e7eb',
    background: '#F3F4F6'
  };
  
  if (!settings || !settings.colors) {
    return defaultColors;
  }
  
  return {
    ...defaultColors,
    ...settings.colors
  };
}

/**
 * Récupère les marges du PDF pour une section spécifique
 * @param section - Section du PDF ('cover', 'details', 'recap')
 * @param settings - Paramètres PDF globaux
 * @returns number[] - Marges [gauche, haut, droite, bas]
 */
export function getPdfMargins(
  section: keyof PdfSettings['margins'], 
  settings?: PdfSettings | null
): [number, number, number, number] {
  const defaultMargins: Record<keyof PdfSettings['margins'], [number, number, number, number]> = {
    cover: [40, 40, 40, 40],
    details: [30, 70, 30, 40],
    recap: [40, 40, 40, 40]
  };
  
  if (!settings || !settings.margins || !settings.margins[section]) {
    return defaultMargins[section];
  }
  
  return settings.margins[section] as [number, number, number, number];
}

/**
 * Récupère les paramètres d'espacement de ligne du PDF
 * @param settings - Paramètres PDF globaux
 * @returns Object - Espacements de ligne avec valeurs par défaut
 */
export function getPdfLineSpacing(settings?: PdfSettings | null): PdfSettings['lineSpacing'] {
  const defaultLineSpacing = {
    coverSections: 1.5,
    betweenFields: 1.2,
    afterDescription: 1.8,
    detailsDescription: 1.4,
    afterDetailRow: 1.2,
    betweenSections: 2
  };
  
  if (!settings || !settings.lineSpacing) {
    return defaultLineSpacing;
  }
  
  return {
    ...defaultLineSpacing,
    ...settings.lineSpacing
  };
}

/**
 * Récupère les paramètres du logo du PDF
 * @param settings - Paramètres PDF globaux
 * @returns Object - Paramètres du logo avec valeurs par défaut
 */
export function getLogoSettings(settings?: PdfSettings | null): PdfSettings['logoSettings'] {
  const defaultLogoSettings = {
    useDefaultLogo: true,
    logoUrl: null,
    width: 150,
    height: 70,
    alignment: 'left' as const
  };
  
  if (!settings || !settings.logoSettings) {
    return defaultLogoSettings;
  }
  
  return {
    ...defaultLogoSettings,
    ...settings.logoSettings
  };
}
