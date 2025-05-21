import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_CATEGORIES, JOB_TYPES, LOCATIONS, SALARY_RANGES, FilterParams } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";

interface JobFilterProps {
  onFilterChange: (filters: FilterParams) => void;
  currentFilters: FilterParams;
}

const FilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  jobType: z.string().optional(),
  location: z.string().optional(),
  remote: z.boolean().optional(),
  salary: z.string().optional(),
});

type FilterFormValues = z.infer<typeof FilterSchema>;

export function JobFilter({ onFilterChange, currentFilters }: JobFilterProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(FilterSchema),
    defaultValues: {
      search: currentFilters.search || "",
      category: currentFilters.category || "",
      jobType: currentFilters.jobType || "",
      location: currentFilters.location || "",
      remote: currentFilters.remote || false,
      salary: currentFilters.salary || "",
    },
  });

  const onSubmit = (data: FilterFormValues) => {
    setIsLoading(true);
    onFilterChange({
      ...currentFilters,
      ...data,
      page: 1, // Reset to first page when filters change
    });
    setIsLoading(false);
  };

  return (
    <Card className="bg-card-bg dark:bg-gray-800 rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t("filterJobs")}
        </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
            {/* Search */}
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("search")}</FormLabel>
                  <FormControl>
                    <div className="relative rounded-xl shadow-sm">
                      <div
                        className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                          isRTL ? "left-auto right-0 pl-0 pr-3" : ""
                        }`}
                      >
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <Input
                        className={`pl-10 pr-3 py-2 ${isRTL ? "pl-3 pr-10" : ""}`}
                        placeholder={t("searchJobs")}
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("category")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder={t("allCategories")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">{t("allCategories")}</SelectItem>
                      {JOB_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {t(category.toLowerCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Job Type */}
            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t("jobType")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="job-type-all" />
                        <label
                          htmlFor="job-type-all"
                          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                            isRTL ? "mr-2" : "ml-2"
                          }`}
                        >
                          {t("all")}
                        </label>
                      </div>
                      {JOB_TYPES.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <RadioGroupItem value={type} id={`job-type-${type.toLowerCase().replace(/\s+/g, "-")}`} />
                          <label
                            htmlFor={`job-type-${type.toLowerCase().replace(/\s+/g, "-")}`}
                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                              isRTL ? "mr-2" : "ml-2"
                            }`}
                          >
                            {t(type.toLowerCase().replace(/\s+/g, ""))}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("location")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder={t("allLocations")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">{t("allLocations")}</SelectItem>
                      {LOCATIONS.map((location) => (
                        <SelectItem key={location} value={location}>
                          {t(location.toLowerCase().replace(/\s+/g, ""))}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Remote Option */}
            <FormField
              control={form.control}
              name="remote"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {t("remoteJobsOnly")}
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Salary Range */}
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("salaryRange")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder={t("anySalary")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">{t("anySalary")}</SelectItem>
                      {SALARY_RANGES.map((range) => (
                        <SelectItem key={range} value={range}>
                          {t(range.toLowerCase().replace(/\s+/g, "").replace(/\$/g, ""))}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Apply Filters Button */}
            <Button
              type="submit"
              className="w-full rounded-xl"
              disabled={isLoading}
            >
              {t("applyFilters")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
