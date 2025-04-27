// src/services/pdf/react-pdf/components/RecapPageContent.tsx

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState, Room, Travail } from '@/types'; 
import { getPdfStyles } from '../utils/pdfStyleUtils';
import { formatPrice } from '@/services/pdf/utils/formatUtils'; 
import { PDF_TEXTS } from '@/services/pdf/constants/pdfConstants'; 
// Importe le nouveau composant d'espacement
import { VerticalSpacer } from './common/VerticalSpacer'; // Ajuste le chemin si nécessaire

// --- Logique de Calcul & Helpers ---
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
const getTravauxForPiece = (pieceId: string, allTravaux: Travail[] = []): Travail[] => { 
  return allTravaux.filter(t => t.pieceId === pieceId);
};
// --- Fin Logique ---

interface RecapPageContentProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const RecapPageContent = ({ pdfSettings, projectState }: RecapPageContentProps) => {
  const { rooms = [], travaux = [], metadata } = projectState; 
  const company = metadata?.company; 
  const { totalHT, totalTVA, totalTTC } = calculateTotals(travaux);

  // --- Styles ---
  const titleContainerStyles = getPdfStyles(pdfSettings, 'recap_title', { isContainer: true });
  const titleTextStyles = getPdfStyles(pdfSettings, 'recap_title', { isContainer: false });
  const recapTableHeaderStyles = getPdfStyles(pdfSettings, 'recap_table_header', { isContainer: false });
  const recapTableContainerStyles = getPdfStyles(pdfSettings, 'recap_table_header', { isContainer: true }); 
  const roomTitleRecapStyles = getPdfStyles(pdfSettings, 'room_title', { isContainer: false }); 
  const totalColumnRecapStyles = getPdfStyles(pdfSettings, 'total_column', { isContainer: false }); 
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
      {/* Utilise VerticalSpacer */}
      <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_recap_title" defaultHeight={20} />

      {/* 2. Tableau Récapitulatif par Pièce */}
      {roomsWithTravaux.length > 0 && (
          <View style={recapTableContainerStyles}> 
            <View style={styles.recapTableHeaderRow}> 
               <View style={styles.recapTableHeaderCellLeft}><Text style={recapTableHeaderStyles}>Pièce</Text></View>
               <View style={styles.recapTableHeaderCellRight}><Text style={recapTableHeaderStyles}>Montant HT</Text></View>
            </View>
            {roomsWithTravaux.map(room => {
                const travauxPiece = getTravauxForPiece(room.id, travaux);
                const roomTotalHT = travauxPiece.reduce((sum, t) => { /* ... calcul ... */ return sum + ((t.prixFournitures || 0) + (t.prixMainOeuvre || 0)) * (t.quantite || 0); }, 0);
                return (
                    <View key={room.id} style={styles.recapTableRow}>
                         <View style={styles.recapTableCellLeft}><Text style={roomTitleRecapStyles}>{room.name}</Text></View>
                         <View style={styles.recapTableCellRight}><Text style={totalColumnRecapStyles}>{formatPrice(roomTotalHT)}</Text></View>
                    </View>
                );
            })}
          </View>
      )}
      {/* Utilise VerticalSpacer */}
      {/* Affiche cet espace seulement si le tableau récap est affiché */}
      {roomsWithTravaux.length > 0 && (
          <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_recap_table" defaultHeight={20} /> 
      )}


      {/* 3. Zone Signature et Totaux */}
      <View style={styles.columnsContainer}>
        {/* Colonne Gauche: Signature */}
        <View style={[styles.leftColumn, signatureZoneContainerStyles]}>
           <Text style={signatureTextStyles}>{PDF_TEXTS.SIGNATURE.CONTENT}</Text>
            {/* Utilise VerticalSpacer ici */}
           <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_signature_text" defaultHeight={5} /> 
           {PDF_TEXTS.SIGNATURE.POINTS.map((point, index) => (
               <Text key={index} style={[approvalTextStyles, point.bold ? { fontWeight: 'bold' } : {}]}>
                   {point.text}
               </Text>
           ))}
           {/* Utilise VerticalSpacer pour l'espace signature */}
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
       {/* Utilise VerticalSpacer */}
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
  recapTableHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 5, paddingBottom: 3 },
  recapTableRow: { flexDirection: 'row', marginBottom: 2 },
  recapTableHeaderCellLeft: { width: '70%', fontWeight: 'bold', paddingRight: 5 }, 
  recapTableHeaderCellRight: { width: '30%', textAlign: 'right', fontWeight: 'bold' }, 
  recapTableCellLeft: { width: '70%', paddingRight: 5 }, 
  recapTableCellRight: { width: '30%', textAlign: 'right' }, 
});