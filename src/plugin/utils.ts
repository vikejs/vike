export { isSSR }

function isSSR(config: { build?: { ssr?: boolean | string } }): boolean {
  return !!config?.build?.ssr
}
