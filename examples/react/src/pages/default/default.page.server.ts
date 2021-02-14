import ReactDOMServer from 'react-dom/server'
import React from 'react'

const pageConfig: any = {
  render({ pageView }: any) {
    const initialProps = {} // TODO
    const viewElement = React.createElement(pageView, initialProps)
    const viewHtml = ReactDOMServer.renderToString(viewElement)
    return viewHtml
  }
}

export default pageConfig
