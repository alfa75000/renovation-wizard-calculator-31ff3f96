
import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { CompanyData } from '@/types';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';

export interface CoverFooterSectionProps {
  pdfSettings?: PdfSettings;
  company?: CompanyData | null;
}

export const PageFooter: React.FC<CoverFooterSectionProps> = ({ pdfSettings, company }) => {
  // S'assurer qu'il n'y a pas de texte en dehors des composants Text
  if (!company) {
    return <View style={styles.footer}></View>;
  }

  const companyName = company?.name || '';
  const capitalSocial = company?.capital_social || '';
  const address = company?.address || '';
  const postalCode = company?.postal_code || '';
  const city = company?.city || '';
  const siret = company?.siret || '';
  const codeApe = company?.code_ape || '';
  const tvaIntracom = company?.tva_intracom || '';

  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>
        {companyName && `${companyName} - `}
        {capitalSocial && `SASU au Capital de ${capitalSocial}€ - `}
        {`${address} ${postalCode} ${city} - `}
        {siret && `Siret : ${siret} - `}
        {codeApe && `Code APE : ${codeApe} - `}
        {tvaIntracom && `N° TVA Intracommunautaire : ${tvaIntracom}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    marginTop: 15,
    paddingTop: 5,
    paddingHorizontal: 40
  },
  footerText: {
    fontSize: 7,
    color: '#1a1f2c',
    textAlign: 'center',
  }
});
