export { render }

import { escapeInject } from '../../../vite-plugin-ssr/node'

async function render() {
  /*/
  return escapeInject`<div id="react-container"></div>`
  /*/
  return escapeInject`<head><meta charset="utf-8"></head>`
  //*/
}
