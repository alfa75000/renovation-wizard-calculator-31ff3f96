import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { Style } from '@react-pdf/types';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getContainerStyles, getTextStyles } from '../utils/pdfStyleUtils';
import { convertPageMargins, MarginTuple } from '../../v2/utils/styleUtils';

interface RecapPageProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const RecapPage: React.FC<RecapPageProps> = ({ pdfSettings, projectState }) => {
  if (!pdfSettings || !projectState || !projectState.rooms) {
    return null;
  }

  const detailsMargins = convertPageMargins(pdfSettings.margins?.details as number[] | undefined);
  const footerSpace = 50;
  const pagePaddingBottom = detailsMargins[2] + footerSpace;

  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      fontSize: 10,
      paddingTop: detailsMargins[0],
      paddingRight: detailsMargins[1],
      paddingBottom: pagePaddingBottom,
      paddingLeft: detailsMargins[3],
    },
    section: {
      marginBottom: 10,
    },
    table: {
      display: 'table',
      width: 'auto',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0
    },
    tableRow: {
      margin: 'auto',
      flexDirection: 'row'
    },
    tableColHeader: {
      width: '25%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0
    },
    tableCol: {
      width: '25%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0
    },
    tableCellHeader: {
      margin: 4,
      fontSize: 10,
      fontWeight: 'bold'
    },
    tableCell: {
      margin: 4,
      fontSize: 9
    }
  });

  return (
    <>
      {projectState.rooms.map((room, roomIndex) => (
        <Page key={room.id} size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={getTextStyles(pdfSettings, 'roomTitle')}>
              {room.customName || room.name}
            </Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Type de prestation</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Description</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Quantité</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Prix unitaire</Text>
                </View>
              </View>
              {projectState.travaux
                .filter(travail => travail.pieceId === room.id)
                .map((travail, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{travail.typeTravauxLabel}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{travail.description}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{travail.quantite} {travail.unite}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{travail.prixFournitures + travail.prixMainOeuvre} €</Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </Page>
      ))}
    </>
  );
};
