import { renderPage } from 'vite-plugin-ssr'
import vite from 'vite'
import { expect, describe, it, beforeAll } from 'vitest'

beforeAll(async () => {
  await createDevServer()
})

describe('renderPage()', () => {
  it('basics', async () => {
    {
      const pageContext = await renderPage({ url: '/' })
      const { body, statusCode, contentType } = pageContext.httpResponse
      expect(statusCode).toBe(200)
      expect(contentType).toBe('text/html')
      expect(body).toBe(
        `<html><head></head><body>hello<script type=\"module\" src=\"/@vite/client\"></script></body></html>`,
      )
    }
    /*
    {
      const pageContext = await renderPage({ url: '/does-not-exist' })
      expect(pageContext.httpResponse).toBe(null)
    }
    */
  })
})

async function createDevServer() {
  await vite.createServer({
    root: __dirname,
    server: { middlewareMode: 'ssr' },
  })
}
