import { useState } from "react";
import { useTranslation } from "react-i18next";
import { JobFilter } from "@/components/job-filter";
import { JobList } from "@/components/job-list";
import { FilterParams } from "@/lib/types";

export default function Jobs() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    limit: 10,
    sortBy: "recent",
  });

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {t("latestJobOpportunities")}
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
          {t("browseThousands")}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <JobFilter
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
        </div>

        <div className="lg:col-span-3">
          <JobList
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
  );
}
