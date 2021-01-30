import { getUserFiles } from "./userFiles";
import { assert, assertUsage } from "./utils/assert";
import { isCallable } from "./utils/isCallable";
import * as vite from "vite";
import { sep as pathSep } from "path";
import { readFile } from "fs-extra";

export { getPageDefinitions };

type PageId = string;
type PageDefinition = {
  pageId: string;
  files: {
    html?: string;
    ["browser-entry"]?: string;
    page?: string;
    config?: string;
  };
  isDefaultTemplate: boolean;
  config: any; // TODO add type
  matchesUrl: MatchesUrl;
  renderPageHtml: RenderPageHtml;
  view: Function;
};

type RenderPageHtml = () => string;

type MatchesUrl = (url: string) => boolean;

async function getPageDefinitions() {
  const userFiles = await getUserFiles();

  const pageDefinitions: Record<PageId, PageDefinition> = {};
  userFiles.forEach((filePath) => {
    const { pageId, fileType } = parseFilePath(filePath);

    const isDefaultTemplate = pageId.split(pathSep).slice(-1)[0] === "default";

    const pageDefinition = (pageDefinitions[pageId] = pageDefinitions[
      pageId
    ] || { files: {}, pageId, isDefaultTemplate });

    assert(
      fileType === "page" ||
        fileType === "config" ||
        fileType === "html" ||
        fileType === "browser-entry"
    );
    assert(!(fileType in pageDefinition));
    pageDefinition.files[fileType] = filePath;

    if (pageDefinition.files.config) {
      pageDefinition.config =
        // @ts-ignore
        await vite.ssrLoadModule(pageDefinition.files.config);
    }
    if (pageDefinition.files.page) {
      pageDefinition.view =
        // @ts-ignore
        await vite.ssrLoadModule(pageDefinition.files.page);
    }

    pageDefinition.renderPageHtml = getRenderPageHtml(
      pageDefinition,
      Object.values(pageDefinitions)
    );

    if (!pageDefinition.isDefaultTemplate) {
      pageDefinition.matchesUrl = getRouteUrlMatcher(
        pageDefinition,
        Object.values(pageDefinitions)
      );
    }
  });

  return pageDefinitions;
}

function getRenderPageHtml(
  pageDefinition: PageDefinition,
  pageDefinitions: PageDefinition[]
): RenderPageHtml {
  const defaultPageDef = getDefaultPageDefinition(pageDefinitions);
  // TODO get default htmls
  assert(pageDefinition.files.html);
  return () => {
    const viewHtml = defaultPageDef.config.render(pageDefinition.view);
    // TODO: pass initial props
    let html = defaultPageDef.config.html(pageDefinition.files.html, {
      viewHtml,
      title: "TODO-Title",
    });
    return html;
  };
}
function getDefaultPageDefinition(
  pageDefinitions: PageDefinition[]
): PageDefinition {
  let defaultPageDefinition;
  pageDefinitions.forEach((pageDef) => {
    if (pageDef.isDefaultTemplate) {
      defaultPageDefinition = pageDef;
    }
  });
  // TODO - provide defaults
  assert(defaultPageDefinition);
  return defaultPageDefinition;
}
function getRouteUrlMatcher(
  pageDefinition: PageDefinition,
  pageDefinitions: PageDefinition[]
): MatchesUrl {
  const route = pageDefinition?.config?.route;
  if (!route) {
    return getMagicRoute(pageDefinition.pageId, pageDefinitions);
  }
  if (typeof route === "string") {
    assert(false); // "TODO: use path-to-regexp"
  }
  if (isCallable(route)) {
    return route;
  }
  assert(pageDefinition.files.config);
  assertUsage(
    false,
    `route defined in ${pageDefinition.files.config} should be either a string or a function`
  );
}

function getMagicRoute(
  pageId: PageId,
  pageDefinitions: PageDefinition[]
): MatchesUrl {
  let pageRoute = removeCommonPrefix(pageId, pageDefinitions);
  pageRoute = pageRoute
    .split(pathSep)
    .filter((part) => part !== "index")
    .join("/");
  return (url: string) => url.toLowerCase() === pageRoute.toLowerCase();
}

function removeCommonPrefix(pageId: PageId, pageDefinitions: PageDefinition[]) {
  const pageIds = pageDefinitions
    .filter((pd) => !pd.isDefaultTemplate)
    .map((pd) => pd.pageId);
  const commonPrefix = getCommonPrefix(pageIds);
  assert(pageId.startsWith(commonPrefix));
  return pageId.slice(commonPrefix.length);
}
function getCommonPrefix(strings: string[]): string {
  const list = strings.concat().sort();
  const first = list[0];
  const last = list[list.length - 1];
  let idx = 0;
  for (; idx < first.length; idx++) {
    if (first[idx] !== last[idx]) break;
  }
  return first.slice(0, idx);
}

function parseFilePath(filePath: string): { pageId: PageId; fileType: string } {
  const [fileType, fileExtension] = filePath.split(".").slice(-2);
  const pageId = filePath.split(".").slice(0, -2).join(".");
  assert(pageId + "." + fileType + "." + fileExtension === filePath);
  return { fileType, pageId };
}
