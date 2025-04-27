// src/services/pdf/react-pdf/components/RecapPageContent.tsx

import React from 'react';
import { View, Text, StyleSheet, Style } from '@react-pdf/renderer'; // Ajout Style
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState, Room, Travail } from '@/types'; 
import { getPdfStyles } from '../utils/pdfStyleUtils';
// Assure-toi que formatUtils contient la version SIMPLIFIÉE de formatPrice pour l'instant
import { formatPrice, formatQuantity, formatMOFournitures } from '@/services/pdf/utils/formatUtils'; 
import { PDF_TEXTS } from '@/services/pdf/constants/pdfConstants'; 
import { VerticalSpacer } from './common/VerticalSpacer'; 

// --- Logique de Calcul des Totaux ---
// ★★★ CORPS DE LA FONCTION RESTAURÉ ★★★
const calculateTotals = (travaux: Travail[] = []) => { 
  let totalHT = 0;  // Déclaré ici
  let totalTVA = 0; // Déclaré ici

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
// ★★★ FIN DE LA RESTAURATION ★★★
// --- Fin Logique de Calcul ---

// Helper pour obtenir les travaux d'une pièce
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
  
  // Appel de la fonction (maintenant complète) pour obtenir les totaux
  const { totalHT, totalTVA, totalTTC } = calculateTotals(travaux);

  // --- Styles ---
  const titleContainerStyles = getPdfStyles(pdfSettings, 'recap_title', { isContainer: true });
  const titleTextStyles = getPdfStyles(pdfSettings, 'recap_title', { isContainer: false });
  const recapTableContainerStyles = getPdfStyles(pdfSettings, 'recap_table_header', { isContainer: true }); 
  const recapHeaderTextStyles = getPdfStyles(pdfSettings, 'recap_table_header', { isContainer: false }); 
  const recapDesignationStyles = getPdfStyles(pdfSettings, 'recap_designation_column', { isContainer: false }); 
  const recapAmountStyles = getPdfStyles(pdfSettings, 'recap_amount_column', { isContainer: false }); 
  const signatureZoneContainerStyles = getPdfStyles(pdfSettings, 'signature_zone', { isContainer: true });
  const signatureTextStyles = getPdfStyles(pdfSettings, 'signature_text', { isContainer: false });
  const approvalTextStyles = getPdfStyles(pdfSettings, 'approval_text', { isContainer: false });
  const totalsTableContainerStyles = getPdfStyles(pdfSettings, 'totals_table', { isContainer: true });
  const htVatTotalTextStyles = getPdfStyles(pdfSettings, 'ht_vat_totals', { isContainer: false });
  const htVatTotalContainerStyles = getPdfStyles(pdfSettings, 'ht_vat_totals', { isContainer: true });
  const ttcTotalTextStyles = getPdfStyles(pdfSettings, 'ttc_total', { isContainer: false });
  const ttcTotalContainerStyles = getPdfStyles(pdfSettings, 'ttc_total', { isContainer: true });
  const salutationContainerStyles = getPdfStyles(pdfSettings, 'salutation_text', { isContainer: true });
  const salutationTextStyles = getPdfStyles(pdfSettings, 'salutation_text', { isContainer: false });
  // --- Fin Styles ---

  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id, travaux).length > 0);

  return (
    <View> {/* Conteneur global */}

      {/* 1. Titre Principal */}
      <View style={titleContainerStyles}><Text style={titleTextStyles}>RÉCAPITULATIF</Text></View>
      <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_recap_title" defaultHeight={20} />

      {/* 2. Tableau Récapitulatif par Pièce */}
      {roomsWithTravaux.length > 0 && (
          <View style={recapTableContainerStyles}> 
            {/* En-tête */}
            <View style={styles.recapTableHeaderRow}> 
              <View style={styles.recapTableHeaderCellLeft}><Text style={recapHeaderTextStyles}>Désignations</Text></View>
              <View style={styles.recapTableHeaderCellRight}><Text style={[recapHeaderTextStyles, { textAlign: recapAmountStyles.textAlign || 'right' }]}>Montant HT</Text></View>
            </View> 

            {/* Lignes */}
            {roomsWithTravaux.map(room => {
                const travauxPiece = getTravauxForPiece(room.id, travaux);
                let roomTotalHT = 0; 
                travauxPiece.forEach(t => {
                   const qte = typeof t.quantite === 'number' ? t.quantite : 0;
                   const fourn = typeof t.prixFournitures === 'number' ? t.prixFournitures : 0;
                   const mo = typeof t.prixMainOeuvre === 'number' ? t.prixMainOeuvre : 0;
                   roomTotalHT += ((fourn + mo) * qte);
                });
                return (
                    <View key={room.id} style={styles.recapTableRow}> 
                         <View style={styles.recapTableCellLeft}><Text style={recapDesignationStyles}>{room.name}</Text></View>
                         <View style={styles.recapTableCellRight}><Text style={recapAmountStyles}>{formatPrice(roomTotalHT)}</Text></View>
                    </View>
                );
            })}
          </View> 
      )}
      {roomsWithTravaux.length > 0 && (
          <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_recap_table" defaultHeight={20} /> 
      )}


      {/* 3. Zone Signature et Totaux */}
      <View style={styles.columnsContainer}>
        {/* Colonne Gauche: Signature */}
        <View style={[styles.leftColumn, signatureZoneContainerStyles]}>
           <Text style={signatureTextStyles}>{PDF_TEXTS.SIGNATURE.CONTENT}</Text>
           <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_signature_text" defaultHeight={5} /> 
           {PDF_TEXTS.SIGNATURE.POINTS.map((point, index) => (
               <Text key={index} style={[approvalTextStyles, point.bold ? { fontWeight: 'bold' } : {}]}>{point.text}</Text>
           ))}
           <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_approval_text" defaultHeight={40} />
        </View>
        {/* Colonne Droite: Totaux */}
        <View style={[styles.rightColumn, totalsTableContainerStyles]}>
           <View style={[styles.totalRow, htVatTotalContainerStyles]}><Text style={htVatTotalTextStyles}>Total HT :</Text><Text style={htVatTotalTextStyles}>{formatPrice(totalHT)}</Text></View>
           <View style={[styles.totalRow, htVatTotalContainerStyles]}><Text style={htVatTotalTextStyles}>Total TVA :</Text><Text style={htVatTotalTextStyles}>{formatPrice(totalTVA)}</Text></View>
           <View style={styles.separator} />
           <View style={[styles.totalRow, ttcTotalContainerStyles]}><Text style={ttcTotalTextStyles}>TOTAL TTC :</Text><Text style={ttcTotalTextStyles}>{formatPrice(totalTTC)}</Text></View>
        </View>
      </View>
      <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_signature_zone" defaultHeight={30} />

      {/* 4. Texte de Salutation */}
      <View style={salutationContainerStyles}>
         <Text style={salutationTextStyles}> 
           {PDF_TEXTS.SALUTATION} 
         </Text>
      </View>
      
    </View>
  );
};

// Styles locaux UNIQUEMENT pour le layout
const styles = StyleSheet.create({
  columnsContainer: { flexDirection: 'row', width: '100%' },
  leftColumn: { width: '65%', paddingRight: 15 },
  rightColumn: { width: '35%', paddingLeft: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  separator: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 5 },
  // Styles Tableau Récap par Pièce
  recapTableHeaderRow: { 
      flexDirection: 'row', 
      width: '100%', 
      borderBottomWidth: 1, 
      borderColor: '#ccc',   
      marginBottom: 5, 
      paddingBottom: 3 
  },
  recapTableRow: { 
      flexDirection: 'row', 
      width: '100%',
      marginBottom: 2, 
  },
  recapTableHeaderCellLeft: { 
      width: '80%', 
      paddingRight: 5, 
  }, 
  recapTableHeaderCellRight: { 
      width: '20%', 
      textAlign: 'right', 
  }, 
  recapTableCellLeft: { 
      width: '80%',
      paddingRight: 5,
  }, 
  recapTableCellRight: { 
      width: '20%', 
  }, 
});
