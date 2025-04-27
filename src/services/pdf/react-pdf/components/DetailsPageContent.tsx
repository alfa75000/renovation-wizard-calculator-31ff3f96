// src/services/pdf/react-pdf/components/DetailsPageContent.tsx

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState, Room, Travail } from '@/types'; 
import { getPdfStyles } from '../utils/pdfStyleUtils';

// === FONCTIONS DE FORMATAGE ===
const formatPrice = (value: number): string => { return `${(value || 0).toFixed(2)} €`; }; 
const formatQuantity = (quantity: number): string => { return `${(quantity || 0)}`; }; 
const formatMOFournitures = (travail: Travail): string => { 
    if (!travail) return '';
    const mo = formatPrice(travail.prixMainOeuvre || 0);
    const fourn = formatPrice(travail.prixFournitures || 0);
    const tva = travail.tauxTVA || 0;
     return `[ MO: ${mo}/u | Fourn: ${fourn}/u | TVA: ${tva}% ]`; 
};
// ============================

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
  // Styles pour les différentes parties de la description
  const workTypeStyles = getPdfStyles(pdfSettings, 'work_details', { isContainer: false }); // Style pour Type/Sous-type
  const workTypeContainerStyles = getPdfStyles(pdfSettings, 'work_details', { isContainer: true }); 
  const workDescTextStyles = getPdfStyles(pdfSettings, 'work_description_text', { isContainer: false }); // Style pour Description
  const workDescContainerStyles = getPdfStyles(pdfSettings, 'work_description_text', { isContainer: true }); 
  const workPersoTextStyles = getPdfStyles(pdfSettings, 'work_personalization_text', { isContainer: false }); // Style pour Personnalisation
  const workPersoContainerStyles = getPdfStyles(pdfSettings, 'work_personalization_text', { isContainer: true }); 
  const moSuppliesTextStyles = getPdfStyles(pdfSettings, 'mo_supplies', { isContainer: false }); // Renommé pour clarté
  const moSuppliesContainerStyles = getPdfStyles(pdfSettings, 'mo_supplies', { isContainer: true }); 
  // Styles colonnes
  const qtyStyles = getPdfStyles(pdfSettings, 'qty_column', { isContainer: false });
  const priceStyles = getPdfStyles(pdfSettings, 'price_column', { isContainer: false });
  const vatStyles = getPdfStyles(pdfSettings, 'vat_column', { isContainer: false });
  const totalStyles = getPdfStyles(pdfSettings, 'total_column', { isContainer: false });
  // Styles Total Pièce
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
      <View style={[
        titleContainerStyles, 
        { alignSelf: getAlignSelf(titleTextStyles.textAlign) }
      ]}>
        <Text style={titleTextStyles}>DÉTAILS DES TRAVAUX</Text>
      </View>
      <View style={{ height: 15 }} />

      {/* 2. En-tête du Tableau */}
      <View 
        style={[styles.tableHeaderRow, tableHeaderContainerStyles, { backgroundColor: tableHeaderContainerStyles.backgroundColor || lightBackgroundColor }]} 
        fixed
      >
        {/* ... Cellules en-tête comme avant ... */}
        <View style={styles.tableHeaderCellDesc}><Text style={tableHeaderTextStyles}>Description</Text></View>
        <View style={styles.tableHeaderCellQty}><Text style={[tableHeaderTextStyles, qtyStyles.textAlign ? { textAlign: qtyStyles.textAlign } : {}]}>Quantité</Text></View>
        <View style={styles.tableHeaderCellPrice}><Text style={[tableHeaderTextStyles, priceStyles.textAlign ? { textAlign: priceStyles.textAlign } : {}]}>Prix HT Unit.</Text></View>
        <View style={styles.tableHeaderCellVAT}><Text style={[tableHeaderTextStyles, vatStyles.textAlign ? { textAlign: vatStyles.textAlign } : {}]}>TVA</Text></View>
        <View style={styles.tableHeaderCellTotal}><Text style={[tableHeaderTextStyles, totalStyles.textAlign ? { textAlign: totalStyles.textAlign } : {}]}>Total HT</Text></View>
      </View>

      {/* 3. Boucle sur les Pièces */}
      {roomsWithTravaux.map((room) => {
        const travauxPiece = getTravauxForPiece(room.id, travaux);
        let pieceTotalHT = 0; 

        return (
          <React.Fragment key={room.id}>
            {/* Titre de la Pièce */}
            <View style={[
              roomTitleContainerStyles,
              { alignSelf: getAlignSelf(roomTitleTextStyles.textAlign) }
            ]} break>
              <Text style={roomTitleTextStyles}>{room.name}</Text>
            </View>
            <View style={{ height: 5 }} /> 

            {/* Boucle sur les Travaux de la Pièce */}
            {travauxPiece.map((travail, index) => {
              // ... (calculs qte, fourn, mo, tvaRate, prixUnitaireHT, totalHT, pieceTotalHT) ...
               const qte = typeof travail.quantite === 'number' ? travail.quantite : 0;
               const fourn = typeof travail.prixFournitures === 'number' ? travail.prixFournitures : 0;
               const mo = typeof travail.prixMainOeuvre === 'number' ? travail.prixMainOeuvre : 0;
               const tvaRate = typeof travail.tauxTVA === 'number' ? travail.tauxTVA : 0;
               const prixUnitaireHT = fourn + mo;
               const totalHT = prixUnitaireHT * qte;
               pieceTotalHT += totalHT; 

              return (
                // Ligne du tableau pour un travail
                <View key={travail.id || `travail-${index}`} style={styles.tableRow} wrap={false}> 
                  
                  {/* === Cellule Description Refactorisée === */}
                  <View style={styles.tableCellDesc}>
                    {/* Bloc Type/Sous-type */}
                    <View style={workTypeContainerStyles}> 
                      <Text style={workTypeStyles}>
                        {`${travail.typeTravauxLabel || '?'}: ${travail.sousTypeLabel || '?'}`}
                      </Text>
                    </View>
                    
                    {/* Bloc Description (si existe) */}
                    {travail.description && (
                      <>
                        <View style={{height: 2}} /> {/* Petit espace */}
                        <View style={workDescContainerStyles}>
                          <Text style={workDescTextStyles}>
                            {travail.description}
                          </Text>
                        </View>
                      </>
                    )}

                     {/* Bloc Personnalisation (si existe) */}
                     {travail.personnalisation && (
                       <>
                         <View style={{height: 2}} /> {/* Petit espace */}
                         <View style={workPersoContainerStyles}>
                           {/* Applique le style perso + force italic */}
                           <Text style={[workPersoTextStyles, {fontStyle: 'italic'}]}> 
                              {travail.personnalisation}
                           </Text>
                        </View>
                       </>
                     )}

                     {/* Bloc MO/Fournitures */}
                     <View style={{height: 4}} /> {/* Espace avant MO */}
                     <View style={moSuppliesContainerStyles}>
                       <Text style={moSuppliesTextStyles}>
                          {formatMOFournitures(travail)}
                        </Text>
                     </View>
                  </View>
                  {/* === Fin Cellule Description === */}

                  {/* Cellule Quantité */}
                  <View style={styles.tableCellQty}>
                    <Text style={qtyStyles}>{formatQuantity(qte)}</Text>
                    <Text style={qtyStyles}>{travail.unite || ''}</Text>
                  </View>
                  {/* Cellule Prix Unit HT */}
                  <View style={styles.tableCellPrice}>
                    <Text style={priceStyles}>{formatPrice(prixUnitaireHT)}</Text>
                  </View>
                  {/* Cellule TVA */}
                  <View style={styles.tableCellVAT}>
                    <Text style={vatStyles}>{`${tvaRate}%`}</Text>
                  </View>
                  {/* Cellule Total HT */}
                  <View style={styles.tableCellTotal}>
                    <Text style={totalStyles}>{formatPrice(totalHT)}</Text>
                  </View>
                </View>
              );
            })}

            {/* Ligne Total Pièce */}
            <View 
              style={[
                styles.tableFooterRow, 
                roomTotalContainerStyles, 
                { backgroundColor: roomTotalContainerStyles.backgroundColor || lightBackgroundColor }
              ]}
            >
               <View style={styles.tableFooterCellLabel}>
                 <Text style={roomTotalTextStyles}>Total HT {room.name}</Text>
               </View>
               <View style={styles.tableFooterCellTotal}>
                 <Text style={[totalStyles, roomTotalTextStyles.textAlign ? { textAlign: roomTotalTextStyles.textAlign } : {}]}>
                   {formatPrice(pieceTotalHT)}
                 </Text>
               </View>
            </View>
             <View style={{ height: 15 }} /> {/* Espace après chaque pièce */}

          </React.Fragment>
        );
      })}
    </View>
  );
};

// Styles locaux pour la structure du tableau
const styles = StyleSheet.create({
  // ... (styles pour tableHeaderRow, cells, tableFooterRow, cells) ...
   tableHeaderRow: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 4, 
  },
   tableHeaderCellDesc: { width: '50%', paddingHorizontal: 4 }, 
   tableHeaderCellQty: { width: '10%', paddingHorizontal: 4, textAlign: 'center' },
   tableHeaderCellPrice: { width: '15%', paddingHorizontal: 4, textAlign: 'center' },
   tableHeaderCellVAT: { width: '10%', paddingHorizontal: 4, textAlign: 'center' },
   tableHeaderCellTotal: { width: '15%', paddingHorizontal: 4, textAlign: 'center' }, 
   tableRow: {
    flexDirection: 'row',
    // borderBottomWidth: 1, // Supprimé, géré par styles dynamiques
    // borderBottomColor: '#e5e7eb', // Supprimé
    paddingVertical: 4,
    width: '100%',
    alignItems: 'center', // AJOUT : Centrage vertical des cellules
  },
  tableCellDesc: { 
      width: '50%', 
      paddingHorizontal: 4 
      // Le padding/margin/border vient des styles enfants maintenant
  }, 
  tableCellQty: { 
      width: '10%', 
      paddingHorizontal: 4, 
      textAlign: 'center' 
      // display:flex supprimé, alignItems du parent gère le vertical
  },
  tableCellPrice: { 
      width: '15%', 
      paddingHorizontal: 4, 
      textAlign: 'center'
  },
  tableCellVAT: { 
      width: '10%', 
      paddingHorizontal: 4, 
      textAlign: 'center'
  },
  tableCellTotal: { 
      width: '15%', 
      paddingHorizontal: 4, 
      textAlign: 'center'
  },
  tableFooterRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 5,
    paddingVertical: 4, 
  },
  tableFooterCellLabel: { 
     flexGrow: 1, 
     paddingHorizontal: 4 
  }, 
  tableFooterCellTotal: { 
     width: '15%', 
     paddingHorizontal: 4, 
  },
  titleContainer: {}, // Plus besoin de width:'auto'
  roomTitleContainer: { // Plus besoin de width:'auto'
     marginTop: 10, 
  }
});
