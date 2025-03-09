import { useAuthApi } from "../auth/useAuthApi";
import { routes } from "../constants";
import { ApiMethod, CreateTaskUser } from "../types";

export const useDutyApi = () => {
  const { sendAuthGuardedRequest, logout } = useAuthApi();

  const findAll = async () => {
    const response = await sendAuthGuardedRequest(
      () => {
        logout();
      },
      ApiMethod.GET,
      routes.task.findAll
    );
    return response;
  };
  const findByUsername = async (username: string) => {
    const response = await sendAuthGuardedRequest(
      () => {
        logout();
      },
      ApiMethod.GET,
      routes.task.findByUsername(username)
    );
    return response;
  };
  const createTask = async (body: CreateTaskUser) => {
    const response = await sendAuthGuardedRequest(
      () => {
        logout();
      },
      ApiMethod.POST,
      routes.task.create,
      body
    );

    return response;
  };
  const deleteTask = async (id: number) => {
    const response = await sendAuthGuardedRequest(
      () => {
        logout();
      },
      ApiMethod.DELETE,
      routes.task.delete(id)
    );

    return response;
  };
  const updateTask = async (id: number, body: any) => {
    const response = await sendAuthGuardedRequest(
      () => {
        logout();
      },
      ApiMethod.PATCH,
      routes.task.update(id),
      body
    );

    return response;
  };
  const updateUserTask = async (id: number, body: any) => {
    const response = await sendAuthGuardedRequest(
      () => {
        logout();
      },
      ApiMethod.PATCH,
      routes.task.updateUserTask(id),
      body
    );

    return response;
  };
  const createUserTask = async (body: any) => {
    const response = await sendAuthGuardedRequest(
      () => {
        logout();
      },
      ApiMethod.POST,
      routes.task.createUserTask,
      body
    );

    return response;
  };
  const deleteUserTask = async (id: number) => {
    const response = await sendAuthGuardedRequest(
      () => {
        logout();
      },
      ApiMethod.DELETE,
      routes.task.deleteUserTask(id)
    );

    return response;
  };

  return {
    findAll,
    createTask,
    deleteTask,
    updateTask,
    findByUsername,
    updateUserTask,
    createUserTask,
    deleteUserTask,
  };
};
