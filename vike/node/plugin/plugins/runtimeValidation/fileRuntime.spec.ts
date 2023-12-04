import { describe, it, expect } from 'vitest'
import { build } from 'vite'
import { assertFileRuntime } from './fileRuntime'
import path from 'path'

describe('assertFileRuntime()', () => {
  it('should throw an error when importing Server-only module in a client bundle', async () => {
    try {
      await build({
        plugins: [assertFileRuntime()],
        resolve: {
          alias: {
            './ServerOnly.server': path.resolve(__dirname, './ServerOnly.server.jsx'),
            './Mock': path.resolve(__dirname, './Mock.jsx')
          }
        },
        build: {
          rollupOptions: {
            input: path.resolve(__dirname, './entry.js')
          }
        }
      })
      throw new Error('Build did not fail as expected')
    } catch (error) {
      console.log('errorhoge', error.message)
      const regex =
        /Server-only module ".*ServerOnly\.server\.jsx" included in client bundle \(imported by .*Mock\.jsx\)/
      expect(regex.test(error.message)).toBe(true)
    }
  })
})
