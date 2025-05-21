import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { useLanguage } from "@/hooks/use-language";

export function HeroSection() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className="gradient-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className={`${isRTL ? "order-2 lg:order-2" : "order-2 lg:order-1"}`}>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t("findDreamJob")}
            </h1>
            <p className="mt-4 text-lg text-indigo-100">
              {t("heroDescription")}
            </p>
            <div 
              className={`mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 ${
                isRTL ? "sm:space-x-0 sm:space-x-reverse sm:space-x-4" : "sm:space-x-4"
              }`}
            >
              <Link href={ROUTES.JOBS}>
                <Button size="lg" className="rounded-xl">
                  {t("browseJobs")}
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="secondary" 
                className="rounded-xl bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
              >
                {t("howItWorks")}
              </Button>
            </div>
          </div>
          <div 
            className={`lg:col-span-1 ${
              isRTL ? "order-1 lg:order-1" : "order-1 lg:order-2"
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80"
              alt="Team of professionals working together"
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
