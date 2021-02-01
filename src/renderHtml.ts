import { readFile } from "fs-extra";
import { isAbsolute as pathIsAbsolute } from "path";
import { assert, assertUsage } from "./utils/assert";

export { renderHtml };
export { Script };
export { injectScripts };

type Script = { scriptUrl: string } | { scriptContent: string };

async function renderHtml(
  htmlFile: string,
  htmlVariables: Record<string, string>,
  viewHtml: string
): Promise<string> {
  assertUsage(
    typeof htmlFile === "string" && pathIsAbsolute(htmlFile),
    "Wrong `html(htmlFile, htmlVariables)` usage: `htmlFile` should be the absolute path to your file holding html."
  );
  assert(typeof viewHtml === "string");

  // TODO assert file existence
  let html = (await readFile(htmlFile)).toString();

  html = injectValue(html, "viewHtml", viewHtml, { alreadySanetized: true });

  Object.entries(htmlVariables).forEach(([varName, varValue]) => {
    assertUsage(typeof varValue === "string", "TODO");
    html = injectValue(html, varName, varValue);
  });

  return html;
}

function injectScripts(html: string, scripts: Script[]): string {
  const htmlScritps: string[] = [];
  scripts.forEach((script) => {
    if ("scriptUrl" in script) {
      htmlScritps.push(
        `<script type="module" src="${sanetize(script.scriptUrl)}"></script>`
      );
    }
    if ("scriptContent" in script) {
      htmlScritps.push(script.scriptContent);
    }
  });
  html = injectValue(html, "scripts", htmlScritps.join("\n"), {
    alreadySanetized: true,
  });
  return html;
}

function injectValue(
  html: string,
  varName: string,
  varValue: string,
  { alreadySanetized }: { alreadySanetized?: boolean } = {}
): string {
  if (!alreadySanetized) {
    varValue = sanetize(varValue);
  }
  html = html.split("$" + varName).join(varValue);
  return html;
}

function sanetize(unsafe: string): string {
  return escapeHtml(unsafe);
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
