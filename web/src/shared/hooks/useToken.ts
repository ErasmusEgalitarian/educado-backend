import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useAuthStore from "@/auth/hooks/use-auth-store";

// Contexts

const useToken = (initialState = ""): string => {
  // States and Hoooks
  const [token, setToken] = useState<string>(initialState);
  const getToken = useAuthStore((state) => state.getToken);
  const navigate = useNavigate();

  // Get valid token from context
  useEffect(() => {
    const fetchToken = async () => {
      return await getToken();
    };
    fetchToken()
      .then((res) => {
        setToken(res);
      })
      .catch(() => {
        navigate("/login", { state: { from: useLocation() } });
      });
  }, []);

  return token;
};

export default useToken;
