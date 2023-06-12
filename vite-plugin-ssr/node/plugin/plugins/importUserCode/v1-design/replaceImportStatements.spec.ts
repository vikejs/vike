import { expect, describe, it } from 'vitest'
import { replaceImportStatements } from './replaceImportStatements'

const file = '/fake-file.js'

describe('getErrMsg()', () => {
  it('basics', () => {
    expect(replaceImportStatements("import { something } from './bla'", file)).toMatchInlineSnapshot(`
      {
        "code": "const something = '​import:./bla:something';",
        "fileImports": [
          {
            "importDataString": "​import:./bla:something",
            "importLocalName": "something",
            "importStatementCode": "import { something } from './bla'",
          },
        ],
        "noImportStatement": false,
      }
    `)
    expect(replaceImportStatements("import def from './bla'", file)).toMatchInlineSnapshot(`
      {
        "code": "const def = '​import:./bla:default';",
        "fileImports": [
          {
            "importDataString": "​import:./bla:default",
            "importLocalName": "def",
            "importStatementCode": "import def from './bla'",
          },
        ],
        "noImportStatement": false,
      }
    `)
  })
})
