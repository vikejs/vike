A "page wrapper" can be added to all your pages by using the render(/hydrate) functions defined in `_default.page.server.js` and `_default.page.client.js`.

```jsx
// _default.page.server.jsx

import React from 'react'
import ReactDOM from 'react-dom'
import { PageLayout } from '../components/PageLayout'

export default { render }

function render(Page, initialProps) {
  const page = (
    <PageLayout>
      <Page {...initialProps} />
    </PageLayout>
  )

  return ReactDOMServer.renderToString(page)
}
```

```jsx
// _default.page.client.jsx

import React from 'react'
import ReactDOM from 'react-dom'
import { PageLayout } from '../components/PageLayout'
import { getPage } from 'vite-plugin-ssr/client'

const { Page, initialProps } = await getPage()

const page = (
  <PageLayout>
    <Page {...initialProps} />
  </PageLayout>
)

ReactDOM.hydrate(page, document.getElementById('page-view'))
```

