import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";

import App from "./App";
import "./index.css";
import { NotificationProvider } from "./components/notification/NotificationContext";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");
if (rootElement && rootElement.innerHTML === "") {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <ToastContainer />
          <App />
        </NotificationProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
