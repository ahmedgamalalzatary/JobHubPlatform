import { Job, JobSource, SavedJob, User } from "@shared/schema";

export interface FilterParams {
  search?: string;
  category?: string;
  jobType?: string;
  location?: string;
  remote?: boolean;
  salary?: string;
  page: number;
  limit: number;
  sortBy?: 'recent' | 'salary' | 'relevance';
}

export interface JobWithSaved extends Job {
  isSaved?: boolean;
}

export interface AuthCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export type AuthUser = Pick<User, 'id' | 'username' | 'email' | 'firstName' | 'lastName' | 'preferredLanguage'>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Common category options
export const JOB_CATEGORIES = [
  'Engineering',
  'Design',
  'Marketing',
  'Finance',
  'Sales',
  'Customer Service',
  'IT',
  'Human Resources',
  'Legal',
  'Project Management',
  'Language & Translation',
  'Other'
];

export const JOB_TYPES = [
  'Full Time',
  'Part Time',
  'Contract',
  'Freelance'
];

export const LOCATIONS = [
  'United Arab Emirates',
  'Saudi Arabia',
  'Egypt',
  'Jordan',
  'Lebanon',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman'
];

export const SALARY_RANGES = [
  'Any Salary',
  'Under $30k',
  '$30k - $50k',
  '$50k - $80k',
  '$80k - $100k',
  '$100k+'
];

export const SOURCE_CATEGORIES = [
  'Job Board',
  'Company Career Page',
  'Recruitment Agency',
  'Government Jobs Portal',
  'Other'
];
