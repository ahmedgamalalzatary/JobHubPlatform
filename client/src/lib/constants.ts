// Constants for the JobHub app
export const APP_NAME = 'JobHub';

// API endpoints
export const API_ROUTES = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
  GOOGLE_AUTH: '/api/auth/google',
  CURRENT_USER: '/api/auth/me',
  
  JOBS: '/api/jobs',
  JOB: (id: number) => `/api/jobs/${id}`,
  
  SAVED_JOBS: '/api/saved-jobs',
  SAVED_JOB: (id: number) => `/api/saved-jobs/${id}`,
  
  JOB_SOURCES: '/api/job-sources',
  JOB_SOURCE: (id: number) => `/api/job-sources/${id}`,
  
  NOTIFICATIONS: '/api/notifications',
  NOTIFICATION: (id: number) => `/api/notifications/${id}`,
  MARK_READ: (id: number) => `/api/notifications/${id}/read`,
};

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  JOBS: '/jobs',
  SAVED_JOBS: '/saved-jobs',
  JOB_SOURCES: '/job-sources',
  PROFILE: '/profile',
  JOB_DETAILS: (id: number) => `/jobs/${id}`,
};

// Job stats
export const JOB_STATS = {
  TOTAL_SOURCES: '50+',
  ACTIVE_LISTINGS: '10,000+',
  COUNTRIES_COVERED: '22',
};

// Testimonials
export const TESTIMONIALS = [
  {
    id: 1,
    name: { en: 'Sarah Ahmed', ar: 'سارة أحمد' },
    role: { en: 'UI Designer', ar: 'مصممة واجهة مستخدم' },
    content: {
      en: 'JobHub helped me find a remote position that perfectly matched my skills and preferences. The bilingual support was incredibly helpful!',
      ar: 'ساعدني JobHub في العثور على وظيفة عن بعد تتناسب تمامًا مع مهاراتي وتفضيلاتي. كان الدعم ثنائي اللغة مفيدًا بشكل لا يصدق!'
    },
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80',
    rating: 5
  },
  {
    id: 2,
    name: { en: 'Mohammad Khalid', ar: 'محمد خالد' },
    role: { en: 'Software Engineer', ar: 'مهندس برمجيات' },
    content: {
      en: 'I was struggling to find tech opportunities in my region until I discovered JobHub. The aggregated listings from multiple platforms saved me countless hours.',
      ar: 'كنت أعاني من إيجاد فرص تقنية في منطقتي حتى اكتشفت JobHub. وفرت لي القوائم المجمعة من منصات متعددة ساعات لا حصر لها.'
    },
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80',
    rating: 4.5
  },
  {
    id: 3,
    name: { en: 'Layla Nasser', ar: 'ليلى ناصر' },
    role: { en: 'Marketing Specialist', ar: 'أخصائية تسويق' },
    content: {
      en: 'The job alerts feature helped me stay on top of new opportunities in my field. I found my current role within just two weeks of using JobHub!',
      ar: 'ساعدتني ميزة تنبيهات الوظائف على متابعة الفرص الجديدة في مجالي. وجدت وظيفتي الحالية خلال أسبوعين فقط من استخدام JobHub!'
    },
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80',
    rating: 5
  }
];

// Features
export const FEATURES = [
  {
    id: 1,
    icon: 'ri-global-line',
    title: { en: 'Aggregated Job Listings', ar: 'قوائم وظائف مجمعة' },
    description: {
      en: 'Access thousands of job listings from multiple sources in one place, saving you time and effort.',
      ar: 'الوصول إلى آلاف الوظائف من مصادر متعددة في مكان واحد، مما يوفر لك الوقت والجهد.'
    }
  },
  {
    id: 2,
    icon: 'ri-translate-2',
    title: { en: 'Bilingual Support', ar: 'دعم ثنائي اللغة' },
    description: {
      en: 'Full Arabic and English language support to help you navigate job opportunities in your preferred language.',
      ar: 'دعم كامل باللغتين العربية والإنجليزية لمساعدتك في استكشاف فرص العمل بلغتك المفضلة.'
    }
  },
  {
    id: 3,
    icon: 'ri-notification-3-line',
    title: { en: 'Job Alerts', ar: 'تنبيهات الوظائف' },
    description: {
      en: 'Receive personalized job alerts based on your skills, preferences, and job search criteria.',
      ar: 'احصل على تنبيهات وظائف مخصصة بناءً على مهاراتك وتفضيلاتك ومعايير البحث عن وظيفة.'
    }
  },
  {
    id: 4,
    icon: 'ri-community-line',
    title: { en: 'Community Contributions', ar: 'مساهمات المجتمع' },
    description: {
      en: 'Submit new job sources and help expand our database to benefit the entire community of job seekers.',
      ar: 'قدم مصادر وظائف جديدة وساعد في توسيع قاعدة بياناتنا لصالح مجتمع الباحثين عن عمل بأكمله.'
    }
  }
];
