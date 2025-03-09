import { routes } from "../constants";
import { ApiMethod, User } from "../types";
import { useApi } from "../useApi";
import AuthClientStore from "./clientStore";

/*
 * These variables are used to debounce the refreshTokens function
 */
let debouncedPromise: Promise<unknown> | null;
let debouncedResolve: (...args: unknown[]) => void;
let debouncedReject: (...args: unknown[]) => void;
let timeout: any;

export const useAuthApi = () => {
  const { sendRequest, sendProtectedRequest } = useApi();

  const login = async (email: string, password: string) => {
    const response = await sendRequest(
      ApiMethod.POST,
      routes.auth.login,
      {
        username: email,
        password,
      },
      undefined,
      { credentials: "include" }
    );
    AuthClientStore.setAccessToken(response.access_token);

    return response;
  };
  const clearAuthCookie = () => {
    return sendRequest(
      ApiMethod.POST,
      routes.auth.clearAuthCookie,
      undefined,
      undefined,
      { credentials: "include" }
    );
  };
  const logout = () => {
    AuthClientStore.removeAccessToken();
    return clearAuthCookie();
  };
  const refreshTokens = async () => {
    clearTimeout(timeout);
    if (!debouncedPromise) {
      debouncedPromise = new Promise((resolve, reject) => {
        debouncedResolve = resolve;
        debouncedReject = reject;
      });
    }

    timeout = setTimeout(() => {
      const executeLogic = async () => {
        const response = await sendRequest(
          ApiMethod.POST,
          routes.auth.refreshTokens,
          undefined,
          undefined,
          { credentials: "include" }
        );
        AuthClientStore.setAccessToken(response.access_token);
      };

      executeLogic().then(debouncedResolve).catch(debouncedReject);

      debouncedPromise = null;
    }, 200);

    return debouncedPromise;
  };

  const sendAuthGuardedRequest = async (
    userIsNotAuthenticatedCallback: () => void,
    method: ApiMethod,
    path: string,
    // eslint-disable-next-line
    body?: any,
    init?: RequestInit
  ) => {
    try {
      return await sendProtectedRequest(method, path, body, init);
    } catch (e: any) {
      if (e?.status === 401) {
        try {
          await refreshTokens();
        } catch (e) {
          userIsNotAuthenticatedCallback();
          throw e;
        }
        return await sendProtectedRequest(method, path, body, init);
      }

      throw e;
    }
  };

  const me = (userIsNotAuthenticatedCallback: () => void) => {
    return sendAuthGuardedRequest(
      userIsNotAuthenticatedCallback,
      ApiMethod.GET,
      routes.auth.me
    ) as Promise<User>;
  };

  return { login, logout, me, sendAuthGuardedRequest };
};
