// src/services/pdf/react-pdf/components/QuoteInfoSection.tsx

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getPdfStyles } from '../utils/pdfStyleUtils'; // Utilise getPdfStyles directement
import { formatDate } from '@/services/pdf/utils/dateUtils'; // Assure-toi que cet utilitaire existe et fonctionne

interface QuoteInfoSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const QuoteInfoSection = ({ pdfSettings, projectState }: QuoteInfoSectionProps) => {
  // Accès aux métadonnées
  const metadata = projectState.metadata;

  // Récupération des données
  const quoteNumber = metadata?.devisNumber || 'Non Défini';
  const quoteDateISO = metadata?.dateDevis || new Date().toISOString();
  const quoteValidityText = "(Validité : 3 mois)";

  // Formatage de la date
  const formattedQuoteDate = formatDate(quoteDateISO);

  // --- Styles ---
  // Conteneur global de la LIGNE (pas besoin de style spécifique, sauf si marge globale)
  const sectionContainerStyles = getPdfStyles(pdfSettings, 'default', { isContainer: true });

  // Numéro de Devis (Conteneur + Texte)
  const quoteNumberContainerStyles = getPdfStyles(pdfSettings, 'quote_number', { isContainer: true });
  const quoteNumberTextStyles = getPdfStyles(pdfSettings, 'quote_number', { isContainer: false });

  // Date de Devis (Conteneur + Texte)
  const quoteDateContainerStyles = getPdfStyles(pdfSettings, 'quote_date', { isContainer: true });
  const quoteDateTextStyles = getPdfStyles(pdfSettings, 'quote_date', { isContainer: false });

  // Validité (Conteneur + Texte)
  const quoteValidityContainerStyles = getPdfStyles(pdfSettings, 'quote_validity', { isContainer: true });
  const quoteValidityTextStyles = getPdfStyles(pdfSettings, 'quote_validity', { isContainer: false });

  return (
    // Conteneur principal de la section (qui contiendra la ligne)
    <View style={sectionContainerStyles}>
      {/* La ligne qui contient les 3 éléments */}
      <View style={styles.row}>

        {/* 1. Bloc Numéro de Devis */}
        {/* Ce View est l'enfant direct de la row */}
        <View style={[quoteNumberContainerStyles, styles.quoteItem]}> 
          <Text style={quoteNumberTextStyles}>
            DEVIS N° {quoteNumber}
          </Text>
        </View>

        {/* 2. Bloc Date de Devis */}
        <View style={[quoteDateContainerStyles, styles.quoteItem]}>
          <Text style={quoteDateTextStyles}>
            du {formattedQuoteDate}
          </Text>
        </View>

        {/* 3. Bloc Validité */}
        {/* Pas de style local 'quoteItem' pour le dernier élément */}
        <View style={quoteValidityContainerStyles}> 
          <Text style={quoteValidityTextStyles}>
            {quoteValidityText}
          </Text>
        </View>

      </View>
    </View>
  );
};

// Styles locaux pour le layout de cette section
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', // <-- Met les éléments sur la même ligne
    width: '100%',        // <-- Prend toute la largeur disponible
    // alignItems: 'flex-start', // Comportement par défaut, les aligne en haut
    // PAS de justifyContent: 'space-between' ou flex: 1 ici
  },
  quoteItem: {
    // Ajoute une marge à droite pour espacer les éléments
    // Cette marge s'ajoute aux marges/paddings DYNAMIQUES définis
    // dans quoteNumberContainerStyles et quoteDateContainerStyles
    marginRight: 10, // Ajuste cette valeur pour l'espacement souhaité
  }
  // Les styles pour les conteneurs individuels (bordures, padding, fond)
  // et pour les textes (police, couleur, taille) viennent de getPdfStyles
});
