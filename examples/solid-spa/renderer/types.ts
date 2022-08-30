import type { PageContextBuiltInClient } from "vite-plugin-ssr/client";
import type { PageContextBuiltIn } from "vite-plugin-ssr";
import type { Component } from "solid-js";
export type PageContextClient = Omit<PageContextBuiltInClient, "Page"> & {
  Page: Component;
};
export type PageContextServer = Omit<PageContextBuiltIn, "Page"> & {
  Page: Component;
};
