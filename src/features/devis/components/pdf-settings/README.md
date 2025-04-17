
# Paramètres d'édition PDF

Ce dossier contient les composants pour personnaliser la génération de PDF dans l'application.

## Structure des composants

- `FontSettings.tsx` : Gère les paramètres de police et taille de texte
- `ColorSettings.tsx` : Gère les paramètres de couleurs
- `SpacingSettings.tsx` : Gère les paramètres d'espacement et interligne
- `MarginSettings.tsx` : Gère les paramètres de marges
- `LogoSettings.tsx` : Gère les paramètres du logo

### Composants réutilisables

- `components/ColorPicker.tsx` : Sélecteur de couleur combinant input color et texte
- `components/FontSelector.tsx` : Sélecteur de police avec liste prédéfinie
- `components/NumberControl.tsx` : Input numérique avec label
- `components/MarginsControl.tsx` : Contrôle pour configurer les 4 marges

## Utilisation des paramètres

Les paramètres PDF sont gérés par le hook `usePdfSettings` qui fournit:

- `pdfSettings` : L'état actuel des paramètres
- `updatePdfSettings` : Fonction pour mettre à jour les paramètres
- `resetPdfSettings` : Fonction pour réinitialiser les paramètres

### Structure des données

Les paramètres PDF sont structurés comme suit:

```typescript
interface PdfSettings {
  fontFamily: string;
  fontSize: {
    title: number;
    subtitle: number;
    heading: number;
    normal: number;
    small: number;
    details: number;
  };
  lineSpacing: {
    coverSections: number;
    betweenFields: number;
    afterDescription: number;
    detailsDescription: number;
    afterDetailRow: number;
    betweenSections: number;
  };
  colors: {
    mainText: string;
    detailsText: string;
    coverLines: string;
    detailsLines: string;
    totalBoxLines: string;
    background: string;
  };
  margins: {
    cover: [number, number, number, number];
    details: [number, number, number, number];
    recap: [number, number, number, number];
  };
  logoSettings: {
    useDefaultLogo: boolean;
    logoUrl: string | null;
    width: number;
    height: number;
    alignment: 'left' | 'center' | 'right';
  };
}
```

### Exemple d'utilisation dans un composant

```typescript
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';

const MyComponent = () => {
  const { pdfSettings, updatePdfSettings } = usePdfSettings();
  
  const changeTextColor = () => {
    updatePdfSettings({
      colors: {
        ...pdfSettings.colors,
        mainText: '#333333'
      }
    });
  };
  
  return (
    <div>
      <p>Couleur actuelle: {pdfSettings.colors.mainText}</p>
      <button onClick={changeTextColor}>Changer la couleur</button>
    </div>
  );
};
```
