import { HeroSection } from "@/components/hero-section";
import { StatsSection } from "@/components/stats-section";
import { Features } from "@/components/features";
import { Testimonials } from "@/components/testimonials";
import { SourceForm } from "@/components/source-form";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/lib/constants";
import { JobList } from "@/components/job-list";
import { FilterParams } from "@/lib/types";

export default function Home() {
  const [jobFilters, setJobFilters] = useState<FilterParams>({
    page: 1,
    limit: 10,
    sortBy: "recent",
  });

  // Check if user is authenticated
  const { data: user } = useQuery({
    queryKey: [API_ROUTES.CURRENT_USER],
  });

  return (
    <>
      <HeroSection />
      <StatsSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <JobList 
          filters={jobFilters}
          onFilterChange={setJobFilters}
        />
      </div>

      <Features />
      <Testimonials />
      <SourceForm />
    </>
  );
}
