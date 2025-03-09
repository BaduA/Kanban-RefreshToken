const ACCESS_TOKEN_KEY = "todoapp.access.token";
const REFRESH_TOKEN_KEY = "todoapp.refresh.token";
class AuthClientStore {
  static getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  static setAccessToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  static removeAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export default AuthClientStore;
