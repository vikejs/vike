// https://vike.dev/data

export type Data = {
  todo: { text: string }[];
};

export default async function data(): Promise<Data> {
  return { todo: [] };
}
