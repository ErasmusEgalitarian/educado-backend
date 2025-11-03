import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import CourseEditorPage from "@/course/pages/course-editor-page";
import CourseOverviewPage from "@/course/pages/course-overview-page";

import AccountDeletionRequest from "./features/auth/components/AccountDeletionRequest";
import DataDeletionRequest from "./features/auth/components/DataDeletionRequest";
import Login from "./features/auth/components/Login";
import PrivacyPolicy from "./features/auth/components/PrivacyPolicy";
import Signup from "./features/auth/components/Signup";
import SignupInfo from "./features/auth/components/SignupInformation";
import Welcome from "./features/auth/pages/Welcome";
import Certificates from "./features/certificates/pages/Certificates";
import Profile from "./features/user/components/Profile";
import NotFound from "./shared/assets/NotFound";
import DocsPage from "./shared/docs/pages/docs-page";
import TestPage from "./test-page";
import TestPage2 from "./test-page2";
import Application from "./unplaced/Application";
import EducadoAdmin from "./unplaced/EducadoAdmin";
import Feedback from "./unplaced/Feedback";
import {
  AdminProtectedRoute,
  ProtectedRoute,
  NonProtectedRoute,
} from "./unplaced/services/auth.guard";
import SingleApplicantView from "./unplaced/SingleApplicantView";

const App = () => {
  // router
  const router = createBrowserRouter([
    {
      path: "/test",
      element: <TestPage />,
    },
    {
      path: "/test2",
      element: <TestPage2 />,
    },
    {
      path: "/docs",
      element: <DocsPage />,
    },
    {
      // Homepage is left unused
      path: "/",
      element: <Navigate to="/welcome" />,
      errorElement: <NotFound />,
    },
    {
      path: "/courses",
      element: (
        <ProtectedRoute>
          <CourseOverviewPage />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
    },
    {
      path: "/courses/create",
      element: (
        <ProtectedRoute>
          <CourseEditorPage />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
    },
    {
      path: "/courses/:courseId/edit",
      element: (
        <ProtectedRoute>
          <CourseEditorPage />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
    },
    {
      path: "/certificates",
      element: (
        <ProtectedRoute>
          <Certificates />
        </ProtectedRoute>
      ),
    },
    {
      path: "/feedback",
      element: (
        <ProtectedRoute>
          <Feedback />
        </ProtectedRoute>
      ),
    },
    {
      path: "/settings",
      element: <p>settings</p>,
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <NonProtectedRoute>
          <Login />
        </NonProtectedRoute>
      ),
      errorElement: <NotFound />,
    },
    {
      path: "/signup",
      element: (
        <NonProtectedRoute>
          <Signup />
        </NonProtectedRoute>
      ),
      errorElement: <NotFound />,
    },
        {
      path: "/signup/info",
      element: (
        <NonProtectedRoute>
          <SignupInfo />
        </NonProtectedRoute>
      ),
      errorElement: <NotFound />,
    },
    {
      path: "/application/:id",
      element: (
        <NonProtectedRoute>
          <Application />
        </NonProtectedRoute>
      ),
      errorElement: <NotFound />,
    },
    {
      path: "/educado-admin",
      element: (
        <ProtectedRoute>
          <EducadoAdmin />
        </ProtectedRoute>
      ),
    },
    {
      path: "/educado-admin/applications",
      element: (
        <AdminProtectedRoute requiredRole="admin">
          <EducadoAdmin />
        </AdminProtectedRoute>
      ),
    },
    {
      path: "/educado-admin/applications/:id",
      element: (
        <ProtectedRoute>
          <SingleApplicantView />
        </ProtectedRoute>
      ),
    },
    {
      path: "/welcome",
      element: (
        <NonProtectedRoute>
          <Welcome />
        </NonProtectedRoute>
      ),
    },
    {
      path: "/data_deletion_request",
      element: (
        <NonProtectedRoute>
          <DataDeletionRequest />
        </NonProtectedRoute>
      ),
    },
    {
      path: "/account_deletion_request",
      element: (
        <ProtectedRoute>
          <AccountDeletionRequest />
        </ProtectedRoute>
      ),
    },
    {
      path: "/privacy_policy",
      element: (
        <NonProtectedRoute>
          <PrivacyPolicy />
        </NonProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
