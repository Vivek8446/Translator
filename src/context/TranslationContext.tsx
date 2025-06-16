import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = "en" | "hi" | "mr" | "kn";

interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  isTransitioning: boolean;
}

const TranslationContext = createContext<TranslationContextType>({
  currentLanguage: "en",
  setLanguage: () => {},
  isTransitioning: false
});

export const useTranslation = () => useContext(TranslationContext);

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export const TranslationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [initialized, setInitialized] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const initTranslator = () => {
    // Add CSS to hide the Google bar
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-banner-frame {
        display: none !important;
      }
      .goog-te-menu-value:hover {
        text-decoration: none !important;
      }
      body {
        top: 0 !important;
      }
      .skiptranslate {
        display: none !important;
      }
      .goog-te-gadget {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Create the translation element
    const translateElement = document.createElement('div');
    translateElement.id = 'google_translate_element';
    translateElement.style.display = 'none';
    document.body.appendChild(translateElement);

    // Define the initialization function
    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
            includedLanguages: "en,hi,mr,kn",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          "google_translate_element"
        );
        
        // Get the current language from cookie if exists
        const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
        if (match && match[1]) {
          setCurrentLanguage(match[1] as Language);
        }
        
        setInitialized(true);
        
        // Hide Google top bar
        setTimeout(hideTopBar, 300);
      } catch (error) {
        console.error('Error initializing Google Translate:', error);
        setInitialized(false);
      }
    };

    // Load the Google Translate script with retry mechanism
    const loadGoogleTranslateScript = (retryCount = 0) => {
      if (retryCount >= 3) {
        console.error('Failed to load Google Translate script after 3 attempts');
        return;
      }

      const script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = () => {
        console.warn(`Failed to load Google Translate script, attempt ${retryCount + 1}`);
        setTimeout(() => loadGoogleTranslateScript(retryCount + 1), 1000);
      };
      document.body.appendChild(script);
    };

    loadGoogleTranslateScript();
  };

  const hideTopBar = () => {
    const googleFrame = document.querySelector('.goog-te-banner-frame');
    if (googleFrame) {
      googleFrame.setAttribute('style', 'display: none !important');
    }
    document.body.style.top = '0px';
  };

  useEffect(() => {
    if (!initialized) {
      initTranslator();
    }
    
    // Add MutationObserver to continuously hide the top bar
    const observer = new MutationObserver(() => {
      hideTopBar();
    });
    
    observer.observe(document.body, { 
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }, [initialized]);

  const setLanguage = (lang: Language) => {
    if (lang === currentLanguage) return;
    
    setIsTransitioning(true);
    setCurrentLanguage(lang);
    
    if (initialized) {
      try {
        const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectField) {
          selectField.value = lang;
          selectField.dispatchEvent(new Event('change'));
          
          // Reset transitioning state after a delay
          setTimeout(() => {
            setIsTransitioning(false);
          }, 1000);
        } else {
          // Fallback to cookie approach
          document.cookie = `googtrans=/en/${lang};path=/;domain=${window.location.hostname}`;
          window.location.reload();
        }
      } catch (error) {
        console.error('Error changing language:', error);
        setIsTransitioning(false);
      }
      
      // Ensure the top bar stays hidden
      setTimeout(hideTopBar, 300);
    } else {
      setIsTransitioning(false);
    }
  };

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, isTransitioning }}>
      {children}
    </TranslationContext.Provider>
  );
};