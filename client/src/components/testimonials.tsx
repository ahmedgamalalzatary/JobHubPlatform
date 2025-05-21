import { useTranslation } from "react-i18next";
import { TESTIMONIALS } from "@/lib/constants";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={i} className="ri-star-fill text-yellow-400"></i>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <i key="half" className="ri-star-half-fill text-yellow-400"></i>
      );
    }

    return stars;
  };

  return (
    <div className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t("whatJobSeekersSay")}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            {t("testimonialsDescription")}
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <Card key={testimonial.id} className="bg-card-bg dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={testimonial.avatar}
                      alt={`${testimonial.name[language]} avatar`}
                    />
                    <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {testimonial.name[language]}
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400">
                        {t(testimonial.role[language])}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      {testimonial.content[language]}
                    </p>
                  </div>
                  <div className="mt-4 flex">
                    {renderStars(testimonial.rating)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
