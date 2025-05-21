import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, BookmarkCheck, Briefcase, Calendar, DollarSign, MapPin } from "lucide-react";
import { JobWithSaved } from "@/lib/types";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { API_ROUTES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

type JobCardProps = {
  job: JobWithSaved;
  isAuthenticated: boolean;
  onLoginPrompt: () => void;
};

export function JobCard({ job, isAuthenticated, onLoginPrompt }: JobCardProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(job.isSaved || false);

  const saveJobMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", API_ROUTES.SAVED_JOBS, { jobId: job.id });
      return response.json();
    },
    onSuccess: () => {
      setIsSaved(true);
      toast({
        title: t("jobSaved"),
        description: t("jobSavedDescription"),
      });
      // Invalidate saved jobs query
      queryClient.invalidateQueries({ queryKey: [API_ROUTES.SAVED_JOBS] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: t("jobSaveFailed"),
        description: error.message,
      });
    },
  });

  const removeJobMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `${API_ROUTES.SAVED_JOBS}/${job.id}`, undefined);
      return response;
    },
    onSuccess: () => {
      setIsSaved(false);
      toast({
        title: t("jobRemoved"),
        description: t("jobRemovedDescription"),
      });
      // Invalidate saved jobs query
      queryClient.invalidateQueries({ queryKey: [API_ROUTES.SAVED_JOBS] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: t("jobRemoveFailed"),
        description: error.message,
      });
    },
  });

  const handleSaveToggle = () => {
    if (!isAuthenticated) {
      onLoginPrompt();
      return;
    }

    if (isSaved) {
      removeJobMutation.mutate();
    } else {
      saveJobMutation.mutate();
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return t("postedToday");
    } else if (diffInDays === 1) {
      return t("postedDaysAgo", { days: 1 });
    } else if (diffInDays < 7) {
      return t("postedDaysAgo", { days: diffInDays });
    } else if (diffInDays < 14) {
      return t("postedWeekAgo", { weeks: 1 });
    } else {
      return t("postedWeeksAgo", { weeks: Math.floor(diffInDays / 7) });
    }
  };

  return (
    <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150 ease-in-out">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row">
          <div className={`mb-4 sm:mb-0 sm:mr-4 ${isRTL ? "sm:mr-0 sm:ml-4" : ""}`}>
            <div className="w-16 h-16 bg-white dark:bg-gray-700 flex items-center justify-center rounded-lg shadow border border-gray-200 dark:border-gray-600">
              <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400">
                {job.company.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {job.title}
              </h3>
              <button
                onClick={handleSaveToggle}
                className={`ml-2 text-gray-400 hover:text-primary focus:outline-none ${
                  isRTL ? "ml-0 mr-2" : ""
                }`}
                disabled={saveJobMutation.isPending || removeJobMutation.isPending}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-5 w-5 text-primary" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {job.company} • {job.location} • {job.remote ? t("remote") : job.jobType ? t(job.jobType.toLowerCase().replace(/\s+/g, "")) : t("onSite")}
            </div>
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {job.description.length > 150
                ? `${job.description.substring(0, 150)}...`
                : job.description}
            </div>
            <div className={`mt-4 flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 space-x-4 ${
              isRTL ? "space-x-0 space-x-reverse space-x-4" : ""
            }`}>
              <div className="flex items-center">
                <Briefcase className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                <span>{t(job.jobType?.toLowerCase().replace(/\s+/g, "") || "fullTime")}</span>
              </div>
              {job.salary && (
                <div className="flex items-center">
                  <DollarSign className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                  <span>{job.salary}</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                <span>{formatTimeAgo(new Date(job.createdAt))}</span>
              </div>
              <div className="flex items-center">
                <MapPin className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                <span>{t("source", { source: job.source })}</span>
              </div>
            </div>
            <div className="mt-5">
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                <Button className="rounded-xl">
                  {t("applyNow")}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
