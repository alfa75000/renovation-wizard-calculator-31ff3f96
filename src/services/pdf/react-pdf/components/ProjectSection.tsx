// src/services/pdf/react-pdf/components/ProjectSection.tsx

import React from 'react'; 
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types'; 
import { getPdfStyles } from '../utils/pdfStyleUtils';
import { VerticalSpacer } from './common/VerticalSpacer'; // Importe l'espaceur

interface ProjectSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const ProjectSection = ({ pdfSettings, projectState }: ProjectSectionProps) => {
  const metadata = projectState.metadata;

  // Styles
  const titleContainerStyles = getPdfStyles(pdfSettings, 'project_title', { isContainer: true });
  const titleTextStyles = getPdfStyles(pdfSettings, 'project_title', { isContainer: false });
  const labelTextStyles = getPdfStyles(pdfSettings, 'project_labels', { isContainer: false });
  const valueTextStyles = getPdfStyles(pdfSettings, 'project_values', { isContainer: false });
  // Styles pour les CONTENEURS des lignes label/valeur (peut utiliser project_values ou un ID dédié)
  const lineContainerStyles = getPdfStyles(pdfSettings, 'project_values', { isContainer: true }); 
  const sectionContainerStyles = getPdfStyles(pdfSettings, 'default', { isContainer: true });

  // Données
  const occupant = metadata?.occupant || ''; 
  const address = metadata?.adresseChantier || '';
  const description = metadata?.descriptionProjet || '';
  const infoComplementaire = metadata?.infoComplementaire || '';

  // === Helper Refactorisé pour retourner un <View> stylé ===
  const renderProjectLine = (
      labelId: PdfElementId, 
      labelText: string, 
      valueId: PdfElementId, 
      valueText: string | undefined | null,
      lineId: PdfElementId = valueId // ID pour le conteneur de la ligne entière
  ) => {
    if (!valueText) return null; 

    const lineContainerStyle = getPdfStyles(pdfSettings, lineId, {isContainer: true});
    const labelStyle = getPdfStyles(pdfSettings, labelId, {isContainer: false});
    const valueStyle = getPdfStyles(pdfSettings, valueId, {isContainer: false});

    return (
      // Conteneur principal de la ligne (applique padding/margin/border)
      <View style={[styles.lineWrapper, lineContainerStyle]}> 
         {/* Conteneur pour label (pour style local si besoin) */}
         <View style={styles.labelContainer}> 
            <Text style={labelStyle}>{labelText}</Text>
         </View>
         {/* Conteneur pour valeur */}
         <View style={styles.valueContainer}> 
           <Text style={valueStyle}>{valueText}</Text>
         </View>
      </View>
    );
  }

  // === Helper Refactorisé pour Label puis Valeur ===
   const renderProjectBlock = (
      labelId: PdfElementId, 
      labelText: string, 
      valueId: PdfElementId, 
      valueText: string | undefined | null,
      labelLineId: PdfElementId = labelId, // ID conteneur ligne label
      valueLineId: PdfElementId = valueId  // ID conteneur ligne valeur
   ) => {
    if (!valueText) return null;

    const labelContainerStyle = getPdfStyles(pdfSettings, labelLineId, {isContainer: true});
    const labelStyle = getPdfStyles(pdfSettings, labelId, {isContainer: false});
    const valueContainerStyle = getPdfStyles(pdfSettings, valueLineId, {isContainer: true});
    const valueStyle = getPdfStyles(pdfSettings, valueId, {isContainer: false});

    return (
       <>
        {/* Conteneur Ligne Label */}
        <View style={[styles.lineWrapper, labelContainerStyle]}>
           <Text style={labelStyle}>{labelText}</Text>
        </View>
        
        {/* Espaceur configurable */}
        <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_project_label" defaultHeight={6} /> 
        
        {/* Conteneur Ligne Valeur */}
        <View style={[styles.lineWrapper, valueContainerStyle]}>
           <Text style={valueStyle}>{valueText}</Text>
        </View>
      </>
    );
   }
  // === Fin Helpers ===

  return (
    <View style={sectionContainerStyles}>
      {/* Titre */}
      <View style={titleContainerStyles}><Text style={titleTextStyles}>Chantier / Travaux</Text></View>
      <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_project_title" defaultHeight={12} />

      {/* Ligne Occupant */}
      {renderProjectLine('project_labels', 'Occupant(s):', 'project_values', occupant)}
      <VerticalSpacer pdfSettings={pdfSettings} elementId="space_between_project_lines" defaultHeight={12} />

      {/* Bloc Adresse */}
      {renderProjectBlock('project_labels', "Adresse Chantier / d'Intervention :", 'project_values', address)}
      <VerticalSpacer pdfSettings={pdfSettings} elementId="space_between_project_lines" defaultHeight={12} />

      {/* Bloc Description */}
      {renderProjectBlock('project_labels', 'Descriptif:', 'project_values', description)}
       <VerticalSpacer pdfSettings={pdfSettings} elementId="space_between_project_lines" defaultHeight={12} />

       {/* Bloc Informations Complémentaires */}
      {renderProjectBlock('project_labels', 'Informations complémentaires:', 'project_values', infoComplementaire)}
      {/* Pas d'espaceur après le dernier bloc */}

    </View>
  );
};

// Styles locaux pour layout
const styles = StyleSheet.create({
  lineWrapper: { // Style pour chaque ligne (label+valeur ou label seul ou valeur seule)
    flexDirection: 'row',
    flexWrap: 'wrap' 
  },
  labelContainer: { // Conteneur du label dans renderProjectLine
     // Pas de style spécifique ici, le style vient du Text et du parent lineWrapper
     marginRight: 5, // Garde l'espace après le label
  },
  valueContainer: { // Conteneur de la valeur dans renderProjectLine
      flex: 1, // Prend l'espace restant
  }
});
