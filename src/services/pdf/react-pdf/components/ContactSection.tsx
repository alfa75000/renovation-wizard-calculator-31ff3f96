import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getPdfStyles } from '../utils/pdfStyleUtils';

interface ContactSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const ContactSection = ({ pdfSettings, projectState }: ContactSectionProps) => {
  const company = projectState.metadata?.company;

  if (!company) return null;

  const labelStyles = getPdfStyles(pdfSettings, 'contact_labels', { isContainer: false });
  const valueStyles = getPdfStyles(pdfSettings, 'contact_values', { isContainer: false });
  // Utilise 'default' pour le conteneur global de la section contact, c'est ok.
  const containerStyles = getPdfStyles(pdfSettings, 'default', { isContainer: true });
  const tel1 = projectState.metadata?.company?.tel1;
  const tel2 = projectState.metadata?.company?.tel2;
  const email = projectState.metadata?.company?.email;

  return (
    <View style={[styles.container, containerStyles]}>
      {/* Ligne Tel1 */}
      {company.tel1 && ( // Ajout d'une vérification si tel1 existe
        <View style={styles.contactRow}>
          <Text style={[styles.label, labelStyles]}>Tél:</Text>
          <Text style={[styles.value, valueStyles]}>{company.tel1}</Text>
        </View>
      )}

      {/* Ligne Tel2 - Affichée seulement si tel2 existe */}
      {company.tel2 && (
        <View style={styles.contactRow}>
          {/* PAS DE LABEL ici, mais un espace réservé pour l'alignement */}
          <Text style={[styles.label, labelStyles]}>{''}</Text>
          <Text style={[styles.value, valueStyles]}>{company.tel2}</Text>
        </View>
      )}

      {/* Ligne Email */}
      {company.email && ( // Ajout d'une vérification si email existe
        <View style={styles.contactRow}>
          <Text style={[styles.label, labelStyles]}>Mail:</Text>
          <Text style={[styles.value, valueStyles]}>{company.email}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Le marginBottom est géré par l'espaceur dans CoverDocument
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: 2 // Réduit un peu l'espace entre les lignes de contact
  },
  label: {
    width: 40,       // Largeur fixe pour aligner les valeurs
    marginRight: 5,  // Espace entre label et valeur
    // Note: fontWeight, fontSize, color etc. viendront de labelStyles
    // Le textAlign appliqué par labelStyles fonctionnera à l'intérieur de cette largeur fixe.
  },
  value: {
    flex: 1 // Prend le reste de la place
    // Note: Les styles de texte viendront de valueStyles
  }
});