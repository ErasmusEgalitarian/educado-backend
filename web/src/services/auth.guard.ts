import React from "react";
import { useNavigate } from "react-router-dom";

import { getUserInfo } from "../helpers/userInfo";

//This service decides in what cases a route is accessible to the user
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();

  //If the user has a token, they can access protected routes, such as /profile, /courses etc.
  if (localStorage.getItem("token")) {
    return children;
  } else {
    console.error("No token found");

    React.useEffect(() => {
      navigate("/");
    }, []);
    return null;
  }
}

function AdminProtectedRoute({
  children,
  requiredRole,
}: {
  children: JSX.Element;
  requiredRole?: string;
}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = getUserInfo().role;

  React.useEffect(() => {
    if (!token || (requiredRole && userRole !== requiredRole)) {
      navigate("/");
    }
  }, [token, userRole, requiredRole, navigate]);

  if (token && (!requiredRole || userRole === requiredRole)) {
    return children;
  } else {
    return null;
  }
}

function NonProtectedRoute({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();

  //If the user HAS a token, they cannot access /welcome, /signup, or /login
  if (!localStorage.getItem("token")) {
    return children;
  } else {
    React.useEffect(() => {
      navigate("/courses");
    }, []);
    return null;
  }
}

export { ProtectedRoute, NonProtectedRoute, AdminProtectedRoute };
