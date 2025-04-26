
import { Font } from '@react-pdf/renderer';

const FONT_DIR = '/fonts/';

export const registerFonts = () => {
  try {
    console.log('Registering PDF fonts...');

    // Register Roboto with all its variants
    Font.register({
      family: 'Roboto',
      fonts: [
        { src: `${FONT_DIR}Roboto-Regular.ttf`, fontWeight: 'normal', fontStyle: 'normal' },
        { src: `${FONT_DIR}Roboto-Bold.ttf`, fontWeight: 'bold', fontStyle: 'normal' },
        { src: `${FONT_DIR}Roboto-Italic.ttf`, fontWeight: 'normal', fontStyle: 'italic' },
        { src: `${FONT_DIR}Roboto-BoldItalic.ttf`, fontWeight: 'bold', fontStyle: 'italic' },
        { src: `${FONT_DIR}Roboto-Light.ttf`, fontWeight: 300 },
        { src: `${FONT_DIR}Roboto-Medium.ttf`, fontWeight: 500 }
      ]
    });

    // Register ModernSans
    Font.register({
      family: 'ModernSans',
      fonts: [
        { src: `${FONT_DIR}ModernSans-Light.ttf`, fontWeight: 300 }
      ]
    });

    console.log('All fonts registered successfully');
  } catch (error) {
    console.error('Error registering PDF fonts:', error);
  }
};
