
// Définition des paramètres de style pour chaque élément du PDF

export interface Spacing {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface Border {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
  color?: string;
  width?: number;
}

export interface ElementSettings {
  // Typographie
  fontFamily?: string;
  fontSize?: number;
  isBold?: boolean;
  isItalic?: boolean;
  
  // Apparence
  color?: string;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  fillColor?: string; // Ajout de la propriété fillColor
  
  // Espacement
  spacing?: Spacing;
  
  // Bordure
  border?: Border;
}
