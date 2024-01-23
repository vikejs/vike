import { expect, describe, it } from 'vitest'
import { isVikeRealImport, transformImportStatements } from './transformImportStatements.js'

describe('transformImportStatements()', () => {
  it('works', () => {
    expect(t("import { something } from './bla.js'")).toMatchInlineSnapshot(`
      {
        "code": "const something = '​import:./bla.js:something';",
        "fileImportsTransformed": [
          {
            "importLocalName": "something",
            "importStatementCode": "import { something } from './bla.js'",
            "importString": "​import:./bla.js:something",
          },
        ],
        "noTransformation": false,
      }
    `)
    expect(t("import def from './bla.js'")).toMatchInlineSnapshot(`
      {
        "code": "const def = '​import:./bla.js:default';",
        "fileImportsTransformed": [
          {
            "importLocalName": "def",
            "importStatementCode": "import def from './bla.js'",
            "importString": "​import:./bla.js:default",
          },
        ],
        "noTransformation": false,
      }
    `)
    expect(t("import { bla as blu } from './bla.js'")).toMatchInlineSnapshot(`
      {
        "code": "const blu = '​import:./bla.js:bla';",
        "fileImportsTransformed": [
          {
            "importLocalName": "blu",
            "importStatementCode": "import { bla as blu } from './bla.js'",
            "importString": "​import:./bla.js:bla",
          },
        ],
        "noTransformation": false,
      }
    `)
    expect(t("import * as blo from './bla.js'")).toMatchInlineSnapshot(`
      {
        "code": "const blo = '​import:./bla.js:*';",
        "fileImportsTransformed": [
          {
            "importLocalName": "blo",
            "importStatementCode": "import * as blo from './bla.js'",
            "importString": "​import:./bla.js:*",
          },
        ],
        "noTransformation": false,
      }
    `)
  })
})

describe('transformImportStatements()', () => {
  it('basics', () => {
    expect(isVikeRealImport('bla', 0)).toBe(false)
    expect(isVikeRealImport('// @vike-real-import', 0)).toBe(true)
    expect(isVikeRealImport('// @vike-real-impor', 0)).toBe(false)
    expect(
      isVikeRealImport(
        `// @vike-real-import
    something`,
        0
      )
    ).toBe(true)
    expect(
      isVikeRealImport(
        `bla
    // @vike-real-import
    something`,
        0
      )
    ).toBe(false)
  })
  it('edge cases', () => {
    expect(isVikeRealImport('', 0)).toBe(false)
    expect(isVikeRealImport('', 1)).toBe(false)
    expect(isVikeRealImport('@vike-real-import', 1)).toBe(false)
    expect(isVikeRealImport('@vike-real-import', 0)).toBe(true)
    expect(isVikeRealImport('@vike-real-import\n', 0)).toBe(true)
    expect(isVikeRealImport('@vike-real\n-import', 0)).toBe(false)
    expect(isVikeRealImport('\n@vike-real-import', 0)).toBe(false)
    expect(isVikeRealImport(' @vike-real-import', 0)).toBe(true)
  })
})

function t(code: string) {
  return transformImportStatements(code, '/fake-file.js')
}
