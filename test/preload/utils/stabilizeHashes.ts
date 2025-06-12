export function stabilizeHashes(str: string): string {
  return str.replaceAll(
    /(\/assets\/[^ ]*)(\.|chunks\/chunk\-)[0-9a-zA-Z_-]{5,20}(\.(js|css|woff2|ttf|svg))/g,
    '$1$2$HASH$3',
  )
}
