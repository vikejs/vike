import { describe, test, expect } from 'vitest'
import { build } from 'vike/api'

const stripAnsi = (str: string) => str.replace(/\x1b\[[0-9;]*m/g, '')

describe('build', () => {
  test('HTML input on environments.client with builder.sharedConfigBuild', { timeout: 60 * 1000 }, async () => {
    const promise = build({
      viteConfig: {
        logLevel: 'silent',
        root: __dirname,
        builder: { sharedConfigBuild: true },
        environments: { client: { build: { rollupOptions: { input: 'index.html' } } } },
      },
    })
    await expect(promise).rejects.toSatisfy((err: Error) =>
      stripAnsi(err.message).includes(
        'The entry index.html of config build.rollupOptions.input is an HTML entry which is forbidden when using Vike',
      ),
    )
  })
})
