// src/services/pdf/react-pdf/components/DetailsPageContent.tsx

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer'; 
import type { Style } from '@react-pdf/types'; 
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState, Room, Travail } from '@/types'; 
import { getPdfStyles } from '../utils/pdfStyleUtils';
import { formatPrice, formatQuantity, formatMOFournitures } from '@/services/pdf/utils/formatUtils'; 
import { PDF_TEXTS } from '@/services/pdf/constants/pdfConstants'; 
import { VerticalSpacer } from './common/VerticalSpacer'; 

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
const getAlignSelf = (textAlign?: Style['textAlign']): 'flex-start' | 'center' | 'flex-end' => { 
  switch (textAlign) {
    case 'center': return 'center';
    case 'right': return 'flex-end';
    default: return 'flex-start';
  }
};
// --- Fin Logique ---

interface DetailsPageContentProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const DetailsPageContent = ({ pdfSettings, projectState }: DetailsPageContentProps) => {
  const rooms = projectState.rooms || [];
  const travaux = projectState.travaux || [];

  // --- Styles ---
  const titleTextStyles = getPdfStyles(pdfSettings, 'detail_title', { isContainer: false });
  const titleContainerStyles = getPdfStyles(pdfSettings, 'detail_title', { isContainer: true });
  const tableHeaderTextStyles = getPdfStyles(pdfSettings, 'detail_table_header', { isContainer: false });
  const tableHeaderContainerStyles = getPdfStyles(pdfSettings, 'detail_table_header', { isContainer: true });
  const roomTitleTextStyles = getPdfStyles(pdfSettings, 'room_title', { isContainer: false });
  const roomTitleContainerStyles = getPdfStyles(pdfSettings, 'room_title', { isContainer: true });
  const workTypeStyles = getPdfStyles(pdfSettings, 'work_details', { isContainer: false }); 
  const workTypeContainerStyles = getPdfStyles(pdfSettings, 'work_details', { isContainer: true }); 
  const workDescTextStyles = getPdfStyles(pdfSettings, 'work_description_text', { isContainer: false }); 
  const workDescContainerStyles = getPdfStyles(pdfSettings, 'work_description_text', { isContainer: true }); 
  const workPersoTextStyles = getPdfStyles(pdfSettings, 'work_personalization_text', { isContainer: false }); 
  const workPersoContainerStyles = getPdfStyles(pdfSettings, 'work_personalization_text', { isContainer: true }); 
  const moSuppliesTextStyles = getPdfStyles(pdfSettings, 'mo_supplies', { isContainer: false }); 
  const moSuppliesContainerStyles = getPdfStyles(pdfSettings, 'mo_supplies', { isContainer: true }); 
  const qtyStyles = getPdfStyles(pdfSettings, 'qty_column', { isContainer: false });
  const priceStyles = getPdfStyles(pdfSettings, 'price_column', { isContainer: false });
  // const vatStyles = getPdfStyles(pdfSettings, 'vat_column', { isContainer: false }); // Supprimé
  const totalStyles = getPdfStyles(pdfSettings, 'total_column', { isContainer: false }); 
  const roomTotalTextStyles = getPdfStyles(pdfSettings, 'room_total', { isContainer: false }); 
  const roomTotalContainerStyles = getPdfStyles(pdfSettings, 'room_total', { isContainer: true });
  // --- Fin Styles ---

  const lightBackgroundColor = pdfSettings?.colors?.background || '#f3f4f6'; 

  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id, travaux).length > 0);

  if (roomsWithTravaux.length === 0) {
    return <View><Text>Aucun travail à afficher dans les détails.</Text></View>;
  }

  return (
    <View>
      {/* 1. Titre Principal */}
      <View style={[titleContainerStyles, { alignSelf: getAlignSelf(titleTextStyles.textAlign) }]}>
        <Text style={titleTextStyles}>DÉTAILS DES TRAVAUX</Text>
      </View>
      <View style={{ height: 15 }} />

      {/* 2. En-tête du Tableau (4 colonnes) */}
      <View 
        style={[
          styles.tableHeaderRow, 
          tableHeaderContainerStyles, 
          { backgroundColor: tableHeaderContainerStyles.backgroundColor || lightBackgroundColor }
        ]} 
        fixed
      >
        {/* Utilise les NOUVELLES largeurs */}
        <View style={styles.tableHeaderCellDesc}><Text style={tableHeaderTextStyles}>Description</Text></View>
        <View style={styles.tableHeaderCellQty}><Text style={[tableHeaderTextStyles, qtyStyles.textAlign ? { textAlign: qtyStyles.textAlign } : {}]}>Quantité</Text></View>
        <View style={styles.tableHeaderCellPrice}><Text style={[tableHeaderTextStyles, priceStyles.textAlign ? { textAlign: priceStyles.textAlign } : {}]}>Prix HT U</Text></View>
        {/* Supprimé : Colonne TVA */}
        <View style={styles.tableHeaderCellTotal}><Text style={[tableHeaderTextStyles, totalStyles.textAlign ? { textAlign: totalStyles.textAlign } : {}]}>Total HT </Text></View>
      </View>

      {/* 3. Boucle sur les Pièces */}
      {roomsWithTravaux.map((room) => {
        const travauxPiece = getTravauxForPiece(room.id, travaux);
        let pieceTotalHT = 0; 

        return (
          <React.Fragment key={room.id}>
            {/* Titre de la Pièce */}
            <View style={[roomTitleContainerStyles, { alignSelf: getAlignSelf(roomTitleTextStyles.textAlign) }]}> 
              <Text style={roomTitleTextStyles}>{room.name}</Text>
            </View>
            <View style={{ height: 5 }} /> 

            {/* Boucle sur les Travaux */}
            {travauxPiece.map((travail, index) => {
               const qte = typeof travail.quantite === 'number' ? travail.quantite : 0;
               const fourn = typeof travail.prixFournitures === 'number' ? travail.prixFournitures : 0;
               const mo = typeof travail.prixMainOeuvre === 'number' ? travail.prixMainOeuvre : 0;
               // tvaRate n'est plus utilisé directement ici, mais gardé pour formatMOFournitures
               const tvaRate = typeof travail.tauxTVA === 'number' ? travail.tauxTVA : 0; 
               const prixUnitaireHT = fourn + mo;
               const totalHT = prixUnitaireHT * qte;
               pieceTotalHT += totalHT; 

              return (
                <View key={travail.id || `travail-${index}`} style={styles.tableRow}> 
                  {/* Cellule Description */}
                  <View style={styles.tableCellDesc}>
                      {/* ... (structure interne description) ... */}
                      <View style={workTypeContainerStyles}><Text style={workTypeStyles}>{`${travail.typeTravauxLabel || '?'}: ${travail.sousTypeLabel || '?'}`}</Text></View>
                      {travail.description && (<><View style={{height: 2}} /><View style={workDescContainerStyles}><Text style={workDescTextStyles}>{travail.description}</Text></View></>)}
                      {travail.personnalisation && (<><View style={{height: 2}} /><View style={workPersoContainerStyles}><Text style={[workPersoTextStyles, {fontStyle: 'italic'}]}>{travail.personnalisation}</Text></View></>)}
                      <View style={{height: 4}} /><View style={moSuppliesContainerStyles}><Text style={moSuppliesTextStyles}>{formatMOFournitures(travail)}</Text></View>
                  </View>
                  {/* Autres Cellules (avec les nouvelles largeurs) */}
                  <View style={styles.tableCellQty}><Text style={qtyStyles}>{formatQuantity(qte)}</Text><Text style={qtyStyles}>{travail.unite || ''}</Text></View>
                  <View style={styles.tableCellPrice}><Text style={priceStyles}>{formatPrice(prixUnitaireHT)}</Text></View>
                  {/* Supprimé : Colonne TVA */}
                  <View style={styles.tableCellTotal}><Text style={totalStyles}>{formatPrice(totalHT)}</Text></View>
                </View>
              );
            })}

            {/* Ligne Total Pièce (avec nouvelles largeurs) */}
            <View 
              style={[
                styles.tableFooterRow, 
                roomTotalContainerStyles, 
                { backgroundColor: roomTotalContainerStyles.backgroundColor || lightBackgroundColor }
              ]}
            >
               {/* Cellule Label Total */}
               <View style={styles.tableFooterCellLabel}> 
                 <Text style={roomTotalTextStyles}>Total HT {room.name}</Text>
               </View>
               {/* Cellule Valeur Total */}
               <View style={styles.tableFooterCellTotal}>
                 <Text style={[
                     {...totalStyles, textAlign: undefined }, 
                     { textAlign: roomTotalTextStyles.textAlign || totalStyles.textAlign } 
                   ]}>
                   {formatPrice(pieceTotalHT)}
                 </Text>
               </View>
            </View>
             <View style={{ height: 15 }} /> 

          </React.Fragment>
        );
      })}
    </View> 
  );
};

// Styles locaux pour la structure du tableau
const styles = StyleSheet.create({
  tableHeaderRow: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 4, 
  },
  // === NOUVELLES Largeurs Colonnes Header  ===
  tableHeaderCellDesc: { width: '67%', paddingHorizontal: 4 }, 
  tableHeaderCellQty: { width: '8%', paddingHorizontal: 4, textAlign: 'center' },
  tableHeaderCellPrice: { width: '12%', paddingHorizontal: 4, textAlign: 'center' },
  // tableHeaderCellVAT: { width: '6%', paddingHorizontal: 4, textAlign: 'center' }, // Supprimé
  tableHeaderCellTotal: { width: '13%', paddingHorizontal: 4, textAlign: 'center' }, // 70+6+12+13 = 101% -> Ajustons Desc à 69%

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    width: '100%',
    alignItems: 'center', 
  },
  // === NOUVELLES Largeurs Colonnes Cellules (70-6-12-13) ===
  tableCellDesc: { width: '70%', paddingHorizontal: 4 }, 
  tableCellQty: { width: '6%', paddingHorizontal: 4, textAlign: 'center' },
  tableCellPrice: { width: '12%', paddingHorizontal: 4, textAlign: 'center'}, 
  // tableCellVAT: { width: '6%', paddingHorizontal: 4, textAlign: 'center'}, // Supprimé
  tableCellTotal: { width: '13%', paddingHorizontal: 4, textAlign: 'center'}, 

  tableFooterRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 5,
    paddingVertical: 4, 
    alignItems: 'center', 
  },
  // === NOUVELLES Largeurs Total Pièce  ===
  tableFooterCellLabel: { width: '85%', paddingHorizontal: 4 }, 
  tableFooterCellTotal: { width: '15%', paddingHorizontal: 4 }, // Correspond à la colonne Total HT
  // =====================================
});
