// src/services/pdf/react-pdf/components/RecapPageContent.tsx

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState, Room, Travail } from '@/types'; 
import { getPdfStyles } from '../utils/pdfStyleUtils';
// Importe les fonctions de formatage
import { formatPrice } from '@/services/pdf/utils/formatUtils'; 
// Importe les constantes de texte
import { PDF_TEXTS } from '@/services/pdf/constants/pdfConstants'; 

// --- Logique de Calcul des Totaux ---
const calculateTotals = (travaux: Travail[] = []) => { 
  let totalHT = 0;
  let totalTVA = 0;
  travaux.forEach(t => {
    const qte = typeof t.quantite === 'number' ? t.quantite : 0;
    const fourn = typeof t.prixFournitures === 'number' ? t.prixFournitures : 0;
    const mo = typeof t.prixMainOeuvre === 'number' ? t.prixMainOeuvre : 0;
    const tvaRate = typeof t.tauxTVA === 'number' ? t.tauxTVA : 0;    
    const itemTotalHT = (fourn + mo) * qte;
    totalHT += itemTotalHT;
    totalTVA += (itemTotalHT * tvaRate) / 100;
  });
  const totalTTC = totalHT + totalTVA;
  return { totalHT, totalTVA, totalTTC }; 
};
// --- Fin Logique de Calcul ---

// Helper pour obtenir les travaux d'une pièce (si besoin pour tableau récap)
const getTravauxForPiece = (pieceId: string, allTravaux: Travail[] = []): Travail[] => { 
  return allTravaux.filter(t => t.pieceId === pieceId);
};

interface RecapPageContentProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const RecapPageContent = ({ pdfSettings, projectState }: RecapPageContentProps) => {
  const { rooms = [], travaux = [], metadata } = projectState; 
  const company = metadata?.company; 

  // Calcul des totaux globaux
  const { totalHT, totalTVA, totalTTC } = calculateTotals(travaux);

  // Récupération des styles
  const titleContainerStyles = getPdfStyles(pdfSettings, 'recap_title', { isContainer: true });
  const titleTextStyles = getPdfStyles(pdfSettings, 'recap_title', { isContainer: false });

  // Styles pour le tableau récap par pièce (si implémenté)
  const recapTableHeaderStyles = getPdfStyles(pdfSettings, 'recap_table_header', { isContainer: false });
  // const roomTitleRecapStyles = getPdfStyles(pdfSettings, 'room_title', { isContainer: false }); // Peut réutiliser room_title
  // const totalColumnRecapStyles = getPdfStyles(pdfSettings, 'total_column', { isContainer: false }); // Peut réutiliser total_column

  // Styles Zone Signature
  const signatureZoneContainerStyles = getPdfStyles(pdfSettings, 'signature_zone', { isContainer: true });
  const signatureTextStyles = getPdfStyles(pdfSettings, 'signature_text', { isContainer: false });
  const approvalTextStyles = getPdfStyles(pdfSettings, 'approval_text', { isContainer: false });

  // Styles Zone Totaux
  const totalsTableContainerStyles = getPdfStyles(pdfSettings, 'totals_table', { isContainer: true });
  const htVatTotalTextStyles = getPdfStyles(pdfSettings, 'ht_vat_totals', { isContainer: false });
  const htVatTotalContainerStyles = getPdfStyles(pdfSettings, 'ht_vat_totals', { isContainer: true }); // Pour styler les lignes HT/TVA
  const ttcTotalTextStyles = getPdfStyles(pdfSettings, 'ttc_total', { isContainer: false });
  const ttcTotalContainerStyles = getPdfStyles(pdfSettings, 'ttc_total', { isContainer: true }); // Pour styler la ligne TTC

  // Styles Salutation
  const salutationContainerStyles = getPdfStyles(pdfSettings, 'salutation_text', { isContainer: true });
  const salutationTextStyles = getPdfStyles(pdfSettings, 'salutation_text', { isContainer: false });

  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id, travaux).length > 0);

  return (
    <View> {/* Conteneur global du contenu */}

      {/* 1. Titre Principal */}
      <View style={titleContainerStyles}>
        <Text style={titleTextStyles}>RÉCAPITULATIF</Text>
      </View>
      <View style={{ height: 20 }} /> 

      {/* 2. Tableau Récapitulatif par Pièce (Optionnel) */}
      {/* Si tu veux ce tableau, décommente et adapte cette section */}
      {/* 
      <View> 
        <View style={styles.recapTableHeaderRow}> 
           <Text style={[recapTableHeaderStyles, styles.recapTableHeaderCellLeft]}>Pièce</Text>
           <Text style={[recapTableHeaderStyles, styles.recapTableHeaderCellRight]}>Montant HT</Text>
        </View>
        {roomsWithTravaux.map(room => {
            const travauxPiece = getTravauxForPiece(room.id, travaux);
            const roomTotalHT = travauxPiece.reduce((sum, t) => sum + ((t.prixFournitures || 0) + (t.prixMainOeuvre || 0)) * (t.quantite || 0), 0);
            return (
                <View key={room.id} style={styles.recapTableRow}>
                     <Text style={[styles.recapTableCellLeft, roomTitleRecapStyles]}>{room.name}</Text>
                     <Text style={[styles.recapTableCellRight, totalColumnRecapStyles]}>{formatPrice(roomTotalHT)}</Text>
                </View>
            );
        })}
      </View>
      <View style={{ height: 20 }} /> 
      */}


      {/* 3. Zone Signature et Totaux */}
      <View style={styles.columnsContainer}>

        {/* Colonne Gauche: Signature */}
        <View style={[styles.leftColumn, signatureZoneContainerStyles]}>
           <Text style={signatureTextStyles}>
              {PDF_TEXTS.SIGNATURE.CONTENT} 
           </Text>
           {PDF_TEXTS.SIGNATURE.POINTS.map((point, index) => (
               // Utilise le style approval_text pour ces lignes
               <Text key={index} style={[approvalTextStyles, point.bold ? { fontWeight: 'bold' } : {}]}>
                   {point.text}
               </Text>
           ))}
           <View style={{ height: 40 }} /> {/* Espace pour signer */}
           {/* Tu pourrais ajouter une ligne ici si tu veux */}
           {/* <View style={styles.signatureLine} /> */}
        </View>

        {/* Colonne Droite: Totaux */}
        <View style={[styles.rightColumn, totalsTableContainerStyles]}>
          {/* Ligne Total HT */}
          <View style={[styles.totalRow, htVatTotalContainerStyles]}>
            <Text style={htVatTotalTextStyles}>Total HT :</Text>
            <Text style={htVatTotalTextStyles}>{formatPrice(totalHT)}</Text>
          </View>
          {/* Ligne Total TVA */}
          <View style={[styles.totalRow, htVatTotalContainerStyles]}>
            <Text style={htVatTotalTextStyles}>Total TVA :</Text>
            <Text style={htVatTotalTextStyles}>{formatPrice(totalTVA)}</Text>
          </View>
           {/* Ligne de séparation (peut être gérée par bordures sur ttcTotalContainerStyles) */}
           <View style={styles.separator} />
           {/* Ligne Total TTC */}
           <View style={[styles.totalRow, ttcTotalContainerStyles]}>
            <Text style={ttcTotalTextStyles}>TOTAL TTC :</Text> 
            <Text style={ttcTotalTextStyles}>{formatPrice(totalTTC)}</Text>
           </View>
        </View>

      </View>
      <View style={{ height: 30 }} /> 


      {/* 4. Texte de Salutation */}
      <View style={salutationContainerStyles}>
         {/* Assure-toi que le texte peut faire des retours à la ligne si besoin */}
         <Text style={salutationTextStyles}> 
           {`Dans l'attente de votre accord, nous vous prions d’agréer, Madame, Monsieur, l’expression de nos salutations distinguées.\n${company?.name || ''}`}
         </Text>
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
    width: '65%', // Ajuste si besoin
    paddingRight: 15, 
  },
  rightColumn: {
    width: '35%', // Ajuste si besoin
    paddingLeft: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    marginBottom: 5, // Ajuste si besoin 
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb', // Pourrait venir des styles totalsTableStyles.borderColor ?
    marginVertical: 5,
  },
  // Styles pour le tableau récap par pièce (si activé)
  recapTableHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 5, paddingBottom: 3 },
  recapTableRow: { flexDirection: 'row', marginBottom: 2 },
  recapTableHeaderCellLeft: { width: '70%', fontWeight: 'bold' }, // Exemple
  recapTableHeaderCellRight: { width: '30%', textAlign: 'right', fontWeight: 'bold' }, // Exemple
  recapTableCellLeft: { width: '70%' }, // Exemple
  recapTableCellRight: { width: '30%', textAlign: 'right' }, // Exemple
});