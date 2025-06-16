import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TranslationProvider } from './context/TranslationContext';


createRoot(document.getElementById('root')!).render(
  <TranslationProvider>
        <StrictMode>
           <App />
        </StrictMode>
  </TranslationProvider>,
)
