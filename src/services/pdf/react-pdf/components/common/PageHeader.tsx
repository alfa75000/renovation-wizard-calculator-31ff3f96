//src/services/pdf/react-pdf/components/common/PageHeader.tsx

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getPdfStyles } from '../../utils/pdfStyleUtils';

interface PageHeaderProps {
  pdfSettings: PdfSettings;
  metadata: ProjectState['metadata'];
  // Ajoute la prop render pour la numérotation
  render: (props: { pageNumber: number; totalPages: number }) => string;
}

export const PageHeader = ({ pdfSettings, metadata, render }: PageHeaderProps) => {
  const headerTextStyles = getPdfStyles(pdfSettings, 'detail_header', { isContainer: false });
  const headerContainerStyles = getPdfStyles(pdfSettings, 'detail_header', { isContainer: true });

  return (
    <View 
      style={[styles.headerContainer, headerContainerStyles]} 
      fixed // Reste fixe sur chaque page
    >
      {/* Utilise la prop render pour afficher le texte avec les numéros de page */}
      <Text style={headerTextStyles} render={render} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 20, // Ajuste si besoin
    left: 40, // Doit correspondre aux marges de page
    right: 40, // Doit correspondre aux marges de page
    textAlign: 'right',
  }
});
