import { useTranslation } from "react-i18next";
import { FEATURES } from "@/lib/constants";
import { useLanguage } from "@/hooks/use-language";

export function Features() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t("whyJobhub")}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            {t("whyDescription")}
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div key={feature.id} className="pt-6">
                <div className="flow-root bg-white dark:bg-gray-900 rounded-2xl shadow-sm px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-xl shadow-lg">
                        <i className={`${feature.icon} text-white text-2xl`}></i>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">
                      {feature.title[language]}
                    </h3>
                    <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                      {feature.description[language]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
