export { sourceMapRemove }

// https://rollupjs.org/guide/en/#source-code-transformations

/** Remove entire source mapping, to save KBs. */
function sourceMapRemove(code: string): { code: string; map: { mappings: '' } } {
  return {
    code,
    map: { mappings: '' }
  }
}
