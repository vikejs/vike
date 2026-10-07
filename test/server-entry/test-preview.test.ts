import { test, expect, fetchHtml } from '@brillout/test-e2e'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { testRun } from './.testRun'

testRun('pnpm run preview', {
  serverIsReadyMessage: 'Listening on:',
  // TO-DO/soon: remove once https://github.com/universal-deploy/universal-deploy/pull/47 is released
  tolerateError: ({ logText }) => logText.includes('is missing "virtual:ud:catch-all" import'),
})

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist')

test('+serverEntry.ts route', async () => {
  expect(await fetchHtml('/health')).toBe('OK from +serverEntry.ts')
})

test('dist/server/index.mjs is +serverEntry.ts with its exports preserved', () => {
  const code = fs.readFileSync(path.join(dist, 'server/index.mjs'), 'utf8')
  expect(code).toContain('OK from +serverEntry.ts')
  expect(code).toMatch(/export\s*\{[^}]*\bMY_EXPORT\b/)
})

test("pre-rendering doesn't execute +serverEntry.ts", () => {
  expect(fs.existsSync(path.join(dist, 'client/index.html'))).toBe(true)
  // Only `vike preview` should have executed dist/server/index.mjs
  expect(fs.readFileSync(path.join(dist, 'server/executed.log'), 'utf8')).toBe('executed\n')
})
