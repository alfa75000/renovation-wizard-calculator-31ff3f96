// src/services/pdf/react-pdf/components/common/VerticalSpacer.tsx

import React from 'react';
import { View } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { PdfElementId } from '@/features/devis/components/pdf-settings/types/typography';
import { getPdfStyles } from '../../utils/pdfStyleUtils';

interface VerticalSpacerProps {
  pdfSettings: PdfSettings;
  elementId: PdfElementId;
  defaultHeight?: number;
}

export const VerticalSpacer = ({ 
  pdfSettings, 
  elementId, 
  defaultHeight = 12
}: VerticalSpacerProps) => {
  
  // Récupère les styles pour cet ID, en tant que conteneur
  const spacerStyles = getPdfStyles(pdfSettings, elementId, { isContainer: true });

  // Utilise la marge supérieure définie, ou la hauteur par défaut
  // IMPORTANT: S'assurer que la valeur est un nombre positif
  const height = (typeof spacerStyles.marginTop === 'number' && spacerStyles.marginTop > 0) 
    ? spacerStyles.marginTop 
    : defaultHeight;

  // Ne rend rien si la hauteur est nulle ou négative
  if (height <= 0) return null;

  // CORRECTION: Retourne un View vide avec une hauteur définie au lieu d'utiliser un espace
  return <View style={{ height }} />;
};
