import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoginModal } from "@/components/auth/login-modal";
import { API_ROUTES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/use-language";

const ProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  preferredLanguage: z.string(),
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

export default function Profile() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check if user is authenticated
  const { data: user, isLoading } = useQuery({
    queryKey: [API_ROUTES.CURRENT_USER],
  });

  const isAuthenticated = !!user;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      preferredLanguage: user?.preferredLanguage || language,
    },
    values: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      preferredLanguage: user?.preferredLanguage || language,
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const response = await apiRequest("PATCH", "/api/profile", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("profileUpdated"),
        description: t("profileUpdatedDescription"),
      });
      queryClient.invalidateQueries({ queryKey: [API_ROUTES.CURRENT_USER] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: t("updateFailed"),
        description: error.message,
      });
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  const getInitials = () => {
    if (!user) return "U";
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="bg-card-bg dark:bg-gray-800 rounded-2xl shadow-sm">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("loginRequired")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              {t("profilePageDescription")}
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t("profile")}
          </h2>
          <p className="mt-1 text-lg text-gray-500 dark:text-gray-400">
            {t("manageYourProfile")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4 bg-primary">
                  <AvatarFallback className="text-xl font-medium leading-none text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user?.firstName
                    ? `${user.firstName} ${user.lastName || ""}`
                    : user?.username}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>{t("accountSettings")}</CardTitle>
              <CardDescription>{t("updateYourAccountSettings")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general">
                <TabsList className="mb-4">
                  <TabsTrigger value="general">{t("general")}</TabsTrigger>
                  <TabsTrigger value="password">{t("password")}</TabsTrigger>
                  <TabsTrigger value="notifications">{t("notifications")}</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("firstName")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("firstName")}
                                  className="rounded-xl"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("lastName")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("lastName")}
                                  className="rounded-xl"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("emailAddress")}</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="name@example.com"
                                className="rounded-xl"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferredLanguage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("preferredLanguage")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-xl">
                                  <SelectValue placeholder={t("selectLanguage")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="ar">العربية</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="rounded-xl"
                        disabled={updateProfileMutation.isPending}
                      >
                        {t("saveChanges")}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="password">
                  <div className="space-y-4">
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("passwordChangeDescription")}
                    </p>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="current-password">
                          {t("currentPassword")}
                        </label>
                        <Input
                          id="current-password"
                          type="password"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="new-password">
                          {t("newPassword")}
                        </label>
                        <Input
                          id="new-password"
                          type="password"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="confirm-password">
                          {t("confirmPassword")}
                        </label>
                        <Input
                          id="confirm-password"
                          type="password"
                          className="rounded-xl"
                        />
                      </div>
                      <Button className="rounded-xl">{t("updatePassword")}</Button>
                    </form>
                  </div>
                </TabsContent>

                <TabsContent value="notifications">
                  <div className="space-y-4">
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("notificationSettingsDescription")}
                    </p>
                    {/* Notification settings will go here */}
                    <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                      {t("comingSoon")}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
