
import { DARK_BLUE } from '../pdfConstants';

export const PDF_ELEMENT_STYLES = {
  // Page de garde
  insurance_info: {
    fontSize: 10,
    color: DARK_BLUE
  },
  company_slogan: {
    fontSize: 12,
    bold: true,
    color: DARK_BLUE,
    margin: [0, 10, 0, 20]
  },
  company_address: {
    fontSize: 11,
    bold: true,
    color: DARK_BLUE,
    margin: [0, 0, 0, 3]
  },
  contact_labels: {
    fontSize: 10,
    color: DARK_BLUE
  },
  contact_values: {
    fontSize: 10,
    color: DARK_BLUE
  },
  quote_number: {
    fontSize: 10,
    color: DARK_BLUE
  },
  quote_validity: {
    fontSize: 9,
    italics: true,
    color: DARK_BLUE
  },
  client_title: {
    fontSize: 10,
    color: DARK_BLUE
  },
  client_content: {
    fontSize: 10,
    color: DARK_BLUE,
    lineHeight: 1.3
  },
  project_title: {
    fontSize: 10,
    color: DARK_BLUE,
    margin: [0, 0, 0, 5]
  },
  project_labels: {
    fontSize: 10,
    color: DARK_BLUE,
    margin: [0, 5, 0, 0]
  },
  project_values: {
    fontSize: 10,
    color: DARK_BLUE,
    margin: [10, 3, 0, 0]
  },
  cover_footer: {
    fontSize: 7,
    color: DARK_BLUE,
    alignment: 'center',
    margin: [40, 0, 40, 20]
  },

  // Page de détail des travaux
  detail_header: {
    fontSize: 8,
    color: DARK_BLUE,
    alignment: 'right',
    margin: [40, 20, 40, 10]
  },
  detail_title: {
    fontSize: 12,
    bold: true,
    color: DARK_BLUE,
    margin: [0, 10, 0, 20]
  },
  detail_table_header: {
    fontSize: 9,
    color: DARK_BLUE
  },
  room_title: {
    fontSize: 9,
    bold: true,
    color: DARK_BLUE,
    margin: [0, 10, 0, 5]
  },
  work_details: {
    fontSize: 9,
    lineHeight: 1.4
  },
  mo_supplies: {
    fontSize: 7,
    lineHeight: 1.4
  },
  qty_column: {
    fontSize: 9,
    alignment: 'center'
  },
  price_column: {
    fontSize: 9,
    alignment: 'center'
  },
  vat_column: {
    fontSize: 9,
    alignment: 'center'
  },
  total_column: {
    fontSize: 9,
    alignment: 'center'
  },
  room_total: {
    fontSize: 9,
    bold: true,
    fillColor: '#f9fafb'
  },

  // Page de récapitulatif
  recap_title: {
    fontSize: 12,
    bold: true,
    color: DARK_BLUE,
    margin: [0, 10, 0, 20]
  },
  recap_table_header: {
    fontSize: 8,
    color: DARK_BLUE
  },
  signature_zone: {
    fontSize: 8,
    margin: [0, 5, 0, 0]
  },
  signature_text: {
    fontSize: 8
  },
  approval_text: {
    fontSize: 8,
    bold: true
  },
  totals_table: {
    fontSize: 8,
    color: DARK_BLUE
  },
  ht_vat_totals: {
    fontSize: 8,
    color: DARK_BLUE
  },
  ttc_total: {
    fontSize: 8,
    color: DARK_BLUE,
    bold: true
  },
  salutation_text: {
    fontSize: 9,
    margin: [0, 10, 0, 0],
    alignment: 'justify'
  },

  // Page CGV
  cgv_title: {
    fontSize: 12,
    bold: true,
    color: DARK_BLUE,
    margin: [0, 0, 0, 20]
  },
  cgv_section_titles: {
    fontSize: 9,
    bold: true,
    margin: [0, 0, 0, 5]
  },
  cgv_content: {
    fontSize: 9,
    margin: [0, 0, 0, 10]
  }
};
