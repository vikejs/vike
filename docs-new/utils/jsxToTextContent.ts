import { assert } from './assert'

export { jsxToTextContent }

// https://stackoverflow.com/questions/34204975/react-is-there-something-similar-to-node-textcontent/60564620#60564620
function jsxToTextContent(node: JSX.Element | string): string {
  if (['string', 'number'].includes(typeof node)) return String(node)
  if (node instanceof Array) return node.map(jsxToTextContent).join('')
  if (typeof node === 'object' && node) return jsxToTextContent(node.props.children)
  assert(false)
}
