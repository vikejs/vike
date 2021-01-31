import { getUserFiles } from "./userFiles";
import { assert, assertUsage } from "./utils/assert";
import { isCallable } from "./utils/isCallable";
import * as vite from "vite";
import {
  sep as pathSep,
  relative as pathRelative,
  join as pathJoin,
} from "path";
import { renderHtml } from "./renderHtml";

export { getPageDefinitions };
export { Page };

type PageView = any;

type HtmlProps = Record<string, string>;

type PageConfig = {
  route?: string | UrlMatcher;
  render?: (view: PageView) => string | Promise<string>;
  html?: (args: { viewHtml: string } & HtmlProps) => string | Promise<string>;
};

type PageId = string;
type Page = {
  pageId: string;
  files: {
    [".html"]?: string;
    [".browser-entry"]?: string;
    [".page"]?: string;
    [".config"]?: string;
  };
  isDefaultTemplate: boolean;
  config: PageConfig;
  matchesUrl: UrlMatcher;
  renderPageHtml: RenderPageHtml;
  view: PageView;
};

type RenderPageHtml = (url: string) => Promise<string>;

type UrlMatcher = (url: string) => boolean | number;

async function getPageDefinitions() {
  const userFiles = await getUserFiles();
  // console.log("user files:\n" + userFiles.sort().join("\n"));

  const pages: Page[] = [];
  const pagesMap: Record<PageId, Page> = {};
  for (const filePath of userFiles) {
    const { pageId, fileType } = parseFilePath(filePath);

    const isDefaultTemplate = pageId.split(pathSep).slice(-1)[0] === "default";

    const pageDefinition = (pagesMap[pageId] = pagesMap[pageId] || {
      files: {},
      pageId,
      isDefaultTemplate,
    });

    assert(
      fileType === ".page" ||
        fileType === ".config" ||
        fileType === ".html" ||
        fileType === ".browser-entry"
    );
    assert(!(fileType in pageDefinition));
    pageDefinition.files[fileType] = filePath;

    pageDefinition.renderPageHtml = getRenderPageHtml(pageDefinition, pages);

    if (!pageDefinition.isDefaultTemplate) {
      pageDefinition.matchesUrl = getRouteUrlMatcher(pageDefinition, pages);
    }
  }

  for (const page of Object.values(pagesMap)) {
    if (!page.isDefaultTemplate && !page.files[".page"]) {
      continue;
    }

    if (page.files[".config"]) {
      page.config = (await loadModule(page.files[".config"])) as PageConfig;
    }
    if (page.files[".page"]) {
      page.view = await loadModule(page.files[".page"]);
      assert(page.view);
    }

    pages.push(page);
  }
  return pages;
}

async function loadModule(modulePath: string): Promise<unknown> {
  // @ts-ignore
  const { viteServer } = global;
  let moduleExports;
  try {
    moduleExports = await viteServer.ssrLoadModule(modulePath);
  } catch (err) {
    if (!isProduction()) viteServer.ssrFixStacktrace(err);
    throw err;
  }
  assert(moduleExports);
  const defaultExport = moduleExports.default;
  assert(defaultExport);
  return defaultExport;
}
function isProduction() {
  return process.env.NODE_ENV === "production";
}
function resolveFileUrl(filePath: string): string {
  assert(typeof filePath === "string");
  // @ts-ignore
  const { viteServer } = global;
  const viteRootDirectory = viteServer.config.root;
  assert(typeof viteRootDirectory === "string");
  let fileUrl = pathRelative(viteRootDirectory, filePath);
  assert(pathJoin(viteRootDirectory, fileUrl) === filePath);
  fileUrl = fileUrl.split(pathSep).join("/");
  assert(!fileUrl.startsWith("/"));
  fileUrl = "/" + fileUrl;
  return fileUrl;
}
async function transformHtml(url: string, html: string): Promise<string> {
  // @ts-ignore
  const { viteServer } = global;
  assert(url);
  assert(html);
  assert(html.length);
  html = await viteServer.transformIndexHtml(url, html);
  return html;
}

function getRenderPageHtml(page: Page, pages: Page[]): RenderPageHtml {
  return async (url: string) => {
    const defaultPage = getDefaultPage(pages);
    assert(defaultPage.config.render); // TODO
    assert(page.view);
    const viewHtml = await defaultPage.config.render(page.view);
    const html = await getHtml(page, viewHtml, url, defaultPage);
    return html;
  };
}
async function getHtml(
  page: Page,
  viewHtml: string,
  url: string,
  defaultPage: Page
): Promise<string> {
  // TODO
  const initialProps = { title: "TODO-Title" };

  const scripts: string[] = [];
  if (page.files[".browser-entry"]) {
    scripts.push(resolveFileUrl(page.files[".browser-entry"]));
  } else if (defaultPage.files[".browser-entry"]) {
    scripts.push(resolveFileUrl(defaultPage.files[".browser-entry"]));
  }

  let html;
  /*
  if (page?.config?.html) {
    html = await page.config.html(htmlProps);
  } else if (defaultPage?.config?.html) {
    html = await defaultPage.config.html(htmlProps);
  }
  */
  if (page.files[".html"]) {
    html = await renderHtml(
      page.files[".html"],
      initialProps,
      viewHtml,
      scripts
    );
  } else if (defaultPage.files[".html"]) {
    html = await renderHtml(
      defaultPage.files[".html"],
      initialProps,
      viewHtml,
      scripts
    );
  } else {
    assertUsage(false, "Missing HTML render [TODO]");
  }

  html = await transformHtml(url, html);

  return html;
}
function getDefaultPage(pages: Page[]): Page {
  let defaultPage;
  pages.forEach((pageDef) => {
    if (pageDef.isDefaultTemplate) {
      defaultPage = pageDef;
    }
  });
  // TODO - provide defaults
  assert(defaultPage);
  return defaultPage;
}
function getRouteUrlMatcher(pageDefinition: Page, pages: Page[]): UrlMatcher {
  return (url) => {
    const route = pageDefinition?.config?.route;
    if (!route) {
      return getMagicRoute(pageDefinition.pageId, pages)(url);
    }
    if (typeof route === "string") {
      assert(false); // "TODO: use path-to-regexp"
    }
    if (isCallable(route)) {
      return route(url);
    }
    assert(pageDefinition.files[".config"]);
    assertUsage(
      false,
      `route defined in ${pageDefinition.files[".config"]} should be either a string or a function`
    );
  };
}

function getMagicRoute(pageId: PageId, pages: Page[]): UrlMatcher {
  let pageRoute = removeCommonPrefix(pageId, pages);
  pageRoute = pageRoute.split(pathSep).join("/");
  pageRoute = pageRoute
    .split("/")
    .filter((part) => part !== "index")
    .join("/");
  pageRoute = normalize(pageRoute);
  return (url: string) => {
    url = normalize(url);
    console.log("url:" + url, "pageRoute:" + pageRoute);
    return url === pageRoute;
  };
  function normalize(url: string): string {
    return url.split("/").filter(Boolean).join("/").toLowerCase();
  }
}

function removeCommonPrefix(pageId: PageId, pages: Page[]) {
  const pageIds = pages
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
  let [fileType, fileExtension] = filePath.split(".").slice(-2);
  let pageId;
  if (fileExtension === "html") {
    fileType = ".html";
    fileExtension = "";
    pageId = filePath.split(".").slice(0, -1).join(".");
  } else {
    fileType = "." + fileType;
    fileExtension = "." + fileExtension;
    pageId = filePath.split(".").slice(0, -2).join(".");
  }
  assert(pageId + fileType + fileExtension === filePath);
  return { fileType, pageId };
}
