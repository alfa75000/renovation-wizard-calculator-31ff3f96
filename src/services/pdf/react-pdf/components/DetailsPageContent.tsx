import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState, Room, Travail } from '@/types'; 
import { getPdfStyles } from '../utils/pdfStyleUtils';

// === FONCTIONS DE FORMATAGE (Doivent exister ou être importées) ===
// Assure-toi que ces fonctions existent et sont correctes
const formatPrice = (value: number): string => { return `${(value || 0).toFixed(2)} €`; }; 
const formatQuantity = (quantity: number): string => { return `${(quantity || 0)}`; }; 
const formatMOFournitures = (travail: Travail): string => { 
    if (!travail) return '';
    const mo = formatPrice(travail.prixMainOeuvre || 0);
    const fourn = formatPrice(travail.prixFournitures || 0);
    const tva = travail.tauxTVA || 0;
    // Calcule le montant TVA pour l'affichage si nécessaire
    // const itemTotalHT = ((travail.prixFournitures || 0) + (travail.prixMainOeuvre || 0)) * (travail.quantite || 0);
    // const montantTVA = (itemTotalHT * tva) / 100;
    // return `[ MO: ${mo}/u ] [ Fourn: ${fourn}/u ] [ TVA(${tva}%): ${formatPrice(montantTVA)} ]`; 
    // Simplifié pour l'exemple :
     return `[ MO: ${mo}/u | Fourn: ${fourn}/u | TVA: ${tva}% ]`; 
};
// ===============================================================

// Helper pour obtenir les travaux d'une pièce
const getTravauxForPiece = (pieceId: string, allTravaux: Travail[] = []): Travail[] => { // Ajout valeur défaut
  return allTravaux.filter(t => t.pieceId === pieceId);
};

// Nouvelle fonction utilitaire pour convertir textAlign en alignSelf
const getAlignSelf = (textAlign?: string) => {
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

  // Récupération des styles
  const titleTextStyles = getPdfStyles(pdfSettings, 'detail_title', { isContainer: false });
  const titleContainerStyles = getPdfStyles(pdfSettings, 'detail_title', { isContainer: true });
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
  const roomTotalTextStyles = getPdfStyles(pdfSettings, 'room_total', { isContainer: false });
  const roomTotalContainerStyles = getPdfStyles(pdfSettings, 'room_total', { isContainer: true });

  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id, travaux).length > 0);

  if (roomsWithTravaux.length === 0) {
    return <View><Text>Aucun travail à afficher dans les détails.</Text></View>;
  }

  return (
    <View>
      {/* 1. Titre Principal avec alignSelf adaptatif */}
      <View style={[
        styles.titleContainer,
        titleContainerStyles,
        { alignSelf: getAlignSelf(titleTextStyles.textAlign) }
      ]}>
        <Text style={titleTextStyles}>DÉTAILS DES TRAVAUX</Text>
      </View>
      <View style={{ height: 15 }} />

      {/* 2. En-tête du Tableau avec styles dynamiques */}
      <View style={[styles.tableHeaderRow, tableHeaderContainerStyles]} fixed>
        <View style={styles.tableHeaderCellDesc}>
          <Text style={tableHeaderTextStyles}>Description</Text>
        </View>
        <View style={styles.tableHeaderCellQty}>
          <Text style={[tableHeaderTextStyles, qtyStyles.textAlign ? { textAlign: qtyStyles.textAlign } : {}]}>
            Quantité
          </Text>
        </View>
        <View style={styles.tableHeaderCellPrice}>
          <Text style={[tableHeaderTextStyles, priceStyles.textAlign ? { textAlign: priceStyles.textAlign } : {}]}>
            Prix HT Unit.
          </Text>
        </View>
        <View style={styles.tableHeaderCellVAT}>
          <Text style={[tableHeaderTextStyles, vatStyles.textAlign ? { textAlign: vatStyles.textAlign } : {}]}>
            TVA
          </Text>
        </View>
        <View style={styles.tableHeaderCellTotal}>
          <Text style={[tableHeaderTextStyles, totalStyles.textAlign ? { textAlign: totalStyles.textAlign } : {}]}>
            Total HT
          </Text>
        </View>
      </View>

      {/* 3. Boucle sur les Pièces */}
      {roomsWithTravaux.map((room) => {
        const travauxPiece = getTravauxForPiece(room.id, travaux);
        let pieceTotalHT = 0;

        return (
          <React.Fragment key={room.id}>
            {/* Titre de la Pièce avec alignSelf adaptatif */}
            <View style={[
              styles.roomTitleContainer,
              roomTitleContainerStyles,
              { alignSelf: getAlignSelf(roomTitleTextStyles.textAlign) }
            ]} break>
              <Text style={roomTitleTextStyles}>{room.name}</Text>
            </View>
            <View style={{ height: 5 }} />

            {/* Boucle sur les Travaux */}
            {travauxPiece.map((travail, index) => {
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
                <View key={travail.id || `travail-${index}`} style={styles.tableRow} wrap={false} minPresenceAhead={20}>
                  <View style={styles.tableCellDesc}>
                    <Text style={workDetailsStyles}>{descriptionText}</Text>
                    <Text style={moSuppliesStyles}>{formatMOFournitures(travail)}</Text>
                  </View>
                  <View style={styles.tableCellQty}>
                    <Text style={qtyStyles}>{formatQuantity(qte)}</Text>
                    <Text style={qtyStyles}>{travail.unite || ''}</Text>
                  </View>
                  <View style={styles.tableCellPrice}>
                    <Text style={priceStyles}>{formatPrice(prixUnitaireHT)}</Text>
                  </View>
                  <View style={styles.tableCellVAT}>
                    <Text style={vatStyles}>{`${tvaRate}%`}</Text>
                  </View>
                  <View style={styles.tableCellTotal}>
                    <Text style={totalStyles}>{formatPrice(totalHT)}</Text>
                  </View>
                </View>
              );
            })}

            {/* Total Pièce avec styles dynamiques */}
            <View style={[styles.tableFooterRow, roomTotalContainerStyles]}>
              <View style={styles.tableFooterCellLabel}>
                <Text style={roomTotalTextStyles}>Total HT {room.name}</Text>
              </View>
              <View style={styles.tableFooterCellTotal}>
                <Text style={[totalStyles, roomTotalTextStyles.textAlign ? { textAlign: roomTotalTextStyles.textAlign } : {}]}>
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

const styles = StyleSheet.create({
  titleContainer: {
    width: 'auto',
  },
  roomTitleContainer: {
    width: 'auto',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    width: '100%',
  },
  tableHeaderCellDesc: { 
    width: '60%', 
    paddingHorizontal: 4 
  },
  tableHeaderCellQty: { 
    width: '8%', 
    paddingHorizontal: 4
  },
  tableHeaderCellPrice: { 
    width: '12%', 
    paddingHorizontal: 4
  },
  tableHeaderCellVAT: { 
    width: '6%', 
    paddingHorizontal: 4
  },
  tableHeaderCellTotal: { 
    width: '14%', 
    paddingHorizontal: 4
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 4,
    width: '100%',
    alignItems: 'flex-start',
  },
  tableCellDesc: { 
    width: '60%', 
    paddingHorizontal: 4 
  },
  tableCellQty: { 
    width: '8%', 
    paddingHorizontal: 4,
    display: 'flex',
    justifyContent: 'center'
  },
  tableCellPrice: { 
    width: '12%', 
    paddingHorizontal: 4,
    display: 'flex',
    justifyContent: 'center'
  },
  tableCellVAT: { 
    width: '6%', 
    paddingHorizontal: 4,
    display: 'flex',
    justifyContent: 'center'
  },
  tableCellTotal: { 
    width: '14%', 
    paddingHorizontal: 4,
    display: 'flex',
    justifyContent: 'center'
  },
  tableFooterRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 5,
  },
  tableFooterCellLabel: {
    flexGrow: 1,
    paddingHorizontal: 4
  },
  tableFooterCellTotal: {
    width: '15%',
    paddingHorizontal: 4
  },
});
