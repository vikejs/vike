// pointer import https://vike.dev/config#pointer-imports
import Page from '#root/pages/about/Page'
// normal import
import { env } from '#root/pages/about/page_env'

// https://vike.dev/config
export default {
  Page,
  // https://vike.dev/meta
  meta: {
    Page: {
      env,
    },
  },
}
