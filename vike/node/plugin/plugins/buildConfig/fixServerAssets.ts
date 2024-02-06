export { fixServerAssets_isEnabled }

/**
 * true  => use workaround config.build.ssrEmitAssets
 * false => use workaround extractAssets plugin
 */
function fixServerAssets_isEnabled(): boolean {
  // We currently apply the workaround iff V1 design.
  // Shall we allow the user to toggle the workaround? E.g. using https://vike.dev/includeAssetsImportedByServer.
  return false
}
