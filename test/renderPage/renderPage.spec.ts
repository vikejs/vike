import { renderPage } from '../../vite-plugin-ssr/node/runtime'
import { createServer } from 'vite'
import { expect, describe, it, beforeAll } from 'vitest'

beforeAll(async () => {
  await createDevServer()
})

describe('renderPage()', () => {
  it('basics', async () => {
    {
      const pageContext = await renderPage({ urlOriginal: '/' })
      expect(pageContext.httpResponse).toBeTruthy()
      const { body, statusCode, headers } = pageContext.httpResponse!
      expect(statusCode).toBe(200)
      expect(headers).toStrictEqual([['Content-Type', 'text/html;charset=utf-8']])
      expect(body).toMatchInlineSnapshot(
        '"<html><head><script type=\\"module\\" src=\\"/@vite/client\\"></script></head><body><p>hello</p></body></html>"'
      )
    }
    /*
    {
      const pageContext = await renderPage({ urlOriginal: '/does-not-exist' })
      expect(pageContext.httpResponse).toBe(null)
    }
    */
  })
})

async function createDevServer() {
  await createServer({
    root: __dirname,
    server: { middlewareMode: true }
  })
}
