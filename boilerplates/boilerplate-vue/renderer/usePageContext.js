import { inject } from 'vue'

export { usePageContext }

function usePageContext() {
  const pageContext = inject('pageContext')
  return pageContext
}
