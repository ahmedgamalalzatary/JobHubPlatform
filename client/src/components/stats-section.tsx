import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { JOB_STATS } from "@/lib/constants";

export function StatsSection() {
  const { t } = useTranslation();

  const stats = [
    {
      label: t("totalJobSources"),
      value: JOB_STATS.TOTAL_SOURCES,
    },
    {
      label: t("activeJobListings"),
      value: JOB_STATS.ACTIVE_LISTINGS,
    },
    {
      label: t("arabCountriesCovered"),
      value: JOB_STATS.COUNTRIES_COVERED,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 rounded-xl bg-white dark:bg-gray-800 overflow-hidden shadow divide-y divide-gray-200 dark:divide-gray-700 md:grid-cols-3 md:divide-y-0 md:divide-x dark:divide-gray-700">
          {stats.map((stat, index) => (
            <div key={index} className="px-4 py-5 sm:p-6">
              <dt className="text-base font-normal text-gray-900 dark:text-gray-100">
                {stat.label}
              </dt>
              <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-primary">
                  {stat.value}
                </div>
              </dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
