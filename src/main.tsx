
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerFonts } from './services/pdf/utils/reactPdfFonts';

// Register PDF fonts before rendering the app
registerFonts();

createRoot(document.getElementById("root")!).render(<App />);
