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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { API_ROUTES } from "@/lib/constants";
import { SOURCE_CATEGORIES } from "@/lib/types";

const JobSourceSchema = z.object({
  name: z.string().min(1, { message: "Source name is required" }),
  url: z.string().url({ message: "Please enter a valid URL" }),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().optional(),
  submitterEmail: z.string().email({ message: "Invalid email" }).optional().or(z.literal("")),
});

type JobSourceFormValues = z.infer<typeof JobSourceSchema>;

export function SourceForm() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const form = useForm<JobSourceFormValues>({
    resolver: zodResolver(JobSourceSchema),
    defaultValues: {
      name: "",
      url: "",
      category: "",
      description: "",
      submitterEmail: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: JobSourceFormValues) => {
      const response = await apiRequest("POST", API_ROUTES.JOB_SOURCES, data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your job source submission has been received. Thank you for your contribution!",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message,
      });
    },
  });

  const onSubmit = (data: JobSourceFormValues) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t("helpUsGrow")}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            {t("helpDescription")}
          </p>
        </div>

        <div className="mt-10 max-w-xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("sourceName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("sourceNamePlaceholder")}
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
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("sourceURL")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/careers"
                        type="url"
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("sourceCategory")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder={t("selectCategory")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SOURCE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {t(category.toLowerCase().replace(/\s+/g, ""))}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("descriptionPlaceholder")}
                        className="rounded-xl"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="submitterEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("yourEmail")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        type="email"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full rounded-xl"
                disabled={submitMutation.isPending}
              >
                {t("submitJobSource")}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
