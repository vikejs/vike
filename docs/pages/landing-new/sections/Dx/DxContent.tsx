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
import { H3Headline, H4Headline } from '../../components/Headline'
import HeadlineGroup from '../../components/HeadlineGroup'
import GlassContainer from '../../components/GlassContainer'
import { ChevronsRight } from 'lucide-react'

const DxContent = () => {
  return (
    <div className="space-y-16">
      <GlassContainer>
        <Section className="py-10">
          <SectionTitle className="text-center mb-10">First-class SSR/SPA/SSG</SectionTitle>
          <TwoColumn>
            <Block>
              <p className="text-lg">
                Toggle{' '}
                <DX_InlineHighlight color="#b8d4eb" href="/ssr">
                  SSR
                </DX_InlineHighlight>
                /
                <DX_InlineHighlight color="#c0ebb8" href="/SSR-vs-SPA">
                  SPA
                </DX_InlineHighlight>
                /
                <DX_InlineHighlight color="#e9b8e8" href="/pre-rendering">
                  SSG
                </DX_InlineHighlight>{' '}
                on a page-by-page basis, powered by{' '}
                <DX_InlineHighlight color="#f4f5a6" href="/config#inheritance">
                  config inheritance
                </DX_InlineHighlight>
                .
              </p>
              <SsrSpaSsgTree />
            </Block>
            <Block>
              <ProductConfigExample />
              <AdminAndMarketingConfigs />
            </Block>
          </TwoColumn>
        </Section>
      </GlassContainer>

      <Section>
        <HeadlineGroup main="API" sub="" outerClassName="mb-10" />
        <SubSectionTitle>First-class RPC</SubSectionTitle>
        <p className="mb-0">
          Next-gen RPC (aka Server Functions) via <a href="https://telefunc.com">Telefunc</a> (maintained by the Vike
          team), or classic RPC via tools such as tRPC.
        </p>
        <TwoColumn className="mt-0">
          <TelefuncServerExample />
          <TelefuncClientExample />
        </TwoColumn>

        <TwoColumn>
          <Block>
            <SubSectionTitle>First-class REST</SubSectionTitle>
            <p>
              Consume REST APIs via Vike&apos;s built-in hook{' '}
              <Link href="/data">
                <code>+data</code>
              </Link>
              , or via extensions such as{' '}
              <a href="https://github.com/vikejs/vike-react/tree/main/packages/vike-react-query#readme">
                <code>vike-react-query</code>
              </a>
              {' / '}
              <a href="https://github.com/vikejs/vike-vue/tree/main/packages/vike-vue-query#readme">
                <code>vike-vue-query</code>
              </a>
              {' / '}
              <a href="https://github.com/vikejs/vike-solid/tree/main/packages/vike-solid-query#readme">
                <code>vike-solid-query</code>
              </a>
              .
            </p>
            <ReactQueryExample />
          </Block>
          <Block>
            <SubSectionTitle>First-class GraphQL</SubSectionTitle>
            <p>
              Consume GraphQL APIs via extensions such as{' '}
              <a href="https://github.com/vikejs/vike-react/tree/main/packages/vike-react-apollo#readme">
                <code>vike-react-apollo</code>
              </a>
              , or via a <Link href="/graphql">custom integration</Link>.
            </p>
            <ApolloExample />
          </Block>
        </TwoColumn>
      </Section>

      <Section>
        <SectionTitle id="hooks" className="mb-10 text-center">
          Hooks
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 lg:gap-8">
          <Block className="md:col-span-6">
            <SubSectionTitle>
              Data fetching: <i>where</i>
            </SubSectionTitle>
            <p>Hooks give you control where data is fetched:</p>
            <DataServerExample />
            <DataClientExample />
          </Block>
          <Block className="md:col-span-5">
            <SubSectionTitle>
              Data fetching: <i>when</i>
            </SubSectionTitle>
            <p>Also control when data is fetched. When the server starts:</p>
            <GlobalContextServerExample />
            <p>When client-side navigation starts:</p>
            <GlobalContextClientExample />
            <p>
              While{' '}
              <Link href="/globalContext">
                <code>globalContext</code>
              </Link>{' '}
              can be accessed anywhere:
            </p>
            <GetGlobalContextExample />
          </Block>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 lg:gap-8">
          <Block className="md:col-span-6">
            <SubSectionTitle>Authorization</SubSectionTitle>
            <GuardExample />
          </Block>
          <Block className="md:col-span-5">
            <SubSectionTitle>Instrumentation</SubSectionTitle>
            <InstrumentationExample />
          </Block>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 lg:gap-8">
          <Block className="md:col-span-6">
            <SubSectionTitle>Server integration</SubSectionTitle>
            <p>Vike is just a middleware you can embed into any server.</p>
            <ServerIntegrationExample />
          </Block>
          <Block className="md:col-span-5">
            <SubSectionTitle>i18n</SubSectionTitle>
            <p>Hooks give you full control over i18n integration.</p>
            <I18nExample />
          </Block>
        </div>

        <ClosingWords href="/hooks">
          See the growing suite of hooks. <ChevronsRight className="w-4 h-4 md:w-5 md:h-5" />
        </ClosingWords>
      </Section>

      <Section>
        {/* <SectionTitle>Powerful extensions</SectionTitle>
        <div>
          <Link href="/extensions">Extensions</Link> use the same powerful hooks users use — enabling deep and seamless
          integrations.
        </div> */}
        <HeadlineGroup
          main="Powerful extensions"
          sub="Extensions use the same powerful hooks users use — enabling deep and seamless integrations."
          outerClassName="mb-10 max-w-2xl mx-auto"
        />

        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 lg:gap-8">
          <Block className="md:col-span-6">
            <SubSectionTitle>UI frameworks</SubSectionTitle>
            <p>
              Use your favorite UI framework via an extension for getting started quickly, or{' '}
              <Link href="/integration#ui-framework">integrate it manually</Link> for maximum flexibility.
            </p>
            <CenterText>
              <Link href="/vike-react">
                <code>vike-react</code>
              </Link>
              {' / '}
              <Link href="/vike-vue">
                <code>vike-vue</code>
              </Link>
              {' / '}
              <Link href="/vike-solid">
                <code>vike-solid</code>
              </Link>
            </CenterText>
          </Block>
          <Block className="md:col-span-5">
            <SubSectionTitle>Advanced integrations</SubSectionTitle>
            <p>
              Extensions can use all of Vike's powerful hooks for advanced integrations such as React Server Components.
            </p>
            <CenterText>
              <a href="https://github.com/nitedani/vike-react-rsc#vike-react-rsc">
                <code>vike-react-rsc</code>
              </a>
            </CenterText>
          </Block>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 lg:gap-8">
          <Block className="md:col-span-6">
            <SubSectionTitle>State management</SubSectionTitle>
            <p>
              Vike's powerful hooks also enable extensions to deeply integrate with state management tools.
              <CenterText>
                <a href="https://github.com/vikejs/vike-react/tree/main/packages/vike-react-redux#readme">
                  <code>vike-react-redux</code>
                </a>
                {' / '}
                <a href="https://github.com/vikejs/vike-react/tree/main/packages/vike-react-zustand#readme">
                  <code>vike-react-zustand</code>
                </a>
                {' / '}
                <a href="https://github.com/vikejs/vike-vue/tree/main/packages/vike-vue-pinia#readme">
                  <code>vike-vue-pinia</code>
                </a>
              </CenterText>
            </p>
            <ZustandExample />
          </Block>
          <Block className="md:col-span-5">
            <SubSectionTitle>Error tracking</SubSectionTitle>
            <p>
              Hooks such as{' '}
              <Link href="/onError">
                <code>+onError</code>
              </Link>
              {', '}
              <Link href="/onHookCall">
                <code>+onHookCall</code>
              </Link>
              {' , and '}
              <Link href="/onCreateGlobalContext">
                <code>+onCreateGlobalContext</code>
              </Link>{' '}
              enable extensions (and users) deep integration with error tracking tools.
            </p>
            <p>
              For example,{' '}
              <a href="https://github.com/vikejs/vike-react/tree/main/packages/vike-react-sentry#readme">
                <code>vike-react-sentry</code>
              </a>{' '}
              is full-fledged Sentry integration:{' '}
            </p>
            <List
              items={[
                'Browser & server error tracking',
                'Performance monitoring and tracing',
                'Automatic source map upload',
              ]}
            />
          </Block>
        </div>

        <ClosingWords href="/extensions">
          See the growing ecosystem of extensions
          <ChevronsRight className="w-4 h-4 md:w-5 md:h-5" />
        </ClosingWords>
      </Section>
    </div>
  )
}

const Section = cm.section`space-y-6`

const TwoColumn = cm.div`grid gap-4 lg:gap-8 md:grid-cols-2`
const Block = cm.div`space-y-4`
const SectionTitle = H3Headline
const SubSectionTitle = H4Headline
const CenterText = cm.span`text-center block`
const Divider = cm.hr`border-grey-200`
const ClosingWords = cm.a`flex btn sm:btn-lg btn-neutral mx-auto w-fit btn-outline text-center`

function DX_InlineHighlight({
  color,
  href,
  children,
}: {
  color: string
  href: string
  children: ReactNode
}) {
  return (
    <Link href={href}>
      <span
        style={{
          backgroundColor: color,
          color: 'var(--color-text)',
          borderRadius: 4,
          paddingLeft: 4,
          paddingRight: 4,
        }}
      >
        {children}
      </span>
    </Link>
  )
}

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
export { ClosingWords }
