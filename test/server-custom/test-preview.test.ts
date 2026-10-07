import { test, expect } from '@brillout/test-e2e'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { testRun } from './.testRun'

testRun('pnpm run preview', { serverIsReadyMessage: 'Server listening' })

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist')

test('dist/server/index.mjs is +server.ts with its exports preserved', () => {
  const code = fs.readFileSync(path.join(dist, 'server/index.mjs'), 'utf8')
  expect(code).toContain('Hello from Express')
  expect(code).toMatch(/export\s*\{[^}]*\bMY_SETTING\b/)
})

test("pre-rendering doesn't execute +server.ts", () => {
  expect(fs.existsSync(path.join(dist, 'client/index.html'))).toBe(true)
  // Only `pnpm run server:prod` should have executed dist/server/index.mjs
  expect(fs.readFileSync(path.join(dist, 'server/executed.log'), 'utf8')).toBe('executed\n')
})
