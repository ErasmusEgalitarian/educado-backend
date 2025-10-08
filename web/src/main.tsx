import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { Toaster } from "sonner";
import "../i18n/i18n.ts";

import App from "./App";
import "./index.css";
import configureApiClient from "./shared/config/api-config";
import { NotificationProvider } from "./shared/context/NotificationContext";

// Initialize and configure the API client
configureApiClient();

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");
if (rootElement && rootElement.innerHTML === "") {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <ToastContainer /> {/*TODO: Deprecate*/}
          <Toaster position="top-right" richColors={true} />
          <App />
        </NotificationProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
}
