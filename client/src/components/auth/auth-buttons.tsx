import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

interface AuthButtonsProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export function AuthButtons({ onLoginClick, onSignupClick }: AuthButtonsProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className={`ml-3 relative flex items-center gap-3 ${isRTL ? "ml-0 mr-3" : ""}`}>
      <Button
        variant="outline"
        className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        onClick={onLoginClick}
      >
        {t("login")}
      </Button>

      <Button
        variant="default"
        onClick={onSignupClick}
      >
        {t("signup")}
      </Button>
    </div>
  );
}
