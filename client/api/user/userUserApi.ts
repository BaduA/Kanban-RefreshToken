import { useAuthApi } from "../auth/useAuthApi";
import { routes } from "../constants";
import { ApiMethod } from "../types";

export const useUserApi = () => {
  const { sendAuthGuardedRequest, logout } = useAuthApi();

  const findAll = async () => {
    const response = await sendAuthGuardedRequest(
      () => {
        logout();
      },
      ApiMethod.GET,
      routes.user.findAll
    );

    return response;
  };
  const changeRole = async (id:string, role:string) => {
    const response = await sendAuthGuardedRequest(
      () => {
        logout();
      },
      ApiMethod.PATCH,
      routes.user.changeRole(id, role)
    );

    return response;
  };

  return { findAll,changeRole };
};
