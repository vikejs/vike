import { isReactInvalidComponentError } from '../logHintForCjsEsmError'
import { expect, describe, it } from 'vitest'

describe('isReactInvalidComponentError()', () => {
  react_invalid_component()
})

// Classic: React's infamous invalid component error.
function react_invalid_component() {
  it('React: invalid component', () => {
    expect(true).toBe(
      isReactInvalidComponentError(
        /* Error artificially created:
        ```diff
        // node_modules/vike-react/dist/renderer/onRenderHtml.js:
        - import { PageContextProvider } from './PageContextProvider.js';
        + const PageContextProvider = undefined
        ``` */
        // https://github.com/brillout/vps-mui/tree/reprod-1
        // https://github.com/vikejs/vike/discussions/830#discussion-5143519
        // https://github.com/vikejs/vike/discussions/830#discussioncomment-5763136
        // https://github.com/vikejs/vike/discussions/571#discussioncomment-6141003
        // https://github.com/vikejs/vike/discussions/1031#discussion-5426053
        // https://github.com/vikejs/vike/discussions/1080#discussion-5535121
        {
          message:
            "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.",
          code: undefined,
          stack: `
Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
    at renderElement (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6047:9)
    at renderNodeDestructiveImpl (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6108:11)
    at renderNodeDestructive (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6080:14)
    at renderElement (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:5975:9)
    at renderNodeDestructiveImpl (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6108:11)
    at renderNodeDestructive (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6080:14)
    at retryTask (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6532:5)
    at performWork (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6580:7)
    at /home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:6904:12
    at scheduleWork (/home/romu/code/vike/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js:78:3)
`
        }
      )
    )
    expect(true).toBe(
      isReactInvalidComponentError(
        // Also catch `but got: object`
        {
          message:
            "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.",
          // Fake error obejct
          code: undefined,
          stack: ``
        }
      )
    )
    expect(true).toBe(
      isReactInvalidComponentError(
        // Or any other invalid value
        {
          message:
            "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: foo. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.",
          // Fake error obejct
          code: undefined,
          stack: ``
        }
      )
    )
  })
}
