// src/services/pdf/react-pdf/components/ContactSection.tsx

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getPdfStyles } from '../utils/pdfStyleUtils';

interface ContactSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const ContactSection = ({ pdfSettings, projectState }: ContactSectionProps) => {
  const company = projectState.metadata?.company;

  if (!company) return null;

  // Récupère les styles UNE SEULE FOIS pour éviter appels répétitifs
  const labelTextStyles = getPdfStyles(pdfSettings, 'contact_labels', { isContainer: false });
  const valueTextStyles = getPdfStyles(pdfSettings, 'contact_values', { isContainer: false });
  // Style pour le conteneur de chaque ligne (peut partager 'contact_values' ou avoir son ID)
  const lineContainerStyles = getPdfStyles(pdfSettings, 'contact_values', { isContainer: true }); 
  // Style pour le conteneur global de la section (peut utiliser 'default' ou un ID 'contact_section')
  const sectionContainerStyles = getPdfStyles(pdfSettings, 'default', { isContainer: true }); 

  return (
    // Conteneur global de la section
    <View style={sectionContainerStyles}> 
      {/* Ligne Tel1 */}
      {company.tel1 && (
        // Conteneur pour la ligne, applique les styles (padding, border, margin...)
        <View style={[styles.contactRow, lineContainerStyles]}> 
          <View style={styles.labelContainer}> {/* Conteneur pour largeur fixe label */}
            <Text style={labelTextStyles}>Tél:</Text>
          </View>
          <View style={styles.valueContainer}> {/* Conteneur pour valeur flex */}
            <Text style={valueTextStyles}>{company.tel1}</Text>
          </View>
        </View>
      )}

      {/* Ligne Tel2 */}
      {company.tel2 && (
        <View style={[styles.contactRow, lineContainerStyles]}>
           <View style={styles.labelContainer}>
             {/* Label vide mais avec style pour maintenir l'alignement */}
             <Text style={labelTextStyles}>{''}</Text> 
           </View>
          <View style={styles.valueContainer}>
            <Text style={valueTextStyles}>{company.tel2}</Text>
          </View>
        </View>
      )}

      {/* Ligne Email */}
      {company.email && (
        <View style={[styles.contactRow, lineContainerStyles]}>
           <View style={styles.labelContainer}>
             <Text style={labelTextStyles}>Mail:</Text>
           </View>
          <View style={styles.valueContainer}>
            <Text style={valueTextStyles}>{company.email}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {}, // Le style vient de sectionContainerStyles
  contactRow: {
    flexDirection: 'row',
    // marginBottom vient maintenant de lineContainerStyles.marginBottom
  },
  labelContainer: { // Nouveau conteneur pour gérer la largeur fixe
    width: 40,       
    marginRight: 5,  
    // alignItems peut être utile ici si le label est multi-ligne
    // alignItems: 'flex-start', 
  },
  valueContainer: { // Nouveau conteneur pour que la valeur prenne le reste
    flex: 1 
  },
  // Supprimé: label, value - leurs styles sont dans les <Text>
});
