
import { Travail } from '@/types';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ElementSettings } from '@/features/devis/components/pdf-settings/types/elementSettings';

export const TABLE_COLUMN_WIDTHS = {
  DETAILS: ['*', 50, 50, 30, 60],
  TOTALS: [50, 80]
};

export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(value).replace(/\s/g, '\u00A0') + '€';
};

export const formatQuantity = (quantity: number): string => {
  return new Intl.NumberFormat('fr-FR', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(quantity).replace(/\s/g, '\u00A0');
};

export const formatMOFournitures = (travail: Travail): string => {
  const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
  const totalHT = prixUnitaireHT * travail.quantite;
  const montantTVA = (totalHT * travail.tauxTVA) / 100;
  
  return `[ MO: ${formatPrice(travail.prixMainOeuvre)}/u ] [ Fourn: ${formatPrice(travail.prixFournitures)}/u ] [ Total TVA (${travail.tauxTVA}%): ${formatPrice(montantTVA)} ]`;
};

/**
 * Applique les paramètres de style à un élément PDF
 * @param baseDefinition - La définition de base de l'élément
 * @param elementId - L'identifiant de l'élément dans settings.elements
 * @param pdfSettings - Les paramètres PDF globaux
 * @param defaultStyles - Styles par défaut à appliquer si l'élément n'a pas de styles personnalisés
 * @returns La définition de l'élément avec les styles appliqués
 */
export const applyElementStyles = (
  baseDefinition: any, 
  elementId: string, 
  pdfSettings?: PdfSettings,
  defaultStyles?: Partial<ElementSettings>
): any => {
  // Si pas de paramètres, retourner la définition de base
  if (!pdfSettings) return baseDefinition;
  
  // Récupérer les styles spécifiques pour cet élément
  const styles = pdfSettings.elements?.[elementId];
  
  // Si l'élément n'a pas de styles personnalisés, utiliser les styles par défaut ou retourner la définition de base
  if (!styles) {
    if (!defaultStyles) return baseDefinition;
    
    // Appliquer les styles par défaut
    const styledDefinition = { ...baseDefinition };
    
    // Appliquer typographie par défaut
    if (defaultStyles.fontFamily) styledDefinition.fontFamily = defaultStyles.fontFamily;
    if (defaultStyles.fontSize) styledDefinition.fontSize = defaultStyles.fontSize;
    if (defaultStyles.isBold !== undefined) styledDefinition.bold = defaultStyles.isBold;
    if (defaultStyles.isItalic !== undefined) styledDefinition.italic = defaultStyles.isItalic;
    
    // Appliquer apparence par défaut
    if (defaultStyles.color) styledDefinition.color = defaultStyles.color;
    if (defaultStyles.alignment) styledDefinition.alignment = defaultStyles.alignment;
    
    // Appliquer espacement par défaut
    if (defaultStyles.spacing) {
      styledDefinition.margin = [
        defaultStyles.spacing.left || 0,
        defaultStyles.spacing.top || 0,
        defaultStyles.spacing.right || 0,
        defaultStyles.spacing.bottom || 0
      ];
    }
    
    return styledDefinition;
  }
  
  // Créer un nouvel objet pour ne pas modifier l'original
  const styledDefinition = { ...baseDefinition };
  
  // Appliquer typographie
  if (styles.fontFamily) styledDefinition.fontFamily = styles.fontFamily;
  if (styles.fontSize) styledDefinition.fontSize = styles.fontSize;
  if (styles.isBold !== undefined) styledDefinition.bold = styles.isBold;
  if (styles.isItalic !== undefined) styledDefinition.italic = styles.isItalic;
  
  // Appliquer apparence
  if (styles.color) styledDefinition.color = styles.color;
  if (styles.alignment) styledDefinition.alignment = styles.alignment;
  
  // Appliquer espacement
  if (styles.spacing) {
    styledDefinition.margin = [
      styles.spacing.left || 0,
      styles.spacing.top || 0,
      styles.spacing.right || 0,
      styles.spacing.bottom || 0
    ];
  }
  
  // Pour les bordures, nous devons vérifier si l'élément doit être encapsulé dans un tableau
  if (styles.border) {
    const hasBorder = styles.border.top || styles.border.right || styles.border.bottom || styles.border.left;
    
    if (hasBorder) {
      // Ne pas appliquer automatiquement de bordures à un élément simple
      // Ces bordures seront appliquées explicitement dans les générateurs
      styledDefinition._hasBorder = true;
      styledDefinition._borderSettings = { ...styles.border };
    }
  }
  
  return styledDefinition;
};

/**
 * Encapsule un élément dans un tableau pour appliquer des bordures
 * @param content - L'élément à encapsuler
 * @param borderSettings - Les paramètres de bordure
 * @returns Un tableau avec l'élément encapsulé et les bordures appliquées
 */
export const wrapWithBorders = (content: any, borderSettings: any): any => {
  return {
    table: {
      widths: ['*'],
      body: [[content]]
    },
    layout: {
      hLineWidth: function(i: number) {
        if (i === 0) return borderSettings.top ? borderSettings.width || 1 : 0;
        if (i === 1) return borderSettings.bottom ? borderSettings.width || 1 : 0;
        return 0;
      },
      vLineWidth: function(i: number) {
        if (i === 0) return borderSettings.left ? borderSettings.width || 1 : 0;
        if (i === 1) return borderSettings.right ? borderSettings.width || 1 : 0;
        return 0;
      },
      hLineColor: function() {
        return borderSettings.color || '#002855';
      },
      vLineColor: function() {
        return borderSettings.color || '#002855';
      }
    },
    margin: [0, 0, 0, 0]
  };
};
