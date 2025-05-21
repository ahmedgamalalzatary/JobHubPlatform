import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { API_ROUTES, ROUTES } from "@/lib/constants";
import { JobWithSaved, Notification } from "@/lib/types";
import { LoginModal } from "@/components/auth/login-modal";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Bell, BriefcaseIcon, BarChart, BookmarkIcon, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobCard } from "@/components/job-card";

export default function Dashboard() {
  const { t } = useTranslation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check if user is authenticated
  const { data: user } = useQuery({
    queryKey: [API_ROUTES.CURRENT_USER],
  });

  const isAuthenticated = !!user;

  // Fetch user data if authenticated
  const { data: savedJobs, isLoading: savedJobsLoading } = useQuery({
    queryKey: [API_ROUTES.SAVED_JOBS, { limit: 3 }],
    enabled: isAuthenticated,
  });

  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: [API_ROUTES.NOTIFICATIONS],
    enabled: isAuthenticated,
  });

  const { data: recentJobs, isLoading: recentJobsLoading } = useQuery({
    queryKey: [API_ROUTES.JOBS, { limit: 3, sortBy: "recent" }],
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="bg-card-bg dark:bg-gray-800 rounded-2xl shadow-sm">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("loginRequired")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              {t("dashboardDescription")}
            </p>
            <Button
              onClick={() => setShowLoginModal(true)}
            >
              {t("login")}
            </Button>

            <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t("dashboard")}
          </h2>
          <p className="mt-1 text-lg text-gray-500 dark:text-gray-400">
            {t("welcomeBack", { name: user?.firstName || user?.username })}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href={ROUTES.JOBS}>
            <Button className="rounded-xl">
              <BriefcaseIcon className="mr-2 h-4 w-4" />
              {t("searchJobs")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("savedJobs")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {savedJobsLoading ? "-" : savedJobs?.total || 0}
              </div>
              <BookmarkIcon className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("applicationsThisWeek")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">0</div>
              <BriefcaseIcon className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("notifications")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {notificationsLoading ? "-" : notifications?.filter((n: Notification) => !n.read).length || 0}
              </div>
              <Bell className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("jobActivity")}</CardTitle>
              <CardDescription>{t("recentJobActivity")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="recent">
                <TabsList className="mb-4">
                  <TabsTrigger value="recent">{t("recentJobs")}</TabsTrigger>
                  <TabsTrigger value="recommended">{t("recommended")}</TabsTrigger>
                  <TabsTrigger value="saved">{t("saved")}</TabsTrigger>
                </TabsList>

                <TabsContent value="recent">
                  {recentJobsLoading ? (
                    <div className="animate-pulse flex flex-col gap-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-xl"></div>
                      ))}
                    </div>
                  ) : recentJobs?.data?.length === 0 ? (
                    <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                      {t("noJobsFound")}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentJobs?.data.slice(0, 3).map((job: JobWithSaved) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          isAuthenticated={isAuthenticated}
                          onLoginPrompt={() => setShowLoginModal(true)}
                        />
                      ))}
                      <div className="text-center pt-4">
                        <Link href={ROUTES.JOBS}>
                          <Button variant="outline">
                            {t("viewAllJobs")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="recommended">
                  <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                    {t("noRecommendedJobs")}
                  </div>
                </TabsContent>

                <TabsContent value="saved">
                  {savedJobsLoading ? (
                    <div className="animate-pulse flex flex-col gap-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-xl"></div>
                      ))}
                    </div>
                  ) : !savedJobs?.data || savedJobs.data.length === 0 ? (
                    <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                      {t("noSavedJobs")}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedJobs.data.map((job: JobWithSaved) => (
                        <JobCard
                          key={job.id}
                          job={{ ...job, isSaved: true }}
                          isAuthenticated={isAuthenticated}
                          onLoginPrompt={() => setShowLoginModal(true)}
                        />
                      ))}
                      <div className="text-center pt-4">
                        <Link href={ROUTES.SAVED_JOBS}>
                          <Button variant="outline">
                            {t("viewAllSavedJobs")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t("notifications")}</CardTitle>
              <CardDescription>{t("recentNotifications")}</CardDescription>
            </CardHeader>
            <CardContent>
              {notificationsLoading ? (
                <div className="animate-pulse flex flex-col gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-200 dark:bg-gray-700 h-14 rounded-xl"></div>
                  ))}
                </div>
              ) : !notifications || notifications.length === 0 ? (
                <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                  {t("noNotifications")}
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.slice(0, 5).map((notification: Notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg ${
                        notification.read
                          ? "bg-gray-50 dark:bg-gray-800"
                          : "bg-blue-50 dark:bg-blue-900/20"
                      }`}
                    >
                      <div className="flex gap-3">
                        <Bell className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium text-sm">
                            {notification.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-400">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
