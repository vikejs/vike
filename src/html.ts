import { readFile } from "fs-extra";
import { isAbsolute as pathIsAbsolute } from "path";
import { assertUsage } from "./utils/assert";

export { html };

async function html(
  htmlFile: string,
  htmlVariables?: Record<string, string>
): Promise<string> {
  assertUsage(
    typeof htmlFile === "string" && pathIsAbsolute(htmlFile),
    "Wrong `html(htmlFile, htmlVariables)` usage: `htmlFile` should be the absolute path to your file holding html."
  );

  // TODO assert file existence
  let htmlString = (await readFile(htmlFile)).toString();

  Object.entries(htmlVariables || {}).forEach(([varName, varValue]) => {
    assertUsage(typeof varValue === "string", "TODO");
    // TODO: sanetize
    varValue = varValue;
    htmlString = htmlString.split("$" + varName).join(varValue);
  });

  return htmlString;
}
