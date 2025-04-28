// src/services/pdf/react-pdf/components/RecapPageContent.tsx

import React from 'react';
import { View, Text, StyleSheet, Style } from '@react-pdf/renderer'; 
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState, Room, Travail } from '@/types'; 
import { getPdfStyles } from '../utils/pdfStyleUtils';
// Assure-toi que formatUtils contient la version de formatPrice avec toLocaleString et le fix
import { formatPrice, formatQuantity, formatMOFournitures } from '@/services/pdf/utils/formatUtils'; 
import { PDF_TEXTS } from '@/services/pdf/constants/pdfConstants'; 
import { VerticalSpacer } from './common/VerticalSpacer'; 

// --- Logique de Calcul & Helpers ---
const calculateTotals = (travaux: Travail[] = []) => { 
  let totalHT = 0;  
  let totalTVA = 0; 
  // ... (logique de calcul inchangée) ...
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
  // Styles En-tête Tableau Récap
  const recapHeaderContainerStyles = getPdfStyles(pdfSettings, 'recap_table_header', { isContainer: true }); // Pour le CONTENEUR de l'en-tête
  const recapHeaderTextStyles = getPdfStyles(pdfSettings, 'recap_table_header', { isContainer: false }); // Pour le TEXTE de l'en-tête
  // Styles Lignes Tableau Récap
  const recapDesignationStyles = getPdfStyles(pdfSettings, 'recap_designation_column', { isContainer: false }); 
  const recapAmountStyles = getPdfStyles(pdfSettings, 'recap_amount_column', { isContainer: false }); 
  // Styles Signature/Totaux/Salutation
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

  // Couleur de fond claire (utilisée si pas de fillColor spécifique)
  const lightBackgroundColor = pdfSettings?.colors?.background || '#f9fafb'; // Fallback différent pour le total pièce

  return (
    <View> {/* Conteneur global */}

      {/* 1. Titre Principal */}
      <View style={titleContainerStyles}><Text style={titleTextStyles}>RÉCAPITULATIF</Text></View>
      <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_recap_title" defaultHeight={20} />

      {/* 2. Tableau Récapitulatif par Pièce */}
      {roomsWithTravaux.length > 0 && (
          // NOTE: Pas de <View> conteneur global pour le tableau ici,
          // l'en-tête et les lignes sont séparés.
          <>
            {/* === En-tête du Tableau Récap (Séparé) === */}
            {/* Applique les styles de CONTENEUR (fond, padding, bordures) à cette ligne */}
            <View style={[styles.recapTableHeaderRow, recapHeaderContainerStyles]}> 
              <View style={styles.recapTableHeaderCellLeft}>
                {/* Applique les styles TEXTE de l'en-tête */}
                <Text style={recapHeaderTextStyles}>Désignations</Text> 
              </View>
              <View style={styles.recapTableHeaderCellRight}>
                 {/* Applique styles texte en-tête + surcharge alignement par colonne montant */}
                 <Text style={[recapHeaderTextStyles, { textAlign: recapAmountStyles.textAlign || 'right' }]}> 
                    Montant HT
                 </Text>
              </View>
            </View> 

            {/* === Lignes du Tableau Récap === */}
            {/* Pas de conteneur global stylé ici */}
            {roomsWithTravaux.map(room => {
                const travauxPiece = getTravauxForPiece(room.id, travaux);
                let roomTotalHT = 0; 
                travauxPiece.forEach(t => { /* ... calcul roomTotalHT ... */ roomTotalHT += ((t.prixFournitures || 0) + (t.prixMainOeuvre || 0)) * (t.quantite || 0); });
                
                // Récupère les styles de conteneur pour la ligne (optionnel, peut utiliser 'default')
                // const rowContainerStyles = getPdfStyles(pdfSettings, 'recap_table_row', {isContainer: true}); // Si tu crées cet ID

                return (
                    // Applique le style de layout local pour la ligne
                    <View key={room.id} style={styles.recapTableRow} /* style={rowContainerStyles} */ > 
                         {/* Cellule Désignation */}
                         <View style={styles.recapTableCellLeft}>
                            {/* Applique style texte colonne désignation */}
                            <Text style={recapDesignationStyles}>{room.name}</Text> 
                         </View>
                         {/* Cellule Montant HT */}
                         <View style={styles.recapTableCellRight}>
                             {/* Applique style texte colonne montant */}
                             <Text style={recapAmountStyles}>{formatPrice(roomTotalHT)}</Text> 
                         </View>
                    </View>
                );
            })}
          </> // Fin Fragment Tableau Récap
      )}
      {/* Espace après le tableau */}
      {roomsWithTravaux.length > 0 && (
          <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_recap_table" defaultHeight={20} /> 
      )}


      {/* 3. Zone Signature et Totaux */}
      <View style={styles.columnsContainer}>
        {/* Colonne Gauche */}
        <View style={[styles.leftColumn, signatureZoneContainerStyles]}>
           <Text style={signatureTextStyles}>{PDF_TEXTS.SIGNATURE.CONTENT}</Text>
           <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_signature_text" defaultHeight={5} /> 
           {PDF_TEXTS.SIGNATURE.POINTS.map((point, index) => (<Text key={index} style={[approvalTextStyles, point.bold ? { fontWeight: 'bold' } : {}]}>{point.text}</Text>))}
           <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_approval_text" defaultHeight={40} />
        </View>
        {/* Colonne Droite */}
        <View style={[styles.rightColumn, totalsTableContainerStyles]}>
           {/* Ligne Total HT */}
           {/* Applique styles conteneur + styles texte */}
           <View style={[styles.totalRow, htVatTotalContainerStyles]}><Text style={htVatTotalTextStyles}>Total HT :</Text><Text style={htVatTotalTextStyles}>{formatPrice(totalHT)}</Text></View>
           {/* Ligne Total TVA */}
           <View style={[styles.totalRow, htVatTotalContainerStyles]}><Text style={htVatTotalTextStyles}>Total TVA :</Text><Text style={htVatTotalTextStyles}>{formatPrice(totalTVA)}</Text></View>
           
           {/* === Séparateur (Maintenant contrôlé par les bordures) === */}
           {/* Supprimé : <View style={styles.separator} /> */}
           {/* Pour avoir une ligne ici, configure borderBottom pour ht_vat_totals */}
           {/* OU borderTop pour ttc_total dans tes paramètres PDF */}
           
           {/* Ligne Total TTC */}
            {/* Applique styles conteneur + styles texte */}
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
  // === Séparateur Supprimé ===
  // separator: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 5 },
  
  // Styles Tableau Récap par Pièce
  recapTableHeaderRow: { 
      flexDirection: 'row', 
      width: '100%', 
      // borderBottomWidth/Color supprimés -> viennent de recapHeaderContainerStyles
      marginBottom: 2, // Espace réduit entre en-tête et première ligne
      paddingBottom: 3, // Padding local si besoin en plus du dynamique
  },
  recapTableRow: { 
      flexDirection: 'row', 
      width: '100%',
      marginBottom: 2, 
      // Pas de bordure par défaut
  },
  recapTableHeaderCellLeft: { width: '80%', paddingRight: 5 }, 
  recapTableHeaderCellRight: { width: '20%', textAlign: 'right' }, // Garde pour fallback si recapAmountStyles n'a pas d'alignement
  recapTableCellLeft: { width: '80%', paddingRight: 5 }, 
  recapTableCellRight: { width: '20%' }, 
});
