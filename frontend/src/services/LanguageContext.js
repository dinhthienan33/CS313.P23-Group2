import React, { createContext, useState, useContext, useEffect } from 'react';
import { en, vi } from './translations';

// Create the Language context
const LanguageContext = createContext();

// Custom hook for easy context usage
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export const LanguageProvider = ({ children }) => {
  // Get saved language from localStorage or default to English
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  // Update translations based on selected language
  const translations = language === 'en' ? en : vi;

  // Toggle between English and Vietnamese
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'vi' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Save language preference to localStorage when changed
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, translations, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext; 