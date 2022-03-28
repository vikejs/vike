// This file will be overwritten

export const distEntries = null as DistEntries

type DistEntries = null | {
  pageFiles: () => Promise<Record<string, unknown>>
  clientManifest: () => Promise<Record<string, unknown>>
  serverManifest: () => Promise<Record<string, unknown>>
  pluginManifest: () => Promise<Record<string, unknown>>
}
