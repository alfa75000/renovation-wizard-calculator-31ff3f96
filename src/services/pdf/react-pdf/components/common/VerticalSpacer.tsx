// src/services/pdf/react-pdf/components/common/VerticalSpacer.tsx

import React from 'react';
import { View } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { PdfElementId } from '@/features/devis/components/pdf-settings/types/typography';
import { getPdfStyles } from '../../utils/pdfStyleUtils'; // Ajuste le chemin

interface VerticalSpacerProps {
  pdfSettings: PdfSettings;
  elementId: PdfElementId; // L'ID spécifique pour cet espace
  defaultHeight?: number; // Hauteur par défaut si non configurée
}

export const VerticalSpacer = ({ 
  pdfSettings, 
  elementId, 
  defaultHeight = 12 // Valeur par défaut si rien n'est paramétré
}: VerticalSpacerProps) => {
  
  // Récupère les styles pour cet ID, en tant que conteneur
  // On utilisera sa marge supérieure (ou inférieure) pour définir la hauteur
  const spacerStyles = getPdfStyles(pdfSettings, elementId, { isContainer: true });

  // Utilise la marge supérieure définie, ou la hauteur par défaut
  const height = spacerStyles.marginTop ?? defaultHeight; 
  // Alternative: utiliser spacerStyles.height si on ajoutait 'height' à ElementSettings

  // Ne rend rien si la hauteur est nulle ou négative
  if (height <= 0) {
    return null;
  }

  // Retourne une View vide avec la hauteur calculée
  return <View style={{ height: height }} />;
};
