import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext.jsx'; // **Add this import**

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider> {/* **Wrap App with ThemeProvider** */}
      <App />
    </ThemeProvider>
  </StrictMode>
);
