export default onRenderHtml

import { escapeInject } from '../../../vite-plugin-ssr/node/runtime'

async function onRenderHtml() {
  /*/
  return escapeInject`<div id="react-container"></div>`
  /*/
  return escapeInject``
  //*/
}
