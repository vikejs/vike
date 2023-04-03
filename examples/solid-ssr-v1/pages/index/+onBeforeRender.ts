import { IPageContext } from 'types'

async function onBeforeRender(pageContext: IPageContext) {
  return {
    pageContext: {
      documentProps: {
        title: 'Solid SSR v1 Design',
        description: 'Here is description'
      }
    }
  }
}

export default onBeforeRender
