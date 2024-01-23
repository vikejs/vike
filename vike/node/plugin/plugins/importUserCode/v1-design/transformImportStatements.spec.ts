import { expect, describe, it } from 'vitest'
import { transformImportStatements } from './transformImportStatements.js'

function t(code: string) {
  return transformImportStatements(code, '/fake-file.js')
}

describe('transformImportStatements()', () => {
  it('basics', () => {
    expect(t('bla')).toMatchInlineSnapshot(`
      {
        "noTransformation": true,
      }
    `)
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
  it('real imports', () => {
    expect(t("import { something } from './bla.js?real'")).toMatchInlineSnapshot(`
      {
        "code": "import { something } from ./bla.js",
        "fileImportsTransformed": [],
        "noTransformation": false,
      }
    `)
  })
})
