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

interface SignupFormProps {
  onSignupSuccess?: () => void;
}

const SignupSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof SignupSchema>;

export function SignupForm({ onSignupSuccess }: SignupFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSigningUp, setIsSigningUp] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormValues) => {
      setIsSigningUp(true);
      try {
        const { confirmPassword, terms, ...signupData } = data;
        const response = await apiRequest("POST", API_ROUTES.SIGNUP, signupData);
        return await response.json();
      } finally {
        setIsSigningUp(false);
      }
    },
    onSuccess: () => {
      toast({
        title: t("signupSuccess"),
        description: t("accountCreated"),
      });
      if (onSignupSuccess) {
        onSignupSuccess();
      }
      window.location.reload();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: t("signupFailed"),
        description: error.message,
      });
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    signupMutation.mutate(data);
  };

  const handleGoogleSignup = () => {
    window.location.href = API_ROUTES.GOOGLE_AUTH;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("firstName")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("firstName")}
                    className="rounded-xl"
                    autoComplete="given-name"
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
                    {...field}
                    placeholder={t("lastName")}
                    className="rounded-xl"
                    autoComplete="family-name"
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
                  {...field}
                  type="email"
                  placeholder="name@example.com"
                  className="rounded-xl"
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="username"
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
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("confirmPassword")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl"
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="terms"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-medium" htmlFor="terms">
                  {t("agreeTerms")}{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary"
                  >
                    {t("terms")}
                  </Button>{" "}
                  {t("and")}{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary"
                  >
                    {t("privacyPolicy")}
                  </Button>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full rounded-xl"
          disabled={isSigningUp || signupMutation.isPending}
        >
          {t("signUp")}
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
          onClick={handleGoogleSignup}
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
          {t("signUpWithGoogle")}
        </Button>
      </form>
    </Form>
  );
}
