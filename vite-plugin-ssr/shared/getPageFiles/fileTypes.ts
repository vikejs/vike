export type { FileType }
export { fileTypes }
export { isValidFileType }

const fileTypes = [
  '.page',
  '.page.server',
  '.page.route',
  '.page.client',
  // New type `.page.css`/`.page.server.css`/`.page.client.css` for `extensions[number].pageFileDist`.
  //  - Extensions using `pageFileDist` are expected to use a bundler that generates a `.css` colocated next to the original `.page.js` file (e.g. `/renderer/_default.page.server.css` for `/renderer/_default.page.server.js`.
  //  - Since these `.page.css` files Bundlers We can therefore expect that there isn't any `.page.server.sass`/...
  '.css'
] as const
type FileType = typeof fileTypes[number]

function isValidFileType(filePath: string): boolean {
  return ['.js', '.mjs', '.cjs', '.css'].some((ext) => filePath.endsWith(ext))
}
