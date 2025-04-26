// src/services/pdf/react-pdf/components/RecapPageContent.tsx

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState, Travail } from '@/types'; // Importe Travail
import { getPdfStyles } from '../utils/pdfStyleUtils';
// Importe tes fonctions de formatage
import { formatPrice } from '@/services/pdf/utils/formatUtils'; // Ou chemin réel

// --- Logique de Calcul des Totaux ---
// NOTE : Cette logique devrait idéalement être dans un hook ou un service dédié
// et passée en props, mais on la met ici pour l'exemple.
const calculateTotals = (travaux: Travail[]) => {
  let totalHT = 0;
  let totalTVA = 0;

  travaux.forEach(t => {
    const itemTotalHT = (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
    totalHT += itemTotalHT;
    totalTVA += (itemTotalHT * t.tauxTVA) / 100;
  });

  const totalTTC = totalHT + totalTVA;
  return { totalHT, totalTVA, totalTTC };
};
// --- Fin Logique de Calcul ---


interface RecapPageContentProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const RecapPageContent = ({ pdfSettings, projectState }: RecapPageContentProps) => {
  const { travaux } = projectState; // Récupère les travaux
  const company = projectState.metadata?.company; // Pour la zone signature

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
  // Note: On pourrait aussi styler les conteneurs des lignes HT/TVA/TTC

  const salutationContainerStyles = getPdfStyles(pdfSettings, 'salutation_text', { isContainer: true });
  const salutationTextStyles = getPdfStyles(pdfSettings, 'salutation_text', { isContainer: false });


  // Textes fixes (peuvent venir de constantes)
  const signatureContentText = "Cachet et signature du client"; // Exemple
  const approvalText = "« Bon pour accord, devis reçu avant exécution des travaux »";
  const salutationText = `Dans l'attente de votre accord, nous vous prions d’agréer, Madame, Monsieur, l’expression de nos salutations distinguées.\n${company?.name || ''}`; // Exemple


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
              {/* Ajoute ici d'autres textes si besoin */}
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
          <View style={styles.totalRow}>
            <Text style={htVatTotalTextStyles}>Total HT :</Text>
            <Text style={[htVatTotalTextStyles, styles.totalValue]}>{formatPrice(totalHT)}</Text>
          </View>
          {/* Total TVA */}
          <View style={styles.totalRow}>
            <Text style={htVatTotalTextStyles}>Total TVA :</Text>
            <Text style={[htVatTotalTextStyles, styles.totalValue]}>{formatPrice(totalTVA)}</Text>
          </View>
           {/* Ligne de séparation (ou bordure sur la vue TTC) */}
           <View style={styles.separator} />
           {/* Total TTC */}
           <View style={styles.totalRow}>
            <Text style={[ttcTotalTextStyles, styles.ttcLabel]}>TOTAL TTC :</Text>
            <Text style={[ttcTotalTextStyles, styles.totalValue, styles.ttcValue]}>{formatPrice(totalTTC)}</Text>
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

// Styles locaux pour le layout spécifique de cette page
const styles = StyleSheet.create({
  columnsContainer: {
    flexDirection: 'row',
    width: '100%',
    // Ajuste l'espace entre les colonnes si nécessaire
    // columnGap: 20 
  },
  leftColumn: {
    width: '60%', // Ajuste la largeur
    paddingRight: 10, // Espace entre les colonnes
    // Applique ici les styles de conteneur pour 'signature_zone'
  },
  rightColumn: {
    width: '40%', // Ajuste la largeur
    paddingLeft: 10, // Espace entre les colonnes
    // Applique ici les styles de conteneur pour 'totals_table'
    // Peut avoir une bordure ou un fond via les styles dynamiques
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5, // Espace entre les lignes de total
  },
  totalValue: {
    // Assure-toi que les styles dynamiques peuvent surcharger ça si besoin
    // fontWeight: 'bold', // Peut venir des styles dynamiques
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb', // Ou utilise une couleur dynamique ?
    marginVertical: 5,
  },
  ttcLabel: {
    //fontWeight: 'bold', // Vient de ttcTotalTextStyles
  },
  ttcValue: {
    //fontWeight: 'bold', // Vient de ttcTotalTextStyles
  }
  // signatureLine: {
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#333333',
  //   marginTop: 40,
  // }
});
