import { createSignal } from "solid-js";

export function Counter() {
  const [count, setCount] = createSignal(0);
  return (
    <sl-button onClick={() => setCount((prev) => prev + 1)}>
      Counter {count()}
    </sl-button>
  );
}
