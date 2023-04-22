export function stabilizeHashs(str: string): string {
  return str.replaceAll(/(\/assets\/[^ ]*)(\.|chunks\/)[0-9a-zA-Z]{5,20}(\.(js|css|ttf|svg))/g, '$1$2$HASH$3')
}
