import { expect, describe, it } from 'vitest'
import { transformPointerImports } from './pointerImports.js'

function t(code: string) {
  return transformPointerImports(code, '/fake-file.js', 'all', true)
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
})
