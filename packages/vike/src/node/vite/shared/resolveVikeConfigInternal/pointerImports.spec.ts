import { expect, describe, it } from 'vitest'
import { transformPointerImports } from './pointerImports.js'

function t(code: string) {
  return transformPointerImports(code, '/fake-file.js', 'all', true)
}

function tWithMap(code: string, pointerImports: Record<string, boolean>) {
  return transformPointerImports(code, '/fake-file.js', pointerImports, true)
}

describe('transformPointerImports()', () => {
  it('basics', () => {
    expect(t('bla')).toMatchInlineSnapshot(`null`)
    expect(t("import { something } from './bla.js'")).toMatchInlineSnapshot(
      `"const something = '​import:./bla.js:something';"`,
    )
    expect(t("import def from './bla.js'")).toMatchInlineSnapshot(`"const def = '​import:./bla.js:default';"`)
  })
  it('removes unused imports', () => {
    expect(t("import './style.css'")).toMatchInlineSnapshot(`""`)
    expect(t("import './script.js'")).toMatchInlineSnapshot(`""`)
  })
  it('import as', () => {
    expect(t("import { bla as blu } from './bla.js'")).toMatchInlineSnapshot(`"const blu = '​import:./bla.js:bla';"`)
    expect(t("import * as blo from './bla.js'")).toMatchInlineSnapshot(`"const blo = '​import:./bla.js:*';"`)
  })
  it('does not add lines when transforming pointer imports', () => {
    const code = [
      "import { createRequire } from 'node:module'",
      "import { something } from './bla.js'",
      "throw new Error('probe')",
    ].join('\n')

    const codeMod = tWithMap(code, {
      'node:module': false,
      './bla.js': true,
    })

    expect(codeMod).toBeTruthy()
    expect(codeMod!.split('\n')).toHaveLength(code.split('\n').length)
  })
  it('preserves non-pointer imports', () => {
    expect(
      tWithMap(
        [
          "import { createRequire } from 'node:module'",
          "import { something } from './bla.js'",
          'export { createRequire }',
        ].join('\n'),
        {
          'node:module': false,
          './bla.js': true,
        },
      ),
    ).toMatchInlineSnapshot(`
      "const something = '​import:./bla.js:something';import { createRequire } from 'node:module'

      export { createRequire }"
    `)
  })
})
