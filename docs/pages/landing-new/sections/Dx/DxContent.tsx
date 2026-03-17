import React from 'react'
import type { ReactNode } from 'react'
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
import cm from '@classmatejs/react'

const DxContent = () => {
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
        <div>
          <Link href="/extensions">Extensions</Link> use the same powerful hooks you use, enabling deep and seamless
          integrations.
        </div>

        <TwoColumn>
          <Block>
            <SubSectionTitle>UI frameworks</SubSectionTitle>
            <p>
              Use any UI framework via an extension for a quick zero-config start, or via{' '}
              <Link href="/integration#ui-framework">manual integration</Link> for maximum flexibility.
            </p>
            <CenterText>
              <Link href="/vike-react">
                <code>vike-react</code>
              </Link>{' '}
              /{' '}
              <Link href="/vike-vue">
                <code>vike-vue</code>
              </Link>{' '}
              /{' '}
              <Link href="/vike-solid">
                <code>vike-solid</code>
              </Link>
            </CenterText>
          </Block>
          <Block>
            <SubSectionTitle>Advanced integrations</SubSectionTitle>
            <p>Extensions are powerful enough to integrate any advanced technologies such React Server Components.</p>
            <CenterText>
              <a href="https://github.com/nitedani/vike-react-rsc#vike-react-rsc">
                <code>vike-react-rsc</code>
              </a>
            </CenterText>
          </Block>
        </TwoColumn>

        <TwoColumn className="md:[grid-template-columns:0.54fr_1fr]">
          <Block>
            <SubSectionTitle>State management</SubSectionTitle>
            <p>
              The <a href="https://zustand.docs.pmnd.rs/learn/getting-started/introduction">Zustand</a> integration{' '}
              <a href="https://github.com/vikejs/vike-react/tree/main/packages/vike-react-zustand#readme">
                <code>vike-react-zustand</code>
              </a>{' '}
              is a deep integration.
            </p>
            <ZustandExample />
          </Block>
          <Block>
            <SubSectionTitle>Error tracking</SubSectionTitle>
            <p>
              The{' '}
              <a href="https://github.com/vikejs/vike-react/tree/main/packages/vike-react-sentry#readme">
                <code>vike-react-sentry</code>
              </a>{' '}
              integration is a deep integration.
            </p>
            <p>Full-fledged and seamless Sentry integration.</p>
            <List
              items={[
                'Browser & server error tracking',
                'Performance monitoring and tracing',
                'Automatic source map upload',
              ]}
            />
          </Block>
        </TwoColumn>

        <CenterText>
          Growing ecosystem of <Link href="/extensions">extensions</Link>.
        </CenterText>
      </Section>
    </div>
  )
}

const Section = cm.section`space-y-8`
const TwoColumn = cm.div`grid gap-8 md:grid-cols-2`
const Block = cm.div`space-y-4`
const SectionTitle = cm.h3`text-2xl font-semibold`
const SubSectionTitle = cm.h4`text-lg font-medium`
const CenterText = cm.p`text-center`
const Divider = cm.hr`border-grey-200`

const List = ({ items }: { items: ReactNode[] | string[] }) => {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item, index) => (
        <li key={typeof item === 'string' ? item : index}>{item}</li>
      ))}
    </ul>
  )
}

export default DxContent
