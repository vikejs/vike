import type { PageContextBuiltIn } from "vite-plugin-ssr";
import { Component } from "solid-js";

/**
 * PageContext used by the renderer.
 *
 * vite-plugin-ssr is framework agnostic. Hence, `Page` is defined as `any`.
 * Ommiting "Page" and re-defining it as SolidJS component.
 */
export type PageContext = Omit<PageContextBuiltIn, "Page"> & {
  Page: Component;
};
