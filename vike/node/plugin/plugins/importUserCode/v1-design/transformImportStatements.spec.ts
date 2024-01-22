import { expect, describe, it } from 'vitest'
import { transformImportStatements } from './transformImportStatements.js'

const file = '/fake-file.js'

describe('getErrMsg()', () => {
  it('basics', () => {
    expect(transformImportStatements("import { something } from './bla.js'", file)).toMatchInlineSnapshot(`
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
    expect(transformImportStatements("import def from './bla.js'", file)).toMatchInlineSnapshot(`
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
    expect(transformImportStatements("import { bla as blu } from './bla.js'", file)).toMatchInlineSnapshot(`
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
    expect(transformImportStatements("import * as blo from './bla.js'", file)).toMatchInlineSnapshot(`
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
