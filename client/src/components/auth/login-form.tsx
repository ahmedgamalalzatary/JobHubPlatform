import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { API_ROUTES } from "@/lib/constants";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const LoginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      setIsLoggingIn(true);
      try {
        const response = await apiRequest("POST", API_ROUTES.LOGIN, data);
        return await response.json();
      } finally {
        setIsLoggingIn(false);
      }
    },
    onSuccess: () => {
      toast({
        title: t("loginSuccess"),
        description: t("welcomeBack"),
      });
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      window.location.reload();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: t("loginFailed"),
        description: error.message,
      });
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const handleGoogleLogin = () => {
    window.location.href = API_ROUTES.GOOGLE_AUTH;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("emailAddress")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="name@example.com"
                  className="rounded-xl"
                  autoComplete="username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl"
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="remember-me"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm" htmlFor="remember-me">
                    {t("rememberMe")}
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button variant="link" className="p-0 h-auto text-primary">
            {t("forgotPassword")}
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full rounded-xl"
          disabled={isLoggingIn || loginMutation.isPending}
        >
          {t("signIn")}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 dark:bg-gray-900">
              {t("orContinueWith")}
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full rounded-xl"
          onClick={handleGoogleLogin}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-2"
          >
            <path
              d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C8.849 2 5.58 4.167 3.931 7.214a10.017 10.017 0 000 9.576c1.649 3.047 4.909 5.21 8.614 5.21 4.908 0 9.023-3.464 9.023-9.544a9.86 9.86 0 00-.16-1.791l-8.863-.426z"
            />
          </svg>
          {t("signInWithGoogle")}
        </Button>
      </form>
    </Form>
  );
}
