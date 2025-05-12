import { usePageContext } from "vike-solid/usePageContext";
import { Counter } from "./Counter.js";

export default function Page() {
  const ctx = usePageContext();

  return (
    <>
      <h1>My Vike app</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        {typeof ctx?.ctx?.waitUntil === "function" ? <li>SSR running on Cloudflare</li> : null}
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  );
}
