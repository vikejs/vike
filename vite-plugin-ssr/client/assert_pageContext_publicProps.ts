import { assert, hasProp } from '../shared/utils'

export { assert_pageContext_publicProps }

function assert_pageContext_publicProps<T extends Record<string, unknown>>(
  pageContext: T
): asserts pageContext is T & { Page: unknown; pageExports: Record<string, unknown> } {
  assert(hasProp(pageContext, 'Page'))
  assert(hasProp(pageContext, 'pageExports', 'object'))
}
