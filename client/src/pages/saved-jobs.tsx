import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { JobCard } from "@/components/job-card";
import { API_ROUTES } from "@/lib/constants";
import { JobWithSaved, FilterParams } from "@/lib/types";
import { LoginModal } from "@/components/auth/login-modal";
import { PaginationControls } from "@/components/pagination-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SavedJobs() {
  const { t } = useTranslation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    limit: 10,
  });

  // Check if user is authenticated
  const { data: user } = useQuery({
    queryKey: [API_ROUTES.CURRENT_USER],
  });

  const isAuthenticated = !!user;

  // Fetch saved jobs
  const { data: savedJobsResponse, isLoading } = useQuery({
    queryKey: [API_ROUTES.SAVED_JOBS, filters],
    enabled: isAuthenticated,
  });

  const handlePageChange = (page: number) => {
    setFilters({
      ...filters,
      page,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="bg-card-bg dark:bg-gray-800 rounded-2xl shadow-sm">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("loginRequired")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              {t("savedJobsDescription")}
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {t("login")}
            </button>

            <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {t("savedJobs")}
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
          {t("savedJobsDescription")}
        </p>
      </div>

      <div className="mt-8">
        <Card className="bg-card-bg dark:bg-gray-800 rounded-2xl shadow-sm">
          <CardHeader className="p-6">
            <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
              {t("yourSavedJobs")}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-pulse flex flex-col gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-200 dark:bg-gray-700 h-40 rounded-xl"></div>
                  ))}
                </div>
              </div>
            ) : savedJobsResponse?.data?.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                {t("noSavedJobs")}
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {savedJobsResponse?.data.map((job: JobWithSaved) => (
                  <div key={job.id} className="py-4 px-6">
                    <JobCard
                      job={{ ...job, isSaved: true }}
                      isAuthenticated={isAuthenticated}
                      onLoginPrompt={() => setShowLoginModal(true)}
                    />
                  </div>
                ))}
              </div>
            )}

            {savedJobsResponse && savedJobsResponse.data?.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <PaginationControls
                  currentPage={savedJobsResponse.page}
                  totalPages={savedJobsResponse.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
