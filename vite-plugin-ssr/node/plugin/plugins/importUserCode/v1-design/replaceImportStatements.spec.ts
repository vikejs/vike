import { expect, describe, it } from 'vitest'
import { replaceImportStatements } from './replaceImportStatements.js'

const file = '/fake-file.js'

describe('getErrMsg()', () => {
  it('basics', () => {
    expect(replaceImportStatements("import { something } from './bla.js'", file)).toMatchInlineSnapshot(`
      {
        "code": "const something = '​import:./bla.js:something';",
        "fileImports": [
          {
            "importDataString": "​import:./bla.js:something",
            "importLocalName": "something",
            "importStatementCode": "import { something } from './bla.js'",
          },
        ],
        "noImportStatement": false,
      }
    `)
    expect(replaceImportStatements("import def from './bla.js'", file)).toMatchInlineSnapshot(`
      {
        "code": "const def = '​import:./bla.js:default';",
        "fileImports": [
          {
            "importDataString": "​import:./bla.js:default",
            "importLocalName": "def",
            "importStatementCode": "import def from './bla.js'",
          },
        ],
        "noImportStatement": false,
      }
    `)
    expect(replaceImportStatements("import { bla as blu } from './bla.js'", file)).toMatchInlineSnapshot(`
      {
        "code": "const blu = '​import:./bla.js:bla';",
        "fileImports": [
          {
            "importDataString": "​import:./bla.js:bla",
            "importLocalName": "blu",
            "importStatementCode": "import { bla as blu } from './bla.js'",
          },
        ],
        "noImportStatement": false,
      }
    `)
    expect(replaceImportStatements("import * as blo from './bla.js'", file)).toMatchInlineSnapshot(`
      {
        "code": "const blo = '​import:./bla.js:*';",
        "fileImports": [
          {
            "importDataString": "​import:./bla.js:*",
            "importLocalName": "blo",
            "importStatementCode": "import * as blo from './bla.js'",
          },
        ],
        "noImportStatement": false,
      }
    `)
  })
})
