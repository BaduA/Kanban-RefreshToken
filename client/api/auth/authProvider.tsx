"use client"
import { createContext, ReactNode, useState } from "react";
import { useAuthApi } from "./useAuthApi";
import { ApiMethod, User } from "../types";

type ContextType = {
  isAuthenticated: boolean;
  login(email: string, password: string): Promise<void>;
  logout(): void;
  me(): Promise<User>;
  sendAuthGuardedRequest(
    method: ApiMethod,
    path: string,
    body?: any,
    init?: RequestInit
  ): Promise<unknown>;
  role: String | null;
  username: String | null;
};

const AuthContext = createContext<ContextType | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<String | null>(null)
  const [username, setUsername] = useState<String | null>(null)
  const {
    login: authLogin,
    logout: authLogout,
    me: authMe,
    sendAuthGuardedRequest: authSendAuthGuardedRequest,
  } = useAuthApi();

  const login = async (email: string, password: string) => {
    try {
      await authLogin(email, password);
      setIsAuthenticated(true);
    } catch (e) {
      setIsAuthenticated(false);
      throw e;
    }
  };

  const logout = () => {
    authLogout();
    setIsAuthenticated(false);
  };

  const me = async () => {
    const user = await authMe(() => {
      setIsAuthenticated(false);
    });
    setIsAuthenticated(true);
    setRole(user.role)
    setUsername(user.username)
    return user;
  };

  const sendAuthGuardedRequest = async (
    method: ApiMethod,
    path: string,
    body?: any,
    init?: RequestInit
  ) => {
    return authSendAuthGuardedRequest(
      () => {
        setIsAuthenticated(false);
      },
      method,
      path,
      body,
      init
    );
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        me,
        sendAuthGuardedRequest,
        role,
        username
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
