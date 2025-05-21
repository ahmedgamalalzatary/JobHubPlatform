import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { LanguageSwitch } from "./language-switch";
import { AuthButtons } from "./auth/auth-buttons";
import { LoginModal } from "./auth/login-modal";
import { SignupModal } from "./auth/signup-modal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ROUTES, API_ROUTES } from "@/lib/constants";
import { useLanguage } from "@/hooks/use-language";
import { AuthUser } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";

export function Navbar() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { isRTL } = useLanguage();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { data: user } = useQuery<AuthUser | null>({
    queryKey: [API_ROUTES.CURRENT_USER],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: notificationsCount = 0 } = useQuery<number>({
    queryKey: [API_ROUTES.NOTIFICATIONS + '/count'],
    enabled: !!user,
  });

  const handleLogout = async () => {
    await apiRequest('POST', API_ROUTES.LOGOUT);
    window.location.href = ROUTES.HOME;
  };

  const getInitials = (user?: AuthUser | null) => {
    if (!user) return 'G';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  const navItems = [
    { label: t('dashboard'), path: ROUTES.DASHBOARD },
    { label: t('jobListings'), path: ROUTES.JOBS },
    { label: t('savedJobs'), path: ROUTES.SAVED_JOBS },
    { label: t('jobSources'), path: ROUTES.JOB_SOURCES },
  ];

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href={ROUTES.HOME}>
                  <div className="flex items-center cursor-pointer">
                    <svg 
                      width="32" 
                      height="32" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-primary"
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
                    <span className="font-bold text-xl text-primary mx-2">JobHub</span>
                  </div>
                </Link>
              </div>
              <div 
                className={`hidden sm:ml-6 sm:flex sm:space-x-8 ${
                  isRTL ? 'sm:space-x-0 sm:space-x-reverse sm:ml-0 sm:mr-6' : ''
                }`}
              >
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <div
                      className={`${
                        location === item.path
                          ? 'border-primary text-gray-900 dark:text-white'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}
                    >
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className={`hidden sm:ml-6 sm:flex sm:items-center ${isRTL ? 'sm:ml-0 sm:mr-6' : ''}`}>
              <LanguageSwitch />

              {user && (
                <div className={`ml-3 relative ${isRTL ? 'ml-0 mr-3' : ''}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100"
                    aria-label={t('notifications')}
                  >
                    <Bell className="h-5 w-5" />
                    {notificationsCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute top-0 right-0 -mt-1 -mr-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]"
                      >
                        {notificationsCount}
                      </Badge>
                    )}
                  </Button>
                </div>
              )}

              {user ? (
                <div className={`ml-3 relative ${isRTL ? 'ml-0 mr-3' : ''}`}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative rounded-full p-0 h-8 w-8">
                        <Avatar className="h-8 w-8 rounded-full bg-primary">
                          <AvatarFallback className="text-xs font-medium leading-none text-white">
                            {getInitials(user)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={ROUTES.PROFILE}>
                        <DropdownMenuItem className="cursor-pointer">
                          {t('profile')}
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                        {t('logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <AuthButtons 
                  onLoginClick={() => setShowLoginModal(true)} 
                  onSignupClick={() => setShowSignupModal(true)} 
                />
              )}
            </div>
            <div className={`-mr-2 flex items-center sm:hidden ${isRTL ? 'mr-0 -ml-2' : ''}`}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {showMobileMenu ? (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`${
                      location === item.path
                        ? 'bg-gray-50 border-primary text-primary dark:bg-gray-800 dark:text-white'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer ${
                      isRTL ? 'border-l-0 border-r-4 pl-4 pr-3' : ''
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-4">
                {user ? (
                  <>
                    <div className="flex-shrink-0">
                      <Avatar className="h-10 w-10 rounded-full bg-primary">
                        <AvatarFallback className="text-sm font-medium leading-none text-white">
                          {getInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className={`ml-3 ${isRTL ? 'ml-0 mr-3' : ''}`}>
                      <div className="text-base font-medium text-gray-800 dark:text-white">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user.email}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-shrink-0">
                      <Avatar className="h-10 w-10 rounded-full bg-primary">
                        <AvatarFallback className="text-sm font-medium leading-none text-white">
                          G
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className={`ml-3 ${isRTL ? 'ml-0 mr-3' : ''}`}>
                      <div className="text-base font-medium text-gray-800 dark:text-white">{t('guestUser')}</div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('loginToAccess')}
                      </div>
                    </div>
                  </>
                )}
                {user && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`ml-auto flex-shrink-0 relative ${isRTL ? 'ml-0 mr-auto' : ''}`}
                    aria-label={t('notifications')}
                  >
                    <Bell className="h-5 w-5" />
                    {notificationsCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute top-0 right-0 -mt-1 -mr-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]"
                      >
                        {notificationsCount}
                      </Badge>
                    )}
                  </Button>
                )}
              </div>
              <div className="mt-3 space-y-1">
                {!user ? (
                  <>
                    <Button
                      variant="ghost"
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                      onClick={() => {
                        setShowLoginModal(true);
                        setShowMobileMenu(false);
                      }}
                    >
                      {t('login')}
                    </Button>
                    <Button
                      variant="ghost"
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                      onClick={() => {
                        setShowSignupModal(true);
                        setShowMobileMenu(false);
                      }}
                    >
                      {t('signup')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href={ROUTES.PROFILE}>
                      <div
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {t('profile')}
                      </div>
                    </Link>
                    <Button
                      variant="ghost"
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                      onClick={handleLogout}
                    >
                      {t('logout')}
                    </Button>
                  </>
                )}
                <LanguageSwitch isMobile />
              </div>
            </div>
          </div>
        )}
      </nav>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      <SignupModal open={showSignupModal} onOpenChange={setShowSignupModal} />
    </>
  );
}
