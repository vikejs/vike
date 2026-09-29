import { testRunClassic } from '../../test/utils'
import { testVikeRuntime } from './testVikeRuntime'
import { test, expect } from '@brillout/test-e2e'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

testRunClassic('pnpm run preview')
testVikeRuntime()

test("the worker environment doesn't contain Vike's server entry", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'dist/worker/.vite/manifest.json'), 'utf-8'))
  const ids = Object.keys(manifest)
  expect(ids).not.toContain('virtual:@brillout/vite-plugin-server-entry:serverEntry')
  expect(ids).not.toContain('virtual:vike:global-entry:server')
})
