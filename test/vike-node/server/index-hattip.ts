import { createServer } from '@hattip/adapter-node'
import { RequestContext, compose } from '@hattip/compose'
import vike from 'vike-node/hattip'

startServer()

async function startServer() {
  const server = createServer(compose(vike(), handler))
  const port = process.env.PORT || 3000
  server.listen(port, () => console.log(`Server running at http://localhost:${port}`))
}

function handler(ctx: RequestContext) {
  console.log('My request handler')
}
