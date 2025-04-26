// src/services/pdf/react-pdf/components/ProjectSection.tsx

import React from 'react'; // Import React pour JSX
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types'; // Assure-toi que ProjectState et ProjectMetadata sont bien définis ici
import { getPdfStyles } from '../utils/pdfStyleUtils';

interface ProjectSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const ProjectSection = ({ pdfSettings, projectState }: ProjectSectionProps) => {
  // Accède aux métadonnées où se trouvent les infos projet
  const metadata = projectState.metadata;

  // Récupération des styles dynamiques via l'utilitaire
  const titleContainerStyles = getPdfStyles(pdfSettings, 'project_title', { isContainer: true });
  const titleTextStyles = getPdfStyles(pdfSettings, 'project_title', { isContainer: false });
  const labelTextStyles = getPdfStyles(pdfSettings, 'project_labels', { isContainer: false });
  const valueTextStyles = getPdfStyles(pdfSettings, 'project_values', { isContainer: false });
  // On peut styler le conteneur global de la section si on a un ID 'project_section' ou utiliser 'default'
  const sectionContainerStyles = getPdfStyles(pdfSettings, 'default', { isContainer: true });

  // Récupération des données projet avec les bons chemins
  const occupant = metadata?.occupant || ''; // Utilise chaîne vide si null/undefined
  const address = metadata?.adresseChantier || '';
  const description = metadata?.descriptionProjet || '';
  const infoComplementaire = metadata?.infoComplementaire || '';

  // Helper pour afficher une ligne Label/Valeur uniquement si la valeur existe
  const renderProjectLine = (labelId: string, labelText: string, valueId: string, valueText: string | undefined | null, addSpacingAfter = true) => {
    if (!valueText) return null; // N'affiche rien si la valeur est vide

    return (
      <>
        <View style={styles.lineWrapper}>
           {/* Optionnel: Conteneur pour le label si on veut lui appliquer des styles de conteneur */}
           {/* <View style={getPdfStyles(pdfSettings, labelId, { isContainer: true })}> */}
              <Text style={[labelTextStyles, styles.label]}>{labelText}</Text>
           {/* </View> */}
           {/* Optionnel: Conteneur pour la valeur */}
           {/* <View style={getPdfStyles(pdfSettings, valueId, { isContainer: true })}> */}
             <Text style={valueTextStyles}>{valueText}</Text>
           {/* </View> */}
        </View>
        {addSpacingAfter && <View style={{ height: 12 /* TODO: Rendre configurable (space_between_project_lines) */ }} />}
      </>
    );
  }

  // Helper pour afficher Label puis Valeur sur ligne suivante
   const renderProjectBlock = (labelId: string, labelText: string, valueId: string, valueText: string | undefined | null, addSpacingAfter = true) => {
    if (!valueText) return null;

    return (
       <>
        <View style={styles.lineWrapper}>
           <Text style={[labelTextStyles, styles.label]}>{labelText}</Text>
        </View>
        <View style={{ height: 6 /* TODO: Configurable (space_after_project_label) */ }} />
        <View style={styles.lineWrapper}>
           <Text style={valueTextStyles}>{valueText}</Text>
        </View>
         {addSpacingAfter && <View style={{ height: 12 /* TODO: Configurable (space_after_project_value) */ }} />}
      </>
    );
   }


  return (
    // Applique les styles de conteneur à la section entière
    <View style={sectionContainerStyles}>
      {/* Titre de la Section */}
      <View style={titleContainerStyles}>
        <Text style={titleTextStyles}>Chantier / Travaux</Text>
      </View>

      {/* Espace après le titre */}
      <View style={{ height: 12 /* TODO: Rendre configurable (space_after_project_title) */ }} />

      {/* Ligne Occupant */}
      {renderProjectLine('project_labels', 'Occupant(s):', 'project_values', occupant, true)}

      {/* Ligne Adresse */}
      {renderProjectBlock('project_labels', "Adresse Chantier / d'Intervention :", 'project_values', address, true)}

      {/* Ligne Description */}
      {renderProjectBlock('project_labels', 'Descriptif:', 'project_values', description, true)}

       {/* Ligne Informations Complémentaires */}
      {renderProjectBlock('project_labels', 'Informations complémentaires:', 'project_values', infoComplementaire, false /* Pas d'espace après le dernier */)}

    </View>
  );
};

// Styles locaux UNIQUEMENT pour le layout, pas pour la déco (qui vient de getPdfStyles)
const styles = StyleSheet.create({
  lineWrapper: { // Pour aligner label et valeur sur la même ligne si besoin, ou juste pour le groupement
    flexDirection: 'row',
    flexWrap: 'wrap' // Permet au texte de passer à la ligne si trop long
  },
  label: {
     // On pourrait mettre un marginRight ici si on veut un espace fixe après le label
     marginRight: 5,
     // Le fontWeight vient de labelTextStyles maintenant
  }
  // value: {} // Le style de value vient entièrement de valueTextStyles
  // title: {} // Le style de title vient entièrement de titleTextStyles
  // container: {} // Le style du container vient de sectionContainerStyles
});