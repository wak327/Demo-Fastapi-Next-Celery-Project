import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import apiClient, { loadTokenFromStorage, setAuthToken } from "../lib/api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterPayload extends LoginCredentials {
  confirmPassword: string;
}

export const useAuth = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = loadTokenFromStorage();
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    const accessToken: string = response.data.access_token;
    setAuthToken(accessToken);
    setToken(accessToken);
    router.push("/dashboard");
  };

  const register = async (payload: RegisterPayload) => {
    await apiClient.post("/auth/register", {
      email: payload.email,
      password: payload.password,
      confirm_password: payload.confirmPassword
    });
    await login({ email: payload.email, password: payload.password });
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    router.push("/login");
  };

  return { token, loading, login, logout, register };
};

export default useAuth;
