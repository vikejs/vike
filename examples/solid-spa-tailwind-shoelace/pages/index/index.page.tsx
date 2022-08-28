import { Counter } from "./Counter";

export function Page() {
  return (
    <>
      <h1 class="text-xl font-bold">About</h1>
      <sl-badge>v1.0</sl-badge>
      <p class="my-2">Solid JS SPA + Tailwind + Shoelace</p>
      <Counter></Counter>
    </>
  );
}
