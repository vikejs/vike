import React from 'react'
import type { PropsWithChildren, ReactNode } from 'react'
import { Link } from '@brillout/docpress'
import AdminAndMarketingConfigs from './snippets/AdminAndMarketingConfigs.mdx'
import ApolloExample from './snippets/ApolloExample.mdx'
import DataClientExample from './snippets/DataClientExample.mdx'
import DataServerExample from './snippets/DataServerExample.mdx'
import GetGlobalContextExample from './snippets/GetGlobalContextExample.mdx'
import GlobalContextClientExample from './snippets/GlobalContextClientExample.mdx'
import GlobalContextServerExample from './snippets/GlobalContextServerExample.mdx'
import GuardExample from './snippets/GuardExample.mdx'
import I18nExample from './snippets/I18nExample.mdx'
import InstrumentationExample from './snippets/InstrumentationExample.mdx'
import ProductConfigExample from './snippets/ProductConfigExample.mdx'
import ReactQueryExample from './snippets/ReactQueryExample.mdx'
import ServerIntegrationExample from './snippets/ServerIntegrationExample.mdx'
import SsrSpaSsgTree from './snippets/SsrSpaSsgTree.mdx'
import TelefuncClientExample from './snippets/TelefuncClientExample.mdx'
import TelefuncServerExample from './snippets/TelefuncServerExample.mdx'
import ZustandExample from './snippets/ZustandExample.mdx'

function DxContent() {
  return (
    <div className="space-y-16">
      <TwoColumn>
        <Block>
          <SectionTitle>First-class SSR/SPA/SSG support</SectionTitle>
          <p>
            Toggle <Link href="/ssr">SSR</Link>/<Link href="/SSR-vs-SPA">SPA</Link>/
            <Link href="/pre-rendering">SSG</Link> on a page-by-page basis, powered by{' '}
            <Link href="/config#inheritance">config inheritance</Link>.
          </p>
          <SsrSpaSsgTree />
        </Block>
        <Block>
          <ProductConfigExample />
          <AdminAndMarketingConfigs />
        </Block>
      </TwoColumn>

      <Section>
        <SectionTitle>API</SectionTitle>
        <SubSectionTitle>Next-gen RPC (aka Server Functions)...</SubSectionTitle>
        <p>
          ...via the next-generation tool <a href="https://telefunc.com">Telefunc</a> (maintained by the Vike team), or
          use classic tools such as tRPC.
        </p>
        <TwoColumn>
          <TelefuncServerExample />
          <TelefuncClientExample />
        </TwoColumn>
      </Section>

      <Divider />

      <TwoColumn>
        <Block>
          <SubSectionTitle>First-class REST</SubSectionTitle>
          <p>
            Consume REST APIs via Vike&apos;s built-in hook <Link href="/data">+data</Link>, or via extensions such as{' '}
            <a href="https://github.com/vikejs/vike-react/tree/main/packages/vike-react-query#readme">
              vike-react-query
            </a>
            /<a href="https://github.com/vikejs/vike-vue/tree/main/packages/vike-vue-query#readme">vike-vue-query</a>/
            <a href="https://github.com/vikejs/vike-solid/tree/main/packages/vike-solid-query#readme">
              vike-solid-query
            </a>
            .
          </p>
        </Block>
        <Block>
          <SubSectionTitle>First-class GraphQL</SubSectionTitle>
          <p>
            Consume GraphQL APIs via extensions such as{' '}
            <a href="https://github.com/vikejs/vike-react/tree/main/packages/vike-react-apollo#readme">
              vike-react-apollo
            </a>
            , or via <Link href="/graphql">custom integrations</Link>.
          </p>
        </Block>
      </TwoColumn>

      <TwoColumn>
        <ReactQueryExample />
        <ApolloExample />
      </TwoColumn>

      <Section>
        <SectionTitle>Powerful hooks</SectionTitle>
        <TwoColumn>
          <Block>
            <SubSectionTitle>Data fetching: where</SubSectionTitle>
            <p>Hooks give you control where data is fetched:</p>
            <DataServerExample />
            <DataClientExample />
          </Block>
          <Block>
            <SubSectionTitle>Data fetching: when</SubSectionTitle>
            <p>Also control when data is fetched. When the server starts:</p>
            <GlobalContextServerExample />
            <p>When client-side navigation starts:</p>
            <GlobalContextClientExample />
            <p>
              <Link href="/globalContext">globalContext</Link> can be accessed anywhere:
            </p>
            <GetGlobalContextExample />
          </Block>
        </TwoColumn>

        <TwoColumn>
          <Block>
            <SubSectionTitle>Authorization</SubSectionTitle>
            <GuardExample />
          </Block>
          <Block>
            <SubSectionTitle>Instrumentation</SubSectionTitle>
            <InstrumentationExample />
          </Block>
        </TwoColumn>

        <TwoColumn>
          <Block>
            <SubSectionTitle>Server integration</SubSectionTitle>
            <p>Vike is just a middleware you can embed into any server.</p>
            <ServerIntegrationExample />
          </Block>
          <Block>
            <SubSectionTitle>i18n</SubSectionTitle>
            <p>Hooks give you full control over i18n integration.</p>
            <I18nExample />
          </Block>
        </TwoColumn>

        <CenterText>
          Growing <Link href="/hooks">hooks suite</Link>.
        </CenterText>
      </Section>

      <Section>
        <SectionTitle>Powerful extensions</SectionTitle>
        <CenterText>
          <Link href="/extensions">Vike extensions</Link> powered by the same hooks you use, for deep and seamless
          integrations.
        </CenterText>

        <TwoColumn>
          <Block>
            <SubSectionTitle>UI framework extensions</SubSectionTitle>
            <p>
              Use Vike with any UI framework via Vike extensions for a quick start, or via{' '}
              <Link href="/integration#ui-framework">manual integration</Link> for maximum flexibility.
            </p>
            <List
              items={[
                <span key="frameworks">
                  <code>vike-react</code> / <code>vike-vue</code> / <code>vike-solid</code>
                </span>,
              ]}
            />
          </Block>
          <Block>
            <SubSectionTitle>Advanced UI framework integration</SubSectionTitle>
            <p>
              Extensions are powerful enough to integrate advanced technologies, including RSC (React Server
              Components).
            </p>
            <List items={[<code key="rsc">vike-react-rsc</code>]} />
          </Block>
        </TwoColumn>

        <TwoColumn>
          <Block>
            <SubSectionTitle>
              <a href="https://github.com/vikejs/vike-react/tree/main/packages/vike-react-zustand#readme">
                vike-react-zustand
              </a>
            </SubSectionTitle>
            <ZustandExample />
          </Block>
          <Block>
            <SubSectionTitle>
              <a href="https://github.com/vikejs/vike-react/tree/main/packages/vike-react-sentry#readme">
                vike-react-sentry
              </a>
            </SubSectionTitle>
            <p>Full-fledged and seamless Sentry integration.</p>
            <List
              items={[
                'Browser and server error tracking',
                'Performance monitoring and tracing',
                'Automatic source map upload',
              ]}
            />
          </Block>
        </TwoColumn>

        <CenterText>
          Growing <Link href="/extensions">extension ecosystem</Link>.
        </CenterText>
      </Section>
    </div>
  )
}

function Section({ children }: PropsWithChildren) {
  return <section className="space-y-8">{children}</section>
}

function TwoColumn({ children }: PropsWithChildren) {
  return <div className="grid gap-8 md:grid-cols-2">{children}</div>
}

function Block({ children }: PropsWithChildren) {
  return <div className="space-y-4">{children}</div>
}

function SectionTitle({ children }: PropsWithChildren) {
  return <h3 className="text-2xl font-semibold">{children}</h3>
}

function SubSectionTitle({ children }: PropsWithChildren) {
  return <h4 className="text-lg font-medium">{children}</h4>
}

function CenterText({ children }: PropsWithChildren) {
  return <p className="text-center">{children}</p>
}

function Divider() {
  return <hr className="border-grey-200" />
}

function List({ items }: { items: ReactNode[] | string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item, index) => (
        <li key={typeof item === 'string' ? item : index}>{item}</li>
      ))}
    </ul>
  )
}

export default DxContent
