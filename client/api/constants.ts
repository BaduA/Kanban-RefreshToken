export const routes = {
  auth: {
    me: "/auth/me",
    login: "/auth/login",
    refreshTokens: "/auth/refresh-tokens",
    clearAuthCookie: "/auth/clear-auth-cookie",
  },
  user: {
    findAll: "/users",
    findOne: (id: number) => `/users/${id}`,
    changeRole: (id: string, role: string) => `/users/${id}/${role}`,
  },
  task: {
    findAll: "/tasks",
    findByUsername: (username: string) => `/tasks/username/${username}`,
    findOne: (id: number) => `/tasks/${id}`,
    create: "/tasks",
    createUserTask: "/tasks/forUser",
    update: (id: number) => `/tasks/${id}`,
    updateUserTask: (id: number) => `/tasks/forUser/${id}`,
    delete: (id: number) => `/tasks/${id}`,
    deleteUserTask: (id: number) => `/tasks/forUser/${id}`,
  },
};
