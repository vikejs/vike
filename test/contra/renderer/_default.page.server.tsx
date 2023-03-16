export { render }

import { escapeInject } from '../../../vite-plugin-ssr/node/runtime'

async function render() {
  /*/
  return escapeInject`<div id="react-container"></div>`
  /*/
  return escapeInject``
  //*/
}
