import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import NotFound from "@/pages/not-found";

// Import pages
import Home from "@/pages/home";
import Jobs from "@/pages/jobs";
import SavedJobs from "@/pages/saved-jobs";
import JobSources from "@/pages/job-sources";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import { ROUTES } from "./lib/constants";

function Router() {
  return (
    <Switch>
      <Route path={ROUTES.HOME} component={Home} />
      <Route path={ROUTES.JOBS} component={Jobs} />
      <Route path={ROUTES.SAVED_JOBS} component={SavedJobs} />
      <Route path={ROUTES.JOB_SOURCES} component={JobSources} />
      <Route path={ROUTES.DASHBOARD} component={Dashboard} />
      <Route path={ROUTES.PROFILE} component={Profile} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Router />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
