
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
  const spacerStyles = getPdfStyles(pdfSettings, elementId, { isContainer: true });
  const height = typeof spacerStyles.marginTop === 'number' ? spacerStyles.marginTop : defaultHeight;

  // Ne rend rien si la hauteur est nulle ou négative
  if (height <= 0) {
    return null;
  }

  return <View style={{ height }} />;
};
