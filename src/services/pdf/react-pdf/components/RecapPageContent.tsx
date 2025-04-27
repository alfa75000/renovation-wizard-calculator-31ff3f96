// src/services/pdf/react-pdf/components/RecapPageContent.tsx

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState, Room, Travail } from '@/types'; 
import { getPdfStyles } from '../utils/pdfStyleUtils';
import { formatPrice } from '@/services/pdf/utils/formatUtils'; 
import { PDF_TEXTS } from '@/services/pdf/constants/pdfConstants'; 
import { VerticalSpacer } from './common/VerticalSpacer'; // Assure-toi que ce chemin est correct

// --- Logique de Calcul & Helpers ---
const calculateTotals = (travaux: Travail[] = []) => { /* ... */ return { totalHT, totalTVA, totalTTC }; };
const getTravauxForPiece = (pieceId: string, allTravaux: Travail[] = []): Travail[] => { /* ... */ return allTravaux.filter(t => t.pieceId === pieceId); };
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
  // Styles Tableau Récap
  const recapTableContainerStyles = getPdfStyles(pdfSettings, 'recap_table_header', { isContainer: true }); // Style Conteneur pour TOUT le tableau récap
  const recapHeaderTextStyles = getPdfStyles(pdfSettings, 'recap_table_header', { isContainer: false }); // Style Texte pour l'en-tête
  // NOUVEAUX Styles pour les colonnes
  const recapDesignationStyles = getPdfStyles(pdfSettings, 'recap_designation_column', { isContainer: false }); 
  const recapAmountStyles = getPdfStyles(pdfSettings, 'recap_amount_column', { isContainer: false }); 
  // Styles Signature/Totaux/Salutation (inchangés)
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
          // Le conteneur global du tableau peut avoir ses propres styles (bordure, fond...)
          <View style={recapTableContainerStyles}> 
            {/* En-tête du Tableau Récap (Séparé) */}
            {/* Applique les styles de l'ID recap_table_header */}
            <View style={styles.recapTableHeaderRow}> 
              {/* Cellule Désignations (80%) */}
              <View style={styles.recapTableHeaderCellLeft}>
                 {/* Utilise le style texte de l'en-tête */}
                <Text style={recapHeaderTextStyles}>Désignations</Text> 
              </View>
              {/* Cellule Montant HT (20%) */}
              <View style={styles.recapTableHeaderCellRight}>
                 {/* Utilise le style texte de l'en-tête ET l'alignement de la colonne montant */}
                 <Text style={[recapHeaderTextStyles, { textAlign: recapAmountStyles.textAlign || 'right' }]}> 
                    Montant HT
                 </Text>
              </View>
            </View> 

            {/* Lignes du Tableau Récap */}
            {roomsWithTravaux.map(room => {
                const travauxPiece = getTravauxForPiece(room.id, travaux);
                const roomTotalHT = travauxPiece.reduce((sum, t) => { /* ... calcul ... */ return sum + ((t.prixFournitures || 0) + (t.prixMainOeuvre || 0)) * (t.quantite || 0); }, 0);
                return (
                    // Applique les styles de la ligne (peut être stylé via 'default' ou un ID spécifique)
                    <View key={room.id} style={styles.recapTableRow}> 
                         {/* Cellule Désignation (80%) */}
                         <View style={styles.recapTableCellLeft}>
                            {/* Utilise le style texte de la colonne désignation */}
                            <Text style={recapDesignationStyles}>{room.name}</Text> 
                         </View>
                         {/* Cellule Montant HT (20%) */}
                         <View style={styles.recapTableCellRight}>
                             {/* Utilise le style texte de la colonne montant */}
                             <Text style={recapAmountStyles}>{formatPrice(roomTotalHT)}</Text> 
                         </View>
                    </View>
                );
            })}
          </View> // Fin conteneur tableau récap
      )}
      {/* Affiche l'espace seulement si le tableau est affiché */}
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
           {/* ... (Lignes Total HT, TVA, Séparateur, TTC comme avant) ... */}
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
  // Styles Colonnes Signature/Totaux (inchangés)
  columnsContainer: { flexDirection: 'row', width: '100%' },
  leftColumn: { width: '65%', paddingRight: 15 },
  rightColumn: { width: '35%', paddingLeft: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  separator: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 5 },
  
  // Styles Tableau Récap par Pièce
  recapTableHeaderRow: { 
      flexDirection: 'row', 
      width: '100%', 
      // La bordure/fond/padding vient de recapTableContainerStyles appliqué au <View> parent
      // Mais on peut garder un padding local pour l'en-tête si on veut
      paddingBottom: 3,
      marginBottom: 2, // Espace entre en-tête et première ligne
      borderBottomWidth: 1, // Ligne fixe sous l'en-tête si besoin (sinon via border.bottom de recap_table_header)
      borderBottomColor: '#ccc', 
  },
  recapTableRow: { 
      flexDirection: 'row', 
      width: '100%',
      marginBottom: 2, 
      // Pas de bordure par défaut ici, peut venir des styles des colonnes
  },
  // Cellules En-tête (80% / 20%)
  recapTableHeaderCellLeft: { 
      width: '80%', 
      paddingRight: 5, 
      // Le textAlign vient du <Text> enfant
  }, 
  recapTableHeaderCellRight: { 
      width: '20%', 
      // Le textAlign vient du <Text> enfant
  }, 
  // Cellules Données (80% / 20%)
  recapTableCellLeft: { 
      width: '80%',
      paddingRight: 5,
      // Le textAlign vient de recapDesignationStyles appliqué au <Text>
  }, 
  recapTableCellRight: { 
      width: '20%', 
      // Le textAlign vient de recapAmountStyles appliqué au <Text>
  }, 
});
