import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { Toaster } from "sonner";

import App from "./App";
import { NotificationProvider } from "./shared/context/NotificationContext";

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
      </QueryClientProvider>
    </StrictMode>
  );
}
