// https://vike.dev/data
import { todos } from "../../database/todoItems";

export type Data = {
  todo: { text: string }[];
};

export default async function data(): Promise<Data> {
  return todos;
}
