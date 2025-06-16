
// Translator.tsx
import { useTranslation } from '../context/TranslationContext';
import { useState, useEffect } from 'react';

const Translator = () => {
  const { currentLanguage, setLanguage, isTransitioning } = useTranslation();
  const [delayedActive, setDelayedActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle the delay for active classes
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setDelayedActive(true);
      }, 400);
      
      return () => clearTimeout(timer);
    } else {
      setDelayedActive(false);
    }
  }, [isTransitioning]);

  const getButtonClasses = (isActive: boolean) => {
    const baseClasses = "px-3 py-1 text-white rounded text-sm transition-all duration-300 ease-in-out transform";
    const activeClasses = delayedActive ? "btn-gradient scale-105 shadow-lg" : "primary-gradient hover:scale-102";
    const inactiveClasses = "primary-gradient hover:scale-102";
    const disabledClasses = isTransitioning ? "opacity-70 cursor-not-allowed" : "cursor-pointer";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${disabledClasses}`;
  };

  const handleLanguageChange = async (lang: "en" | "hi" | "mr" | "kn") => {
    if (!isTransitioning && lang !== currentLanguage) {
      try {
        setError(null);
        await setLanguage(lang);
      } catch (err) {
        setError('Failed to change language. Please try again.');
        console.error('Language change error:', err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-bl-lg shadow-md">
        <button
          className={getButtonClasses(currentLanguage === 'en')}
          onClick={() => handleLanguageChange("en")}
          disabled={isTransitioning}
          aria-label="Switch to English"
        >
          English
        </button>
        <button
          className={getButtonClasses(currentLanguage === 'hi')}
          onClick={() => handleLanguageChange("hi")}
          disabled={isTransitioning}
          aria-label="Switch to Hindi"
        >
          हिंदी
        </button>
        <button
          className={getButtonClasses(currentLanguage === 'mr')}
          onClick={() => handleLanguageChange("mr")}
          disabled={isTransitioning}
          aria-label="Switch to Marathi"
        >
          मराठी
        </button>
        <button
          className={getButtonClasses(currentLanguage === 'kn')}
          onClick={() => handleLanguageChange("kn")}
          disabled={isTransitioning}
          aria-label="Switch to Kannada"
        >
          ಕನ್ನಡ
        </button>
        
        {isTransitioning && (
          <div className="flex items-center ml-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mt-1 animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
};

export default Translator;