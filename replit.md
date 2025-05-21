# JobHub - Replit Project Guide

## Overview

JobHub is a full-stack web application for aggregating job listings from multiple sources, designed primarily for Arabic-speaking professionals seeking job opportunities in the Arab world. The application provides features like job search, filtering, saving favorites, and submitting new job sources.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

JobHub uses a modern web stack with the following key technologies:

1. **Frontend**: React with TypeScript, styled using Tailwind CSS and shadcn/ui components
2. **Backend**: Node.js with Express
3. **Database**: PostgreSQL with Drizzle ORM
4. **State Management**: TanStack React Query for data fetching and server state management
5. **Routing**: Wouter for client-side routing
6. **Internationalization**: i18next for multi-language support (English/Arabic)
7. **Authentication**: Custom authentication with session-based approach

The application follows a client-server architecture where:
- The client is a Single Page Application (SPA) built with React
- The server provides REST API endpoints for data operations
- The database stores user data, job listings, and related information

## Key Components

### Frontend

1. **Page Components**: 
   - Home - Landing page with featured jobs
   - Jobs - Job listing search and filter interface
   - SavedJobs - User's saved job listings
   - JobSources - Directory of job listing sources
   - Dashboard - User's personalized dashboard
   - Profile - User profile management

2. **Core UI Components**:
   - JobCard - Reusable card component to display job listings
   - JobFilter - UI for filtering jobs by various criteria
   - JobList - Displays a paginated list of jobs with sorting options
   - Navbar - Main navigation component
   - Footer - Site footer with links
   - PaginationControls - Reusable pagination component

3. **UI Component Library**:
   - Collection of UI components from shadcn/ui

4. **Providers**:
   - ThemeProvider - Manages light/dark mode
   - I18nProvider - Manages internationalization settings

### Backend

1. **API Routes**:
   - Auth endpoints (`/api/auth/*`) for login, signup, etc.
   - Job endpoints (`/api/jobs/*`) for listing, filtering jobs
   - Saved jobs endpoints (`/api/saved-jobs/*`) for saving/managing favorites
   - Job sources endpoints (`/api/job-sources/*`) for managing job sources

2. **Data Storage**:
   - The `storage.ts` interface defines the data access operations
   - Implementations use Drizzle ORM to interact with PostgreSQL

3. **Schema**:
   - Database schema defined using Drizzle ORM in `shared/schema.ts`
   - Main entities: users, jobs, savedJobs, jobSources

## Data Flow

1. **Job Listing Flow**:
   - User visits Jobs page
   - Client makes request to `/api/jobs` with optional filter parameters
   - Server queries database through storage interface
   - Results returned to client and displayed in JobList component
   - User can paginate through results or apply filters

2. **Authentication Flow**:
   - User submits login credentials
   - Server validates credentials against database
   - On success, server creates a session and sends user data
   - Client stores user context and enables authenticated features

3. **Saved Jobs Flow**:
   - Authenticated user clicks "Save" on a job
   - Request sent to `/api/saved-jobs` to create association
   - Server updates database and confirms success
   - UI updates to show job is saved
   - User can view all saved jobs in the SavedJobs page

## External Dependencies

1. **UI Components**:
   - Radix UI primitives for accessible components
   - Lucide icons for icons
   - shadcn/ui for styled components

2. **Data Management**:
   - TanStack React Query for data fetching and cache management
   - Zod for schema validation
   - React Hook Form for form handling

3. **Styling**:
   - Tailwind CSS for utility-first styling
   - Class Variance Authority for component variants

4. **Database**:
   - Drizzle ORM for database operations
   - Drizzle Kit for database migrations
   - PostgreSQL as the database engine

5. **Internationalization**:
   - i18next and react-i18next for translations
   - Support for English and Arabic

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

1. **Development Mode**:
   - Uses `npm run dev` command which runs the server with hot reloading
   - Vite handles frontend development server and HMR

2. **Production Build**:
   - Frontend is built with Vite (`vite build`)
   - Backend is bundled with esbuild
   - Output files are placed in the `dist` directory

3. **Database**:
   - PostgreSQL is configured through Replit's built-in database support
   - Connection is established using the DATABASE_URL environment variable
   - Migrations are handled with Drizzle Kit

4. **Environment Variables**:
   - DATABASE_URL - PostgreSQL connection string
   - NODE_ENV - Environment mode (development/production)

5. **Deployment Process**:
   - Triggered by the build command `npm run build`
   - Runs the application with `npm run start`
   - Exposes port 5000 for web traffic

## Adding New Features

When adding new features to JobHub:

1. **Frontend Changes**:
   - Add new pages in `client/src/pages/`
   - Add new components in `client/src/components/`
   - Update routes in `client/src/App.tsx`
   - Add translations in `client/src/lib/i18n.ts`

2. **Backend Changes**:
   - Add new API routes in `server/routes.ts`
   - Update database schema in `shared/schema.ts`
   - Implement storage operations in `server/storage.ts`

3. **Database Changes**:
   - Update schema in `shared/schema.ts`
   - Run migrations with `npm run db:push`