import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { JobCard } from "@/components/job-card";
import { JobWithSaved, FilterParams } from "@/lib/types";
import { API_ROUTES } from "@/lib/constants";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoginModal } from "@/components/auth/login-modal";
import { PaginationControls } from "@/components/pagination-controls";

interface JobListProps {
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
}

export function JobList({ filters, onFilterChange }: JobListProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Check if user is authenticated
  const { data: user } = useQuery({
    queryKey: [API_ROUTES.CURRENT_USER],
  });

  const isAuthenticated = !!user;

  // Fetch jobs based on filters
  const { data: jobsResponse, isLoading } = useQuery({
    queryKey: [API_ROUTES.JOBS, filters],
    staleTime: 1000 * 60, // 1 minute
  });

  // Handle pagination change
  const handlePageChange = (page: number) => {
    onFilterChange({
      ...filters,
      page,
    });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    onFilterChange({
      ...filters,
      sortBy: value as "recent" | "salary" | "relevance",
    });
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update API endpoint based on selected tab
    let updatedFilters = { ...filters, page: 1 };
    
    if (value === "all") {
      // Reset any special filtering
      updatedFilters = {
        ...updatedFilters,
        // Reset any active filters when switching to 'all'
        sortBy: 'recent'
      };
    } else if (value === "recommended" && isAuthenticated) {
      // Filter for recommended jobs (e.g., matching user's profile)
      updatedFilters = {
        ...updatedFilters,
        sortBy: 'relevance',
        // In a real implementation, we would add additional filters
        // based on the user's profile, skills, and preferences
      };
    } else if (value === "saved" && isAuthenticated) {
      // For "saved" tab, we would redirect to saved jobs page instead
      // This is just a placeholder for the demo
      return;
    }
    
    onFilterChange(updatedFilters);
    console.log(`Tab changed to: ${value}, applied filters:`, updatedFilters);
  };

  return (
    <>
      <Card className="bg-card-bg dark:bg-gray-800 rounded-2xl shadow-sm">
        <CardHeader className="p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
              {t("availableJobs")}
            </CardTitle>
            <div 
              className={`flex items-center space-x-2 ${
                isRTL ? "space-x-0 space-x-reverse space-x-2" : ""
              }`}
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("sortBy")}
              </span>
              <Select
                defaultValue={filters.sortBy || "recent"}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="h-8 text-xs w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">{t("mostRecent")}</SelectItem>
                  <SelectItem value="salary">{t("highestSalary")}</SelectItem>
                  <SelectItem value="relevance">{t("mostRelevant")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={handleTabChange}
            className="mt-4"
          >
            <TabsList className="border-b border-gray-200 dark:border-gray-700 mb-0 w-full justify-start bg-transparent p-0">
              <TabsTrigger 
                className="py-3 px-2 text-sm border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary
                rounded-none shadow-none data-[state=active]:shadow-none bg-transparent" 
                value="all"
              >
                {t("allJobs")}
              </TabsTrigger>
              <TabsTrigger 
                className="py-3 px-2 text-sm border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary
                rounded-none shadow-none data-[state=active]:shadow-none bg-transparent" 
                value="recommended"
              >
                {t("recommended")}
              </TabsTrigger>
              <TabsTrigger 
                className="py-3 px-2 text-sm border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary
                rounded-none shadow-none data-[state=active]:shadow-none bg-transparent" 
                value="saved"
                disabled={!isAuthenticated}
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowLoginModal(true);
                  }
                }}
              >
                {t("saved")}
              </TabsTrigger>
              <TabsTrigger 
                className="py-3 px-2 text-sm border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary
                rounded-none shadow-none data-[state=active]:shadow-none bg-transparent" 
                value="applied"
                disabled={!isAuthenticated}
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowLoginModal(true);
                  }
                }}
              >
                {t("applied")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0 pt-4">
              {isLoading ? (
                <div className="p-6 text-center">
                  <div className="animate-pulse flex flex-col gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-gray-200 dark:bg-gray-700 h-40 rounded-xl"></div>
                    ))}
                  </div>
                </div>
              ) : jobsResponse?.data?.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  {t("noJobsFound")}
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {jobsResponse?.data.map((job: JobWithSaved) => (
                    <div key={job.id} className="py-4">
                      <JobCard 
                        job={job} 
                        isAuthenticated={isAuthenticated} 
                        onLoginPrompt={() => setShowLoginModal(true)} 
                      />
                    </div>
                  ))}
                </div>
              )}

              {jobsResponse && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <PaginationControls
                    currentPage={jobsResponse.page}
                    totalPages={jobsResponse.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="recommended" className="mt-0 pt-4">
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                {isAuthenticated ? t("noRecommendedJobs") : t("loginToViewRecommended")}
              </div>
            </TabsContent>

            <TabsContent value="saved" className="mt-0 pt-4">
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                {isAuthenticated ? t("noSavedJobs") : t("loginToViewSaved")}
              </div>
            </TabsContent>

            <TabsContent value="applied" className="mt-0 pt-4">
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                {isAuthenticated ? t("noAppliedJobs") : t("loginToViewApplied")}
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  );
}
