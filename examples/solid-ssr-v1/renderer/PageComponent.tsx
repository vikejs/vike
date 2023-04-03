import { PageContext, usePageContext } from '#/composables/usePageContext'
import { IPageContext } from '#/types'
import { JSXElement, ParentComponent } from 'solid-js'
import { Dynamic } from 'solid-js/web'

const PassThrough: ParentComponent = (props) => {
  return <>{props.children}</>
}

export function PageComponent(pageContext: IPageContext) {
  return (
    <PageContext.Provider value={pageContext}>
      <Wrapper>
        <Layout>
          <Page />
        </Layout>
      </Wrapper>
    </PageContext.Provider>
  )
}

function Wrapper(props: { children: JSXElement }) {
  const pageContext = usePageContext()
  return <Dynamic component={pageContext?.exports?.Wrapper ?? PassThrough}>{props.children}</Dynamic>
}

function Layout(props: { children: JSXElement }) {
  const pageContext = usePageContext()
  return <Dynamic component={pageContext?.exports?.Layout ?? PassThrough}>{props.children}</Dynamic>
}

function Page() {
  const pageContext = usePageContext()
  return <Dynamic component={pageContext?.Page} {...(pageContext?.pageProps ?? {})} />
}
