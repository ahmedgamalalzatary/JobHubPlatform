import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { I18nProvider } from "./providers/i18n-provider";
import { ThemeProvider } from "./providers/theme-provider";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <I18nProvider>
        <App />
      </I18nProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
