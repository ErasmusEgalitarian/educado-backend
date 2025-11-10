import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { Toaster } from "sonner";

import "../i18n/i18n.ts";
import { AuthProvider } from "@/auth/context/auth-provider";
import { TooltipProvider } from "@/shared/components/shadcn/tooltip";

import App from "./App";
import "./index.css";
import { configureApiClient } from "./shared/config/api-config";
import { NotificationProvider } from "./shared/context/NotificationContext";

// Initialize and configure the API client
configureApiClient();

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");
if (rootElement?.innerHTML === "") {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      {/* i18n is imported at module scope; do not import inside JSX */}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <TooltipProvider>
              <ToastContainer />{" "}
              {/* Deprecated; kept temporarily for legacy notifications */}
              <Toaster position="top-right" richColors={true} />
              <App />
            </TooltipProvider>
          </NotificationProvider>
        </AuthProvider>
        <ReactQueryDevtools buttonPosition={"top-left"} initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
}
