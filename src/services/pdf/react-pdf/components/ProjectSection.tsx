
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getPdfStyles } from '../utils/pdfStyleUtils';

interface ProjectSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const ProjectSection = ({ pdfSettings, projectState }: ProjectSectionProps) => {
  const metadata = projectState.metadata;
  
  const titleStyles = getPdfStyles(pdfSettings, 'project_title', { isContainer: false });
  const labelStyles = getPdfStyles(pdfSettings, 'project_labels', { isContainer: false });
  const valueStyles = getPdfStyles(pdfSettings, 'project_values', { isContainer: false });
  const containerStyles = getPdfStyles(pdfSettings, 'default', { isContainer: true });
  
  // On récupère les données du projet
  const occupant = metadata?.occupant || 'Non renseigné';
  const address = metadata?.adresseChantier || 'Non renseignée';
  const description = metadata?.descriptionProjet || 'Non renseignée';
  const infoComplementaire = metadata?.infoComplementaire || 'Non renseignée';
  
  return (
    <View style={[styles.container, containerStyles]}>
      <Text style={[styles.title, titleStyles]}>Informations Projet</Text>
      
      {/* Première ligne: Occupant */}
      <View style={styles.row}>
        <Text style={[styles.label, labelStyles]}>Occupant(s):</Text>
        <Text style={[styles.value, valueStyles]}>{occupant}</Text>
      </View>
      
      {/* Espace vertical */}
      <View style={{ height: 12 }} />
      
      {/* Deuxième ligne: Adresse Chantier */}
      <View style={styles.row}>
        <Text style={[styles.label, labelStyles]}>Adresse Chantier / d'Intervention:</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.value, valueStyles]}>{address}</Text>
      </View>
      
      {/* Espace vertical */}
      <View style={{ height: 12 }} />
      
      {/* Troisième ligne: Descriptif */}
      <View style={styles.row}>
        <Text style={[styles.label, labelStyles]}>Descriptif:</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.value, valueStyles]}>{description}</Text>
      </View>
      
      {/* Espace vertical */}
      <View style={{ height: 12 }} />
      
      {/* Quatrième ligne: Informations complémentaires */}
      <View style={styles.row}>
        <Text style={[styles.label, labelStyles]}>Informations complémentaires:</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.value, valueStyles]}>{infoComplementaire}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8
  },
  value: {
    flex: 1
  }
});
