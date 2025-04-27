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
  
  // En-tête Tableau
  const tableHeaderTextStyles = getPdfStyles(pdfSettings, 'detail_table_header', { isContainer: false });
  const tableHeaderContainerStyles = getPdfStyles(pdfSettings, 'detail_table_header', { isContainer: true });
  
  const roomTitleTextStyles = getPdfStyles(pdfSettings, 'room_title', { isContainer: false });
  const roomTitleContainerStyles = getPdfStyles(pdfSettings, 'room_title', { isContainer: true });
  const workDetailsStyles = getPdfStyles(pdfSettings, 'work_details', { isContainer: false });
  const moSuppliesStyles = getPdfStyles(pdfSettings, 'mo_supplies', { isContainer: false });
  const qtyStyles = getPdfStyles(pdfSettings, 'qty_column', { isContainer: false });
  const priceStyles = getPdfStyles(pdfSettings, 'price_column', { isContainer: false });
  const vatStyles = getPdfStyles(pdfSettings, 'vat_column', { isContainer: false });
  const totalStyles = getPdfStyles(pdfSettings, 'total_column', { isContainer: false });

  // Total Pièce
  const roomTotalTextStyles = getPdfStyles(pdfSettings, 'room_total', { isContainer: false });
  const roomTotalContainerStyles = getPdfStyles(pdfSettings, 'room_total', { isContainer: true });

  // --- AJOUT : Récupération de la couleur de fond claire ---
  const lightBackgroundColor = pdfSettings?.colors?.background || '#f3f4f6'; // Fallback gris clair

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
        style={[
          styles.tableHeaderRow, // Style local pour layout
          tableHeaderContainerStyles, // Styles dynamiques (padding, border, etc.)
          // AJOUT/MODIF : Applique le fond
          { backgroundColor: tableHeaderContainerStyles.backgroundColor || lightBackgroundColor } 
        ]} 
        fixed
      >
        <View style={styles.tableHeaderCellDesc}>
          <Text style={tableHeaderTextStyles}>Description</Text>
        </View>
        {/* ... autres cellules d'en-tête avec leurs styles ... */}
        <View style={styles.tableHeaderCellQty}>
          <Text style={[tableHeaderTextStyles, qtyStyles.textAlign ? { textAlign: qtyStyles.textAlign } : {}]}>Quantité</Text>
        </View>
        <View style={styles.tableHeaderCellPrice}>
          <Text style={[tableHeaderTextStyles, priceStyles.textAlign ? { textAlign: priceStyles.textAlign } : {}]}>Prix HT Unit.</Text>
        </View>
        <View style={styles.tableHeaderCellVAT}>
          <Text style={[tableHeaderTextStyles, vatStyles.textAlign ? { textAlign: vatStyles.textAlign } : {}]}>TVA</Text>
        </View>
        <View style={styles.tableHeaderCellTotal}>
          <Text style={[tableHeaderTextStyles, totalStyles.textAlign ? { textAlign: totalStyles.textAlign } : {}]}>Total HT</Text>
        </View>
      </View>

      {/* 3. Boucle sur les Pièces */}
      {roomsWithTravaux.map((room) => {
        // ... (calcul travauxPiece, pieceTotalHT) ...
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

            {/* Boucle sur les Travaux */}
            {travauxPiece.map((travail, index) => {
              // ... (calculs prixUnitaireHT, totalHT, pieceTotalHT, descriptionText) ...
               const qte = typeof travail.quantite === 'number' ? travail.quantite : 0;
               const fourn = typeof travail.prixFournitures === 'number' ? travail.prixFournitures : 0;
               const mo = typeof travail.prixMainOeuvre === 'number' ? travail.prixMainOeuvre : 0;
               const tvaRate = typeof travail.tauxTVA === 'number' ? travail.tauxTVA : 0;
               const prixUnitaireHT = fourn + mo;
               const totalHT = prixUnitaireHT * qte;
               pieceTotalHT += totalHT; 
               const descriptionText = [
                 `${travail.typeTravauxLabel || 'Type?'}: ${travail.sousTypeLabel || 'Sous-type?'}`, 
                 travail.description,
                 travail.personnalisation
               ].filter(Boolean).join('\n'); 

              return (
                // Ligne de travail
                <View key={travail.id || `travail-${index}`} style={styles.tableRow} wrap={false}> 
                 {/* --- Cellules --- */}
                  {/* Description */}
                  <View style={styles.tableCellDesc}>
                     {/* Structure interne à améliorer plus tard (étape 6) */}
                    <Text style={workDetailsStyles}>{descriptionText}</Text>
                    <Text style={moSuppliesStyles}>{formatMOFournitures(travail)}</Text>
                  </View>
                  {/* Quantité */}
                  <View style={styles.tableCellQty}>
                    <Text style={qtyStyles}>{formatQuantity(qte)}</Text>
                    <Text style={qtyStyles}>{travail.unite || ''}</Text>
                  </View>
                  {/* Prix Unit */}
                  <View style={styles.tableCellPrice}>
                    <Text style={priceStyles}>{formatPrice(prixUnitaireHT)}</Text>
                  </View>
                  {/* TVA */}
                  <View style={styles.tableCellVAT}>
                    <Text style={vatStyles}>{`${tvaRate}%`}</Text>
                  </View>
                  {/* Total HT */}
                  <View style={styles.tableCellTotal}>
                    <Text style={totalStyles}>{formatPrice(totalHT)}</Text>
                  </View>
                </View>
              );
            })}

            {/* Ligne Total Pièce */}
            <View 
              style={[
                styles.tableFooterRow, // Style local pour layout
                roomTotalContainerStyles, // Styles dynamiques (padding, border, etc.)
                 // AJOUT/MODIF : Applique le fond
                { backgroundColor: roomTotalContainerStyles.backgroundColor || lightBackgroundColor }
              ]}
            >
               {/* Cellule Label Total */}
               <View style={styles.tableFooterCellLabel}>
                 {/* Applique le style de texte, y compris textAlign dynamique */}
                 <Text style={roomTotalTextStyles}>Total HT {room.name}</Text>
               </View>
               {/* Cellule Valeur Total */}
               <View style={styles.tableFooterCellTotal}>
                 {/* Applique style de la colonne + priorité alignement du total pièce */}
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
  tableHeaderRow: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 4, // Padding vertical par défaut
    // backgroundColor et border supprimés -> viennent de tableHeaderContainerStyles
  },
  tableHeaderCellDesc: { width: '50%', paddingHorizontal: 4 }, 
  tableHeaderCellQty: { width: '10%', paddingHorizontal: 4, textAlign: 'center' }, // Garde textAlign ici pour le texte par défaut
  tableHeaderCellPrice: { width: '15%', paddingHorizontal: 4, textAlign: 'center' },
  tableHeaderCellVAT: { width: '10%', paddingHorizontal: 4, textAlign: 'center' },
  tableHeaderCellTotal: { width: '15%', paddingHorizontal: 4, textAlign: 'center' },
  tableRow: {
    flexDirection: 'row',
    // borderBottomWidth et Color supprimés -> viendront des styles de work_details etc.
    paddingVertical: 4,
    width: '100%',
    alignItems: 'center', // AJOUT : Centrage vertical des cellules dans la ligne
  },
  tableCellDesc: { width: '50%', paddingHorizontal: 4 }, 
  tableCellQty: { width: '10%', paddingHorizontal: 4, textAlign: 'center'}, // display:flex supprimé
  tableCellPrice: { width: '15%', paddingHorizontal: 4, textAlign: 'center'}, // display:flex supprimé
  tableCellVAT: { width: '10%', paddingHorizontal: 4, textAlign: 'center'}, // display:flex supprimé
  tableCellTotal: { width: '15%', paddingHorizontal: 4, textAlign: 'center'}, // display:flex supprimé
  tableFooterRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 5,
    paddingVertical: 4, // Padding vertical par défaut
    // backgroundColor et border supprimés -> viennent de roomTotalContainerStyles
  },
  tableFooterCellLabel: { 
     flexGrow: 1, 
     paddingHorizontal: 4 
  }, 
  tableFooterCellTotal: { 
     width: '15%', 
     paddingHorizontal: 4, 
     // textAlign vient du Text enfant maintenant
  },
  // Ajout styles pour le titre (au cas où on voudrait un style local de base)
  titleContainer: { // Styles pour le conteneur du titre principal
     // width: 'auto' est invalide, on se fie à alignSelf
  },
  roomTitleContainer: { // Styles pour le conteneur des titres de pièce
     // width: 'auto' est invalide, on se fie à alignSelf
     marginTop: 10, // Ajoute un peu d'espace avant le titre de pièce
  }
});
