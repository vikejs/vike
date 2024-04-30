import { compareString } from './utils.js'

export { sortPageContext }

// Sort `pageContext` keys alphabetically, in order to make reading `console.log(pageContext)` easier

function sortPageContext(pageContext: Record<string, unknown>): void {
  let descriptors = Object.getOwnPropertyDescriptors(pageContext)
  for (const key of Object.keys(pageContext)) delete pageContext[key]
  descriptors = Object.fromEntries(Object.entries(descriptors).sort(([key1], [key2]) => compareString(key1, key2)))
  Object.defineProperties(pageContext, descriptors)
}
