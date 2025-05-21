import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_ROUTES } from "@/lib/constants";
import { JobSource } from "@/lib/types";
import { PaginationControls } from "@/components/pagination-controls";
import { SourceForm } from "@/components/source-form";
import { ExternalLink } from "lucide-react";

export default function JobSources() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch job sources
  const { data: sourcesResponse, isLoading } = useQuery({
    queryKey: [API_ROUTES.JOB_SOURCES, { page, limit }],
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {t("jobSources")}
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
          {t("jobSourcesDescription")}
        </p>
      </div>

      <div className="mt-8">
        <Card className="bg-card-bg dark:bg-gray-800 rounded-2xl shadow-sm mb-12">
          <CardHeader className="p-6">
            <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
              {t("availableJobSources")}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-pulse flex flex-col gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-200 dark:bg-gray-700 h-20 rounded-xl"></div>
                  ))}
                </div>
              </div>
            ) : sourcesResponse?.data?.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                {t("noJobSources")}
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {sourcesResponse?.data.map((source: JobSource) => (
                  <div key={source.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {source.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {t(source.category.toLowerCase().replace(/\s+/g, ""))}
                        </p>
                      </div>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark flex items-center"
                      >
                        <ExternalLink className="w-5 h-5 mr-1" />
                        {t("visit")}
                      </a>
                    </div>
                    {source.description && (
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        {source.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {sourcesResponse && sourcesResponse.data?.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <PaginationControls
                  currentPage={sourcesResponse.page}
                  totalPages={sourcesResponse.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <SourceForm />
      </div>
    </div>
  );
}
