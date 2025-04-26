// src/services/pdf/react-pdf/components/RecapPageContent.tsx

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState, Travail } from '@/types'; // Assure-toi d'importer Travail
import { getPdfStyles } from '../utils/pdfStyleUtils';
// Importe tes fonctions de formatage (assure-toi que le chemin est bon)
import { formatPrice } from '@/services/pdf/utils/formatUtils'; // Exemple de chemin

// --- Logique de Calcul des Totaux ---
const calculateTotals = (travaux: Travail[] = []) => { // Ajoute une valeur par défaut pour travaux
  let totalHT = 0;
  let totalTVA = 0;

  travaux.forEach(t => {
    // Vérifie que les valeurs sont des nombres avant le calcul
    const qte = typeof t.quantite === 'number' ? t.quantite : 0;
    const fourn = typeof t.prixFournitures === 'number' ? t.prixFournitures : 0;
    const mo = typeof t.prixMainOeuvre === 'number' ? t.prixMainOeuvre : 0;
    const tvaRate = typeof t.tauxTVA === 'number' ? t.tauxTVA : 0;
    
    const itemTotalHT = (fourn + mo) * qte;
    totalHT += itemTotalHT;
    totalTVA += (itemTotalHT * tvaRate) / 100;
  });

  const totalTTC = totalHT + totalTVA;
  // Retourne des valeurs formatées ou non, selon préférence. Ici, non formatées.
  return { totalHT, totalTVA, totalTTC }; 
};
// --- Fin Logique de Calcul ---


interface RecapPageContentProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const RecapPageContent = ({ pdfSettings, projectState }: RecapPageContentProps) => {
  // Utilise un tableau vide par défaut si travaux n'existe pas
  const travaux = projectState.travaux || []; 
  const company = projectState.metadata?.company; 

  // Calcul des totaux
  const { totalHT, totalTVA, totalTTC } = calculateTotals(travaux);

  // Récupération des styles
  const titleContainerStyles = getPdfStyles(pdfSettings, 'recap_title', { isContainer: true });
  const titleTextStyles = getPdfStyles(pdfSettings, 'recap_title', { isContainer: false });

  const signatureZoneStyles = getPdfStyles(pdfSettings, 'signature_zone', { isContainer: true });
  const signatureTextStyles = getPdfStyles(pdfSettings, 'signature_text', { isContainer: false });
  const approvalTextStyles = getPdfStyles(pdfSettings, 'approval_text', { isContainer: false });

  const totalsTableStyles = getPdfStyles(pdfSettings, 'totals_table', { isContainer: true });
  const htVatTotalTextStyles = getPdfStyles(pdfSettings, 'ht_vat_totals', { isContainer: false });
  const ttcTotalTextStyles = getPdfStyles(pdfSettings, 'ttc_total', { isContainer: false });
  // Conteneurs pour les lignes de totaux (optionnel, peut utiliser 'default')
  const htVatTotalContainerStyles = getPdfStyles(pdfSettings, 'ht_vat_totals', { isContainer: true });
  const ttcTotalContainerStyles = getPdfStyles(pdfSettings, 'ttc_total', { isContainer: true });

  const salutationContainerStyles = getPdfStyles(pdfSettings, 'salutation_text', { isContainer: true });
  const salutationTextStyles = getPdfStyles(pdfSettings, 'salutation_text', { isContainer: false });

  // Textes fixes (peuvent venir de constantes)
  const signatureContentText = "Cachet et signature du client"; 
  const approvalText = "« Bon pour accord, devis reçu avant exécution des travaux »";
  const salutationText = `Dans l'attente de votre accord, nous vous prions d’agréer, Madame, Monsieur, l’expression de nos salutations distinguées.\n${company?.name || ''}`; 

  return (
    <View> {/* Conteneur global du contenu */}

      {/* 1. Titre Principal */}
      <View style={titleContainerStyles}>
        <Text style={titleTextStyles}>RÉCAPITULATIF</Text>
      </View>
      <View style={{ height: 20 }} /> {/* Espace */}

      {/* 2. Tableau Récapitulatif (Optionnel - À implémenter si nécessaire) */}
      {/* <View> ... Tableau ... </View> */}
      {/* <View style={{ height: 20 }} /> */}


      {/* 3. Zone Signature et Totaux */}
      <View style={styles.columnsContainer}>

        {/* Colonne Gauche: Signature */}
        <View style={[styles.leftColumn, signatureZoneStyles]}>
           <Text style={signatureTextStyles}>
              {signatureContentText} 
           </Text>
           <View style={{ height: 40 }} /> {/* Espace pour signer */}
           <Text style={approvalTextStyles}>
              {approvalText}
           </Text>
           {/* Ligne de signature ? */}
           {/* <View style={styles.signatureLine} /> */}
        </View>

        {/* Colonne Droite: Totaux */}
        <View style={[styles.rightColumn, totalsTableStyles]}>
          {/* Total HT */}
          <View style={[styles.totalRow, htVatTotalContainerStyles]}>
            {/* Applique les styles htVatTotalTextStyles directement */}
            <Text style={htVatTotalTextStyles}>Total HT :</Text>
            <Text style={htVatTotalTextStyles}>{formatPrice(totalHT)}</Text>
          </View>
          {/* Total TVA */}
          <View style={[styles.totalRow, htVatTotalContainerStyles]}>
            <Text style={htVatTotalTextStyles}>Total TVA :</Text>
            <Text style={htVatTotalTextStyles}>{formatPrice(totalTVA)}</Text>
          </View>
           {/* Ligne de séparation */}
           <View style={styles.separator} />
           {/* Total TTC */}
           <View style={[styles.totalRow, ttcTotalContainerStyles]}>
            {/* Applique les styles ttcTotalTextStyles directement */}
            <Text style={ttcTotalTextStyles}>TOTAL TTC :</Text> 
            <Text style={ttcTotalTextStyles}>{formatPrice(totalTTC)}</Text>
           </View>
        </View>

      </View>
      <View style={{ height: 30 }} /> {/* Espace après les colonnes */}

      {/* 4. Texte de Salutation */}
      <View style={salutationContainerStyles}>
         <Text style={salutationTextStyles}>{salutationText}</Text>
      </View>

    </View>
  );
};

// Styles locaux UNIQUEMENT pour le layout
const styles = StyleSheet.create({
  columnsContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  leftColumn: {
    width: '60%', 
    paddingRight: 10, 
  },
  rightColumn: {
    width: '40%',
    paddingLeft: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Garde les labels à gauche, valeurs à droite
    marginBottom: 5, 
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb', // TODO: Rendre cette couleur dynamique via un ID ?
    marginVertical: 5,
  },
  // signatureLine: { // Si tu veux une ligne visuelle
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#333333', 
  //   marginTop: 40,
  // }
});
