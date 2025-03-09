export enum ApiMethod {
  GET = "GET",
  PUT = "PUT",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export type QueryParam = {
  key: string;
  value: string;
};

export type User = {
  id: number;
  username: string;
  role: string;
};

export type CreateTaskUser = {
  title: String;
  description?: String;
};

export type FindAllUsersResponse = { results: User[]; total: number };
