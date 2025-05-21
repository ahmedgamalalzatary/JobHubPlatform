# Identified Issues and Recommendations for JobHub

This document outlines identified issues, potential vulnerabilities, and functional gaps within the JobHub application, along with recommendations for addressing them.

## Critical Security Vulnerabilities

1.  **Plain Text Password Storage:**
    *   **Description:** Passwords are currently stored and compared as plain text in the database (both in `MemStorage` for testing and `DatabaseStorage` for production). This is a severe security risk. If the database is compromised, all user passwords will be exposed.
    *   **Recommendation:** Implement strong password hashing (e.g., bcrypt or Argon2). Hash passwords upon user registration and when updating passwords. Compare hashes during login.

2.  **Weak Default Session Secret:**
    *   **Description:** The `server/index.ts` file uses a hardcoded default `'jobhub-session-secret'` if `process.env.SESSION_SECRET` is not set. This default secret is publicly known (as it's in the codebase), making sessions vulnerable if the environment variable is not properly configured in production.
    *   **Recommendation:** Remove the default secret. Enforce the setting of `SESSION_SECRET` through environment variables and make it a strong, random string. Provide clear documentation on how to set this up.

## Core Functionality Gaps (MVP Blockers)

1.  **Missing Job Aggregation/Scraping Mechanism:**
    *   **Description:** The application is intended to be a job aggregator, but there's no backend mechanism to fetch/scrape jobs from the approved `jobSources` and populate the `jobs` table. Currently, it only displays mock/seeded job data.
    *   **Recommendation:** Design and implement a job scraping/ingestion service. This could be a scheduled task or a separate microservice. It needs to parse job data from various sources (which can be complex due to differing structures) and store it in the `jobs` table. Consider using job scraping libraries or services if building from scratch is too complex for MVP.

2.  **Missing Job Source Approval Process:**
    *   **Description:** Users can submit new job sources via the `SourceForm`, which are stored with `approved: false`. However, there's no administrative interface or API endpoint to review and approve these submissions. As `getJobSources` only fetches `approved: true` sources, submitted sources are never actually used.
    *   **Recommendation:**
        *   **MVP:** At a minimum, create a simple admin script or protected API endpoint to list unapproved sources and mark them as approved. This might require a basic admin role/authentication.
        *   **Post-MVP:** A proper admin dashboard section for managing job sources.

## Important Issues & Missing Features (Pre-MVP Polish)

1.  **Inconsistent/Missing Backend Input Validation & Sanitization:**
    *   **Description:** While some routes use Zod schemas for request body validation (e.g., job source submission), this is not consistently applied to all inputs (query parameters for filtering/pagination, path parameters, other request bodies like login, signup, profile updates). This can lead to errors, unexpected behavior, or potential security vulnerabilities.
    *   **Recommendation:** Implement comprehensive backend validation for all incoming data using Zod or a similar library. Sanitize inputs where appropriate, especially if they are used in constructing database queries (though Drizzle ORM helps, defense in depth is good).

2.  **Lack of Password Management Features:**
    *   **Description:** There are no features for users to reset forgotten passwords or change their existing password securely.
    *   **Recommendation:** Implement "Forgot Password" (e.g., email-based token reset) and "Change Password" functionality. Ensure these processes are secure.

3.  **No Email Verification:**
    *   **Description:** User signups do not include an email verification step. This can lead to users signing up with fake or incorrect email addresses, which impacts communication and data quality.
    *   **Recommendation:** Implement an email verification process where users are sent a link to click to verify their email address after registration.

## Potential Improvements & Minor Issues

1.  **Basic Salary Filtering & Sorting:**
    *   **Description:** Salary filtering and sorting in `DatabaseStorage.getJobs` is based on simple string matching and text sorting for a `text` field, which is unreliable for ranges or different currency formats.
    *   **Recommendation:** Consider structuring the `salary` field more rigorously (e.g., separate fields for min/max salary, currency, period) or implement more robust parsing and comparison logic if it must remain text. For MVP, clearly document the limitations of the current text-based salary filtering.

2.  **Limited Notification System:**
    *   **Description:** Notifications are only created for "Welcome" messages. The system is not used for other relevant events.
    *   **Recommendation:** Expand the notification system for events like new jobs matching saved criteria (if implemented), status of submitted job sources, etc.

3.  **Placeholder/Hardcoded Dashboard Data:**
    *   **Description:** The "ApplicationsThisWeek" count in the Dashboard is hardcoded to 0. The "Recommended" jobs tab is also a placeholder.
    *   **Recommendation:** Implement the actual logic for these features or remove them if they are not planned for the near term.

4.  **Monolithic `server/routes.ts`:**
    *   **Description:** The `server/routes.ts` file contains all API routes and is becoming lengthy.
    *   **Recommendation:** Refactor routes into separate files based on resources (e.g., `auth.routes.ts`, `jobs.routes.ts`, `users.routes.ts`) for better organization and maintainability.
```
