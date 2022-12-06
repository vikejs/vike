export { Page }

import React from 'react'
import { Emoji, FeatureList, HorizontalLine } from '@brillout/docpress'
import CodeBlock from './CodeBlock.mdx'

function Page() {
  return (
    <>
      <div style={{ height: 10 }} />
      <Header />
      <HorizontalLine primary={true} />
      <Features />
      <div style={{ height: 100 }} />
    </>
  )
}

function Header() {
  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Introduction</h1>
    </>
  )
}

function Features() {
  return (
    <FeatureList
      features={[
        {
          title: (
            <>
              <Emoji name="wrench" /> Feature 1
            </>
          ),
          desc: (
            <>
              <p>
                Praesent eu augue lacinia, tincidunt purus nec, ultrices ante. Donec dolor felis, ornare vel augue
                condimentum.
              </p>
              <p>
                Mauris <code>foo</code> quis scelerisque erat.
              </p>
            </>
          ),
          learnMore: (
            <>
              <h3>Sub Heading 1</h3>
              <p>Curabitur luctus finibus tellus eget tristique. Vivamus aliquam mollis ligula at dapibus.</p>
              <CodeBlock />
              <h3>Sub Heading 2</h3>
              <p>
                Proin vulputate elit eget porta mollis. Class aptent taciti sociosqu ad litora torquent per conubia
                nostra, per inceptos himenaeos.
              </p>
              <p>
                Etiam in nibh et lorem varius suscipit vitae vitae ligula. In blandit mattis erat. Proin congue cursus
                dui ac porta. Duis tincidunt pretium ullamcorper.
              </p>
            </>
          )
        },
        {
          title: (
            <>
              <Emoji name="package" /> Feature 2
            </>
          ),
          desc: (
            <>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p>
                <b>Curabitur</b> gravida urna id ligula volutpat dapibus. Integer accumsan dignissim efficitur. Sed
                mauris tortor, lobortis at suscipit ac, ultricies eu nunc.
              </p>
            </>
          ),
          learnMore: (
            <>
              <p>More content for Feature 2.</p>
              <p>Curabitur luctus finibus tellus eget tristique. Vivamus aliquam mollis ligula at dapibus.</p>
              <p>
                Proin vulputate elit eget porta mollis. Class aptent taciti sociosqu ad litora torquent per conubia
                nostra, per inceptos himenaeos.
              </p>
              <p>
                Etiam in nibh et lorem varius suscipit vitae vitae ligula. In blandit mattis erat. Proin congue cursus
                dui ac porta. Duis tincidunt pretium ullamcorper.
              </p>
            </>
          )
        },
        {
          title: (
            <>
              <Emoji name="dizzy" /> Feature 3
            </>
          ),
          desc: (
            <>
              <p>
                Sed molestie tempus &mdash; <b>elementum</b>.
              </p>
            </>
          ),
          isSecondaryFeature: true,
          learnMore: (
            <>
              <p>
                Fusce at sollicitudin magna. Morbi in eleifend elit, eget finibus tortor. Pellentesque finibus suscipit
                condimentum. Vestibulum id varius arcu.
              </p>
              <p>
                In blandit mattis erat. Proin congue cursus dui ac porta. Duis tincidunt pretium ullamcorper. Etiam in
                nibh et lorem varius suscipit vitae vitae ligula.
              </p>
            </>
          )
        },
        {
          title: (
            <>
              <Emoji name="mechanical-arm" /> Feature 4
            </>
          ),
          isSecondaryFeature: true,
          desc: (
            <>
              <p>
                Nulla eget egestas magna, non luctus magna. Praesent a tellus molestie nisi feugiat commodo quis vel
                tellus. Praesent scelerisque turpis et diam cursus, non sodales erat tincidunt.
              </p>
              <p>Etiam accumsan neque eu vulputate aliquet. Nulla sit amet sollicitudin velit.</p>
              <p>Pellentesque bibendum semper tortor id venenatis.</p>
            </>
          )
        }
      ]}
    />
  )
}
