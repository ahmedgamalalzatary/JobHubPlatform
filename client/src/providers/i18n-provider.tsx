import { createContext, useEffect, useState } from "react";
import { i18nInstance } from "../lib/i18n";

type Language = "en" | "ar";

type I18nProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
};

type I18nProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
  isRTL: boolean;
};

const initialState: I18nProviderState = {
  language: "en",
  setLanguage: () => null,
  isRTL: false,
};

export const I18nProviderContext = createContext<I18nProviderState>(initialState);

export function I18nProvider({
  children,
  defaultLanguage = "en",
  storageKey = "jobhub-language",
}: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem(storageKey) as Language) || defaultLanguage
  );
  const [isRTL, setIsRTL] = useState(language === "ar");

  useEffect(() => {
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", language);
  }, [isRTL, language]);

  const setLanguage = (lang: Language) => {
    const isRightToLeft = lang === "ar";
    setIsRTL(isRightToLeft);
    setLanguageState(lang);
    i18nInstance.changeLanguage(lang);
    localStorage.setItem(storageKey, lang);
  };

  // Initialize language
  useEffect(() => {
    i18nInstance.changeLanguage(language);
  }, [language]);

  return (
    <I18nProviderContext.Provider
      value={{
        language,
        setLanguage,
        isRTL,
      }}
    >
      {children}
    </I18nProviderContext.Provider>
  );
}
