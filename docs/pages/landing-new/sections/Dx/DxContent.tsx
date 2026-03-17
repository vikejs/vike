import React from 'react'
import type { ComponentProps, CSSProperties, ReactNode } from 'react'
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
import cm, { cmMerge } from '@classmatejs/react'

const DxContent = () => {
  return (
    <div className="space-y-16">
      <TwoColumn cut={0.46}>
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
          ...via <a href="https://telefunc.com">Telefunc</a> (tool maintained by the Vike team), or use classic tools
          such as tRPC.
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
        </Block>
      </TwoColumn>

      <TwoColumn>
        <ReactQueryExample />
        <ApolloExample />
      </TwoColumn>

      <Section>
        <SectionTitle>Powerful hooks</SectionTitle>
        <TwoColumn cut={0.54}>
          <Block>
            <SubSectionTitle>
              Data fetching: <i>where</i>
            </SubSectionTitle>
            <p>Hooks give you control where data is fetched:</p>
            <DataServerExample />
            <DataClientExample />
          </Block>
          <Block>
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

        <ClosingWords>
          Growing suite of <Link href="/hooks">hooks</Link>.
        </ClosingWords>
      </Section>

      <Section>
        <SectionTitle>Powerful extensions</SectionTitle>
        <div>
          <Link href="/extensions">Extensions</Link> use the same powerful hooks users use — enabling deep and seamless
          integrations.
        </div>

        <TwoColumn cut={0.54}>
          <Block>
            <SubSectionTitle>UI frameworks</SubSectionTitle>
            <p>
              Use your favorite UI framework via an extension for a quick start, or via{' '}
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
            <p>
              Extensions use Vike's powerful hooks to integrate any advanced technologies such React Server Components.
            </p>
            <CenterText>
              <a href="https://github.com/nitedani/vike-react-rsc#vike-react-rsc">
                <code>vike-react-rsc</code>
              </a>
            </CenterText>
          </Block>
        </TwoColumn>

        <TwoColumn cut={0.54}>
          <Block>
            <SubSectionTitle>State management</SubSectionTitle>
            <p>
              Powerful hooks also enable extensions to deeply & seamlessly integrate with state management tools.
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
          <Block>
            <SubSectionTitle>Error tracking</SubSectionTitle>
            <p>
              Hooks such as{' '}
              <Link href="/onError">
                <code>+onError</code>
              </Link>
              ,{' '}
              <Link href="/onHookCall">
                <code>+onHookCall</code>
              </Link>
              , and{' '}
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
        </TwoColumn>

        <ClosingWords>
          Growing ecosystem of <Link href="/extensions">extensions</Link>.
        </ClosingWords>
      </Section>
    </div>
  )
}

const Section = cm.section`space-y-8`
type TwoColumnProps = ComponentProps<'div'> & {
  cut?: number
}

type TwoColumnStyle = CSSProperties & {
  '--dx-two-column-cut'?: string
}

const TwoColumn = ({ children, className, cut = 0.5, style, ...props }: TwoColumnProps) => {
  if (!(cut > 0 && cut < 1)) {
    throw new Error(`TwoColumn cut must be between 0 and 1 (received ${cut}).`)
  }

  const styleWithCut: TwoColumnStyle = {
    ...style,
    '--dx-two-column-cut': `${cut * 100}%`,
  }

  return (
    <div
      className={cmMerge('grid gap-8 md:[grid-template-columns:var(--dx-two-column-cut)_1fr]', className)}
      style={styleWithCut}
      {...props}
    >
      {children}
    </div>
  )
}
const Block = cm.div`space-y-4`
const SectionTitle = cm.h3`text-2xl font-semibold`
const SubSectionTitle = cm.h4`text-lg font-medium`
const CenterText = cm.p`text-center`
const Divider = cm.hr`border-grey-200`
const ClosingWords = cm.p`text-2xl text-center`

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
