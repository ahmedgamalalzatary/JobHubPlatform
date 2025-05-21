import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enResources = {
  translation: {
    // Navbar
    "dashboard": "Dashboard",
    "jobListings": "Job Listings",
    "savedJobs": "Saved Jobs",
    "jobSources": "Job Sources",
    "login": "Log in",
    "signup": "Sign up",
    "logout": "Logout",
    "languages": {
      "en": "EN",
      "ar": "AR"
    },
    "guestUser": "Guest User",
    "loginToAccess": "Login to access your account",

    // Auth
    "emailAddress": "Email address",
    "password": "Password",
    "confirmPassword": "Confirm password",
    "rememberMe": "Remember me",
    "forgotPassword": "Forgot your password?",
    "signIn": "Sign in",
    "signInWithGoogle": "Sign in with Google",
    "createAccount": "Create an account",
    "firstName": "First name",
    "lastName": "Last name",
    "signUp": "Sign up",
    "signUpWithGoogle": "Sign up with Google",
    "orContinueWith": "Or continue with",
    "agreeTerms": "I agree to the",
    "terms": "Terms",
    "and": "and",
    "privacyPolicy": "Privacy Policy",
    "close": "Close",
    "loginToAccount": "Log in to your account",
    
    // Hero
    "findDreamJob": "Find Your Dream Job in the Arab World",
    "heroDescription": "JobHub aggregates job listings from multiple sources to help Arabic-speaking professionals find the best opportunities.",
    "browseJobs": "Browse Jobs",
    "howItWorks": "How it works",
    
    // Stats
    "totalJobSources": "Total Job Sources",
    "activeJobListings": "Active Job Listings",
    "arabCountriesCovered": "Arab Countries Covered",
    
    // Job Listings
    "latestJobOpportunities": "Latest Job Opportunities",
    "browseThousands": "Browse through thousands of job openings updated daily from multiple sources.",
    "filterJobs": "Filter Jobs",
    "search": "Search",
    "searchJobs": "Search jobs...",
    "category": "Category",
    "allCategories": "All Categories",
    "engineering": "Engineering",
    "design": "Design",
    "marketing": "Marketing",
    "finance": "Finance",
    "sales": "Sales",
    "customerService": "Customer Service",
    "it": "IT",
    "jobType": "Job Type",
    "all": "All",
    "fullTime": "Full Time",
    "partTime": "Part Time",
    "contract": "Contract",
    "freelance": "Freelance",
    "location": "Location",
    "allLocations": "All Locations",
    "uae": "United Arab Emirates",
    "saudiArabia": "Saudi Arabia",
    "egypt": "Egypt",
    "jordan": "Jordan",
    "lebanon": "Lebanon",
    "qatar": "Qatar",
    "kuwait": "Kuwait",
    "bahrain": "Bahrain",
    "oman": "Oman",
    "remoteJobsOnly": "Remote Jobs Only",
    "salaryRange": "Salary Range",
    "anySalary": "Any Salary",
    "under30k": "Under $30k",
    "30kTo50k": "$30k - $50k",
    "50kTo80k": "$50k - $80k",
    "80kTo100k": "$80k - $100k",
    "100kPlus": "$100k+",
    "applyFilters": "Apply Filters",
    
    // Job Listings
    "availableJobs": "Available Jobs",
    "sortBy": "Sort by:",
    "mostRecent": "Most Recent",
    "highestSalary": "Highest Salary",
    "mostRelevant": "Most Relevant",
    "allJobs": "All Jobs",
    "recommended": "Recommended",
    "saved": "Saved",
    "applied": "Applied",
    "remote": "Remote",
    "onSite": "On-site",
    "hybrid": "Hybrid",
    "postedDaysAgo": "Posted {{days}} days ago",
    "postedToday": "Posted today",
    "postedWeekAgo": "Posted {{weeks}} week ago",
    "postedWeeksAgo": "Posted {{weeks}} weeks ago",
    "source": "Source: {{source}}",
    "applyNow": "Apply Now",
    "showing": "Showing",
    "to": "to",
    "of": "of",
    "results": "results",
    "previous": "Previous",
    "next": "Next",
    
    // Why JobHub
    "whyJobhub": "Why Job Seekers Choose JobHub",
    "whyDescription": "Discover the benefits that make JobHub the preferred platform for Arabic-speaking professionals.",
    "aggregatedListings": "Aggregated Job Listings",
    "aggregatedDescription": "Access thousands of job listings from multiple sources in one place, saving you time and effort.",
    "bilingualSupport": "Bilingual Support",
    "bilingualDescription": "Full Arabic and English language support to help you navigate job opportunities in your preferred language.",
    "jobAlerts": "Job Alerts",
    "jobAlertsDescription": "Receive personalized job alerts based on your skills, preferences, and job search criteria.",
    "communityContributions": "Community Contributions",
    "communityDescription": "Submit new job sources and help expand our database to benefit the entire community of job seekers.",
    
    // Testimonials
    "whatJobSeekersSay": "What Job Seekers Say About Us",
    "testimonialsDescription": "Hear from professionals who found their dream jobs through our platform.",
    "uiDesigner": "UI Designer",
    "softwareEngineer": "Software Engineer",
    "marketingSpecialist": "Marketing Specialist",
    
    // Add Job Source
    "helpUsGrow": "Help Us Grow: Submit a Job Source",
    "helpDescription": "Know a great job board or company career page that we should include? Let us know!",
    "sourceName": "Source Name",
    "sourceNamePlaceholder": "e.g., CompanyX Careers",
    "sourceURL": "Source URL",
    "sourceCategory": "Category",
    "jobBoard": "Job Board",
    "companyCareerPage": "Company Career Page",
    "recruitmentAgency": "Recruitment Agency",
    "governmentJobsPortal": "Government Jobs Portal",
    "other": "Other",
    "description": "Description",
    "descriptionPlaceholder": "Brief description of this job source...",
    "yourEmail": "Your Email (optional)",
    "submitJobSource": "Submit Job Source",
    
    // Footer
    "makingJobEasier": "Making job searching easier for Arabic-speaking professionals.",
    "features": "Features",
    "jobSearch": "Job Search",
    "company": "Company",
    "aboutUs": "About Us",
    "blog": "Blog",
    "partners": "Partners",
    "contactUs": "Contact Us",
    "legal": "Legal",
    "cookiePolicy": "Cookie Policy",
    "allRightsReserved": "© 2023 JobHub. All rights reserved.",

    // Pagination
    "page": "Page",
    "totalPages": "of {{pages}}"
  }
};

// Arabic translations
const arResources = {
  translation: {
    // Navbar
    "dashboard": "لوحة التحكم",
    "jobListings": "قائمة الوظائف",
    "savedJobs": "الوظائف المحفوظة",
    "jobSources": "مصادر الوظائف",
    "login": "تسجيل الدخول",
    "signup": "إنشاء حساب",
    "logout": "تسجيل الخروج",
    "languages": {
      "en": "EN",
      "ar": "AR"
    },
    "guestUser": "مستخدم زائر",
    "loginToAccess": "سجل الدخول للوصول إلى حسابك",

    // Auth
    "emailAddress": "البريد الإلكتروني",
    "password": "كلمة المرور",
    "confirmPassword": "تأكيد كلمة المرور",
    "rememberMe": "تذكرني",
    "forgotPassword": "نسيت كلمة المرور؟",
    "signIn": "تسجيل الدخول",
    "signInWithGoogle": "تسجيل الدخول باستخدام Google",
    "createAccount": "إنشاء حساب جديد",
    "firstName": "الاسم الأول",
    "lastName": "اسم العائلة",
    "signUp": "إنشاء حساب",
    "signUpWithGoogle": "التسجيل باستخدام Google",
    "orContinueWith": "أو استمر باستخدام",
    "agreeTerms": "أوافق على",
    "terms": "الشروط",
    "and": "و",
    "privacyPolicy": "سياسة الخصوصية",
    "close": "إغلاق",
    "loginToAccount": "تسجيل الدخول إلى حسابك",
    
    // Hero
    "findDreamJob": "ابحث عن وظيفة أحلامك في العالم العربي",
    "heroDescription": "يجمع JobHub قوائم الوظائف من مصادر متعددة لمساعدة المهنيين الناطقين بالعربية في العثور على أفضل الفرص.",
    "browseJobs": "تصفح الوظائف",
    "howItWorks": "كيف يعمل",
    
    // Stats
    "totalJobSources": "إجمالي مصادر الوظائف",
    "activeJobListings": "قوائم الوظائف النشطة",
    "arabCountriesCovered": "الدول العربية المشمولة",
    
    // Job Listings
    "latestJobOpportunities": "أحدث فرص العمل",
    "browseThousands": "تصفح آلاف الوظائف الشاغرة التي يتم تحديثها يوميًا من مصادر متعددة.",
    "filterJobs": "تصفية الوظائف",
    "search": "بحث",
    "searchJobs": "البحث عن وظائف...",
    "category": "الفئة",
    "allCategories": "كل الفئات",
    "engineering": "هندسة",
    "design": "تصميم",
    "marketing": "تسويق",
    "finance": "مالية",
    "sales": "مبيعات",
    "customerService": "خدمة العملاء",
    "it": "تكنولوجيا المعلومات",
    "jobType": "نوع الوظيفة",
    "all": "الكل",
    "fullTime": "دوام كامل",
    "partTime": "دوام جزئي",
    "contract": "عقد",
    "freelance": "عمل حر",
    "location": "الموقع",
    "allLocations": "كل المواقع",
    "uae": "الإمارات العربية المتحدة",
    "saudiArabia": "المملكة العربية السعودية",
    "egypt": "مصر",
    "jordan": "الأردن",
    "lebanon": "لبنان",
    "qatar": "قطر",
    "kuwait": "الكويت",
    "bahrain": "البحرين",
    "oman": "عمان",
    "remoteJobsOnly": "وظائف عن بعد فقط",
    "salaryRange": "نطاق الراتب",
    "anySalary": "أي راتب",
    "under30k": "أقل من 30 ألف",
    "30kTo50k": "30 - 50 ألف",
    "50kTo80k": "50 - 80 ألف",
    "80kTo100k": "80 - 100 ألف",
    "100kPlus": "100 ألف+",
    "applyFilters": "تطبيق الفلاتر",
    
    // Job Listings
    "availableJobs": "الوظائف المتاحة",
    "sortBy": "ترتيب حسب:",
    "mostRecent": "الأحدث",
    "highestSalary": "الراتب الأعلى",
    "mostRelevant": "الأكثر صلة",
    "allJobs": "كل الوظائف",
    "recommended": "موصى بها",
    "saved": "محفوظة",
    "applied": "تم التقديم",
    "remote": "عن بعد",
    "onSite": "في المكتب",
    "hybrid": "هجين",
    "postedDaysAgo": "تم النشر منذ {{days}} أيام",
    "postedToday": "تم النشر اليوم",
    "postedWeekAgo": "تم النشر منذ أسبوع",
    "postedWeeksAgo": "تم النشر منذ {{weeks}} أسابيع",
    "source": "المصدر: {{source}}",
    "applyNow": "تقدم الآن",
    "showing": "عرض",
    "to": "إلى",
    "of": "من",
    "results": "نتيجة",
    "previous": "السابق",
    "next": "التالي",
    
    // Why JobHub
    "whyJobhub": "لماذا يختار الباحثون عن عمل JobHub",
    "whyDescription": "اكتشف المزايا التي تجعل JobHub المنصة المفضلة للمهنيين الناطقين بالعربية.",
    "aggregatedListings": "قوائم وظائف مجمعة",
    "aggregatedDescription": "الوصول إلى آلاف الوظائف من مصادر متعددة في مكان واحد، مما يوفر لك الوقت والجهد.",
    "bilingualSupport": "دعم ثنائي اللغة",
    "bilingualDescription": "دعم كامل باللغتين العربية والإنجليزية لمساعدتك في استكشاف فرص العمل بلغتك المفضلة.",
    "jobAlerts": "تنبيهات الوظائف",
    "jobAlertsDescription": "احصل على تنبيهات وظائف مخصصة بناءً على مهاراتك وتفضيلاتك ومعايير البحث عن وظيفة.",
    "communityContributions": "مساهمات المجتمع",
    "communityDescription": "قدم مصادر وظائف جديدة وساعد في توسيع قاعدة بياناتنا لصالح مجتمع الباحثين عن عمل بأكمله.",
    
    // Testimonials
    "whatJobSeekersSay": "ماذا يقول الباحثون عن عمل عنا",
    "testimonialsDescription": "اسمع من المهنيين الذين وجدوا وظائف أحلامهم من خلال منصتنا.",
    "uiDesigner": "مصممة واجهة مستخدم",
    "softwareEngineer": "مهندس برمجيات",
    "marketingSpecialist": "أخصائية تسويق",
    
    // Add Job Source
    "helpUsGrow": "ساعدنا في النمو: أضف مصدر وظائف",
    "helpDescription": "هل تعرف لوحة وظائف رائعة أو صفحة وظائف شركة يجب أن نضيفها؟ أخبرنا!",
    "sourceName": "اسم المصدر",
    "sourceNamePlaceholder": "مثال: وظائف الشركة س",
    "sourceURL": "رابط المصدر",
    "sourceCategory": "الفئة",
    "jobBoard": "لوحة وظائف",
    "companyCareerPage": "صفحة وظائف شركة",
    "recruitmentAgency": "وكالة توظيف",
    "governmentJobsPortal": "بوابة وظائف حكومية",
    "other": "أخرى",
    "description": "الوصف",
    "descriptionPlaceholder": "وصف موجز لمصدر الوظائف هذا...",
    "yourEmail": "بريدك الإلكتروني (اختياري)",
    "submitJobSource": "إرسال مصدر الوظائف",
    
    // Footer
    "makingJobEasier": "نجعل البحث عن وظائف أسهل للمهنيين الناطقين بالعربية.",
    "features": "الميزات",
    "jobSearch": "البحث عن وظائف",
    "company": "الشركة",
    "aboutUs": "من نحن",
    "blog": "المدونة",
    "partners": "الشركاء",
    "contactUs": "اتصل بنا",
    "legal": "قانوني",
    "cookiePolicy": "سياسة ملفات تعريف الارتباط",
    "allRightsReserved": "© 2023 JobHub. جميع الحقوق محفوظة.",

    // Pagination
    "page": "صفحة",
    "totalPages": "من {{pages}}"
  }
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: enResources,
      ar: arResources
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

// Make sure initialization is completed
export const i18nInstance = i18n;
export default i18n;
