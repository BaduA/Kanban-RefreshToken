import AuthClientStore from "./auth/clientStore";

const apiUrl = "localhost:4000/";

const sendRequest = (
  method: any,
  path: string,
  // eslint-disable-next-line
  body?: any,
  authToken?: string | null,
  init?: RequestInit
) => {
  return fetch("http://localhost:4000" + path, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...init?.headers,
    },
  }).then((response) => {
    if (response.status >= 400) {
      throw response;
    }
    return response.json();
  });
};

const sendProtectedRequest = (
  method: any,
  path: string,
  // eslint-disable-next-line
  body?: any,
  init?: RequestInit
) => {
  const authToken = AuthClientStore.getAccessToken();
  if (!authToken) {
    throw new Error("No auth token found");
  }

  return sendRequest(method, path, body, authToken, init);
};

export const useApi = () => {
  return { sendRequest, sendProtectedRequest };
};
