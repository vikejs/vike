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
            "importLocalName": "something",
            "importStatementCode": "import { something } from './bla.js'",
            "importString": "​import:./bla.js:something",
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
            "importLocalName": "def",
            "importStatementCode": "import def from './bla.js'",
            "importString": "​import:./bla.js:default",
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
            "importLocalName": "blu",
            "importStatementCode": "import { bla as blu } from './bla.js'",
            "importString": "​import:./bla.js:bla",
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
            "importLocalName": "blo",
            "importStatementCode": "import * as blo from './bla.js'",
            "importString": "​import:./bla.js:*",
          },
        ],
        "noImportStatement": false,
      }
    `)
  })
})
