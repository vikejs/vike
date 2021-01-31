import { readFile } from "fs-extra";
import { isAbsolute as pathIsAbsolute } from "path";
import { assertUsage } from "./utils/assert";

export { renderHtml };

async function renderHtml(
  htmlFile: string,
  htmlVariables: Record<string, string>,
  scripts: string[]
): Promise<string> {
  assertUsage(
    typeof htmlFile === "string" && pathIsAbsolute(htmlFile),
    "Wrong `html(htmlFile, htmlVariables)` usage: `htmlFile` should be the absolute path to your file holding html."
  );

  // TODO assert file existence
  let html = (await readFile(htmlFile)).toString();

  Object.entries(htmlVariables).forEach(([varName, varValue]) => {
    assertUsage(typeof varValue === "string", "TODO");
    injectValue(html, varName, varValue);
  });

  injectScripts(html, scripts);

  return html;
}

function injectScripts(html: string, scripts: string[]) {
  let htmlScritps = "";
  scripts.forEach((scriptUrl) => {
    scriptUrl = sanetize(scriptUrl);
    htmlScritps += `<script src="${scriptUrl}"></script>\n`;
  });
  html = injectValue(html, "$scripts", htmlScritps, { alreadySanetized: true });
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

function sanetize(str: string): string {
  // TODO
  return str;
}
