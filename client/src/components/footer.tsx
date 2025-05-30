import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/lib/constants";
import { useLanguage } from "@/hooks/use-language";

export function Footer() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path 
                  d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-bold text-xl text-white mx-2">JobHub</span>
            </div>
            <p className="mt-4 text-base text-gray-300">
              {t("makingJobEasier")}
            </p>
            <div 
              className={`mt-6 flex space-x-6 ${
                isRTL ? "space-x-0 space-x-reverse space-x-6" : ""
              }`}
            >
              <div className="text-gray-400 hover:text-gray-300 cursor-pointer">
                <span className="sr-only">Facebook</span>
                <svg 
                  className="h-6 w-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24" 
                  aria-hidden="true"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              <div className="text-gray-400 hover:text-gray-300 cursor-pointer">
                <span className="sr-only">Instagram</span>
                <svg 
                  className="h-6 w-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24" 
                  aria-hidden="true"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              <div className="text-gray-400 hover:text-gray-300 cursor-pointer">
                <span className="sr-only">Twitter</span>
                <svg 
                  className="h-6 w-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24" 
                  aria-hidden="true"
                >
                  <path 
                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" 
                  />
                </svg>
              </div>
              <div className="text-gray-400 hover:text-gray-300 cursor-pointer">
                <span className="sr-only">LinkedIn</span>
                <svg 
                  className="h-6 w-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24" 
                  aria-hidden="true"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              {t("features")}
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href={ROUTES.JOBS}>
                  <div className="text-base text-gray-300 hover:text-white cursor-pointer">
                    {t("jobSearch")}
                  </div>
                </Link>
              </li>
              <li>
                <div className="text-base text-gray-300 hover:text-white cursor-pointer">
                  {t("jobAlerts")}
                </div>
              </li>
              <li>
                <Link href={ROUTES.SAVED_JOBS}>
                  <div className="text-base text-gray-300 hover:text-white cursor-pointer">
                    {t("savedJobs")}
                  </div>
                </Link>
              </li>
              <li>
                <Link href={ROUTES.JOB_SOURCES}>
                  <div className="text-base text-gray-300 hover:text-white cursor-pointer">
                    {t("submitJobSource")}
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              {t("company")}
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <div className="text-base text-gray-300 hover:text-white cursor-pointer">
                  {t("aboutUs")}
                </div>
              </li>
              <li>
                <div className="text-base text-gray-300 hover:text-white cursor-pointer">
                  {t("blog")}
                </div>
              </li>
              <li>
                <div className="text-base text-gray-300 hover:text-white cursor-pointer">
                  {t("partners")}
                </div>
              </li>
              <li>
                <div className="text-base text-gray-300 hover:text-white cursor-pointer">
                  {t("contactUs")}
                </div>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              {t("legal")}
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <div className="text-base text-gray-300 hover:text-white cursor-pointer">
                  {t("privacyPolicy")}
                </div>
              </li>
              <li>
                <div className="text-base text-gray-300 hover:text-white cursor-pointer">
                  {t("terms")}
                </div>
              </li>
              <li>
                <div className="text-base text-gray-300 hover:text-white cursor-pointer">
                  {t("cookiePolicy")}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">
            {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
