import { User } from "../types/User";

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");

  const users: User[] = (await response.json()) as User[];

  return users;
};
