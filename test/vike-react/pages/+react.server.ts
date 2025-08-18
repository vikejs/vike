import type { Config, PageContextServer } from 'vike/types'

export default (_pageContext: PageContextServer) =>
  ({
    renderToStringOptions: {
      identifierPrefix: 'some-id-server-prefix',
    },
  }) satisfies Config['react']
