#!/usr/bin/env node

/**
 * Assert assertEnv imports
 *
 * This linter ensures all TypeScript files import the appropriate assertEnv*.ts file.
 * The assertEnv imports validate runtime environment assumptions at module load time.
 *
 * Usage:
 *   pnpm run lint                    # From project root
 *   node scripts/lint-assertenv.mjs  # From packages/vike/
 *   node lint-assertenv.mjs          # From packages/vike/scripts/
 */

import fs from 'node:fs'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// =============================================================================
// Configuration
// =============================================================================

const WHITELIST_PATTERNS = [
  // Build-time code
  'src/node/prerender/**',

  // Shared code (environment-agnostic utilities and types)
  'src/shared-server-client/**',
  'src/shared-server-node/**',
  'src/types/**',
  'src/utils/**',

  // Specific exceptions
  'src/node/createDevMiddleware.ts',
  'src/node/api/types.ts',
  'src/client/runtime-client-routing/prefetch/PrefetchSetting.ts',
]

const ASSERT_ENV_IMPORT_PATTERN = /import\s+.*['"].*assertEnv.*\.js['"]/

// =============================================================================
// Path resolution
// =============================================================================

const scriptDir = dirname(fileURLToPath(import.meta.url))
const packageRoot = join(scriptDir, '..')

// =============================================================================
// Core logic
// =============================================================================

function findTypeScriptFiles() {
  const output = execSync(
    'find src -name "*.ts" -type f ! -name "*.spec.ts" ! -name "*.test.ts" ! -name "assertEnv*.ts"',
    { encoding: 'utf-8', cwd: packageRoot },
  )

  return output
    .trim()
    .split('\n')
    .filter((line) => line.length > 0)
}

function hasAssertEnvImport(filePath) {
  const content = fs.readFileSync(join(packageRoot, filePath), 'utf-8')
  return ASSERT_ENV_IMPORT_PATTERN.test(content)
}

function matchesGlobPattern(filePath, pattern) {
  const regexPattern = pattern
    .replace(/\./g, '\\.') // Escape dots
    .replace(/\*\*/g, '___DOUBLESTAR___') // Temporarily replace **
    .replace(/\*/g, '[^/]*') // * matches anything except /
    .replace(/___DOUBLESTAR___/g, '.*') // ** matches anything including /

  return new RegExp(`^${regexPattern}$`).test(filePath)
}

function isWhitelisted(filePath) {
  return WHITELIST_PATTERNS.some((pattern) => matchesGlobPattern(filePath, pattern))
}

function analyzeFiles(files) {
  const withImport = []
  const withoutImport = []
  const missingImport = [] // Not whitelisted and missing import
  const invalidWhitelist = [] // Whitelisted but has import

  for (const file of files) {
    const hasImport = hasAssertEnvImport(file)
    const whitelisted = isWhitelisted(file)

    if (hasImport) {
      withImport.push(file)
      if (whitelisted) {
        invalidWhitelist.push(file)
      }
    } else {
      withoutImport.push(file)
      if (!whitelisted) {
        missingImport.push(file)
      }
    }
  }

  return {
    total: files.length,
    withImport: withImport.length,
    withoutImport: withoutImport.length,
    whitelisted: withoutImport.filter(isWhitelisted).length,
    missingImport,
    invalidWhitelist,
  }
}

function reportSuccess(stats) {
  console.log(`✓ Total .ts files checked: ${stats.total}`)
  console.log(`✓ Files with assertEnv import: ${stats.withImport}`)
  console.log(`✓ Files without assertEnv import: ${stats.withoutImport}`)
  console.log(`✓ Whitelisted files: ${stats.whitelisted}`)
  console.log('\n✅ All .ts files either have assertEnv*.ts import or are whitelisted.')
}

function reportInvalidWhitelist(files) {
  console.error(`\n❌ WHITELIST ERROR: ${files.length} file(s) are whitelisted but DO have assertEnv*.ts import:\n`)
  files.forEach((file) => console.error(`  - ${file}`))
  console.error('\nThese files should be REMOVED from WHITELIST_PATTERNS in scripts/lint-assertenv.mjs\n')
}

function reportMissingImports(files) {
  console.error(`\n❌ ERROR: ${files.length} file(s) are missing assertEnv*.ts import:\n`)
  files.forEach((file) => console.error(`  - ${file}`))
  console.error(
    '\nPlease either:\n' +
      '  1. Add the appropriate assertEnv*.ts import to these files, or\n' +
      '  2. Add them to the WHITELIST_PATTERNS in scripts/lint-assertenv.mjs\n',
  )
}

// =============================================================================
// Main
// =============================================================================

function main() {
  const files = findTypeScriptFiles()
  const stats = analyzeFiles(files)

  // Validate whitelist accuracy first
  if (stats.invalidWhitelist.length > 0) {
    reportInvalidWhitelist(stats.invalidWhitelist)
    process.exit(1)
  }

  // Check for missing imports
  if (stats.missingImport.length > 0) {
    reportMissingImports(stats.missingImport)
    process.exit(1)
  }

  // Success!
  reportSuccess(stats)
}

main()
