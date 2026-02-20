import { createContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/lib/api";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface SignupData {
  email?: string;
  phone?: string;
  username?: string;
  zipcode?: string;
  password: string;
  password_confirmation: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setToken(storedToken);
      authApi
        .getCurrentUser(storedToken)
        .then((data) => {
          setUser(data.user);
        })
        .catch((error) => {
          const message = error instanceof Error ? error.message : "";
          const isAuthError = /invalid token|unauthorized|user not found/i.test(
            message,
          );

          if (isAuthError) {
            // Token is invalid, clear it
            localStorage.removeItem("auth_token");
            setToken(null);
            setUser(null);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("auth_token", data.token);
  };

  const loginWithGoogle = async (credential: string) => {
    const data = await authApi.googleLogin(credential);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("auth_token", data.token);
  };

  const signup = async (userData: SignupData) => {
    const data = await authApi.signup(userData);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("auth_token", data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
  };

  const value = {
    user,
    token,
    login,
    loginWithGoogle,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
