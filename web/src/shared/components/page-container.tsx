import { ReactNode } from "react";

import { useDocumentTitle } from "../hooks/use-document-title";

import { ErrorBoundary } from "./error/error-boundary";
import { Navbar } from "./Navbar";

export const PageContainer = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  useDocumentTitle("Educado: " + title);

  return (
    <div className="min-h-screen">
      {/* Navbar section */}
      <Navbar />

      {/* Main content with responsive padding and max-width */}
      <main className="mx-auto w-full max-w-[120rem] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-12">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
};
