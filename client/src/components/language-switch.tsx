import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

interface LanguageSwitchProps {
  isMobile?: boolean;
}

export function LanguageSwitch({ isMobile = false }: LanguageSwitchProps) {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  if (isMobile) {
    return (
      <Button
        variant="ghost"
        className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
        onClick={toggleLanguage}
      >
        {language === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-full bg-gray-200 inline-flex items-center justify-center"
      onClick={toggleLanguage}
      aria-label={t("switchLanguage")}
    >
      <span className="text-xs font-medium">
        {t(`languages.${language === "en" ? "ar" : "en"}`)}
      </span>
    </Button>
  );
}
