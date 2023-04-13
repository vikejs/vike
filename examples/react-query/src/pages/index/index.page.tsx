import React from "react";
import { Counter } from "./Counter";
import { Link } from "../../../renderer/Link";

export { Page };

function Page() {
  return (
    <>
      <h1>
        ⚡ vite-plugin-ssr with{" "}
        <a
          href="https://tanstack.com/query/latest/docs/react/overview"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tanstack react query
        </a>
        ⚡
      </h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
        <li>
          See ➡️<Link href="/users">users page</Link>⬅️ for query example
        </li>
        <li>
          ✅ Works with :
          <br />
          <ul>
            <li>Server side rendering (ssr)</li>
            <li>Static site generation (ssg)</li>
          </ul>
          💡Prerendered by default using global plugin configuration
        </li>
        <li>🔧 Including tanstack query devtools</li>
      </ul>
    </>
  );
}
