// src/services/pdf/react-pdf/components/ClientSection.tsx

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getPdfStyles } from '../utils/pdfStyleUtils';

interface ClientSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const ClientSection = ({ pdfSettings, projectState }: ClientSectionProps) => {
  // Utilise clientsData comme source unique
  const clientData = projectState.metadata?.clientsData || 'Données client non renseignées'; 
  
  // Récupère styles titre (conteneur + texte)
  const titleContainerStyles = getPdfStyles(pdfSettings, 'client_title', { isContainer: true });
  const titleTextStyles = getPdfStyles(pdfSettings, 'client_title', { isContainer: false });
  
  // Récupère styles contenu (conteneur + texte)
  const contentContainerStyles = getPdfStyles(pdfSettings, 'client_content', { isContainer: true });
  const contentTextStyles = getPdfStyles(pdfSettings, 'client_content', { isContainer: false });
  
  // Style conteneur global (optionnel)
  const sectionContainerStyles = getPdfStyles(pdfSettings, 'default', { isContainer: true }); 

  return (
    // Conteneur global de la section
    <View style={sectionContainerStyles}> 
      {/* === Titre encapsulé === */}
      <View style={titleContainerStyles}> 
        <Text style={titleTextStyles}>Client / Maître d'ouvrage</Text>
      </View>
      
      {/* Espace entre titre et contenu (peut être contrôlé par marges des éléments) */}
      {/* Ou ajoute un <VerticalSpacer/> si besoin */}
      <View style={{height: 6}} /> 

      {/* === Contenu encapsulé === */}
      {/* Applique les styles de CONTENEUR ici */}
      <View style={contentContainerStyles}> 
        {/* Applique les styles de TEXTE ici */}
        <Text style={contentTextStyles}> 
          {clientData}
        </Text>
      </View>
    </View>
  );
};

// Plus besoin de styles locaux ici si les marges/paddings sont gérés dynamiquement
// const styles = StyleSheet.create({ ... }); 
