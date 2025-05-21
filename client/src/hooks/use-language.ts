import { useContext } from "react";
import { I18nProviderContext } from "../providers/i18n-provider";

export function useLanguage() {
  const context = useContext(I18nProviderContext);

  if (context === undefined) {
    throw new Error("useLanguage must be used within an I18nProvider");
  }

  return context;
}
