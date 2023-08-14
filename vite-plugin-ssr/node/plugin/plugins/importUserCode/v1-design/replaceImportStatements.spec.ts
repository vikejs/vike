import { expect, describe, it } from 'vitest'
import { replaceImportStatements } from './replaceImportStatements.mjs'

const file = '/fake-file.js'

describe('getErrMsg()', () => {
  it('basics', () => {
    expect(replaceImportStatements("import { something } from './bla.mjs'", file)).toMatchInlineSnapshot(`
      {
        "code": "const something = '​import:./bla:something';",
        "fileImports": [
          {
            "importDataString": "​import:./bla:something",
            "importLocalName": "something",
            "importStatementCode": "import { something } from './bla.mjs'",
          },
        ],
        "noImportStatement": false,
      }
    `)
    expect(replaceImportStatements("import def from './bla.mjs'", file)).toMatchInlineSnapshot(`
      {
        "code": "const def = '​import:./bla:default';",
        "fileImports": [
          {
            "importDataString": "​import:./bla:default",
            "importLocalName": "def",
            "importStatementCode": "import def from './bla.mjs'",
          },
        ],
        "noImportStatement": false,
      }
    `)
    expect(replaceImportStatements("import { bla as blu } from './bla.mjs'", file)).toMatchInlineSnapshot(`
      {
        "code": "const blu = '​import:./bla:bla';",
        "fileImports": [
          {
            "importDataString": "​import:./bla:bla",
            "importLocalName": "blu",
            "importStatementCode": "import { bla as blu } from './bla.mjs'",
          },
        ],
        "noImportStatement": false,
      }
    `)
    expect(replaceImportStatements("import * as blo from './bla.mjs'", file)).toMatchInlineSnapshot(`
      {
        "code": "const blo = '​import:./bla:*';",
        "fileImports": [
          {
            "importDataString": "​import:./bla:*",
            "importLocalName": "blo",
            "importStatementCode": "import * as blo from './bla.mjs'",
          },
        ],
        "noImportStatement": false,
      }
    `)
  })
})
