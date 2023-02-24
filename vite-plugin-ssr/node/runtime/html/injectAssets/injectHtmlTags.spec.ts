import { injectHtmlFragments, injectAtOpeningTag, injectAtClosingTag } from './injectHtmlTags'
import { expect, describe, it } from 'vitest'

const htmlHead1 = '<html><head></head></html>'
const htmlHead2 = `<html>
  <head></head>
</html>`
const htmlHead3 = `<html>
  <head>
  </head>
</html>`

const htmlHeadMetaCharsetWithoutWhitespace = '<html><head><meta charset="utf-8"></head></html>'
const htmlHeadMetaCharsetWithWhitespace = `<html>
  <head>
    <meta charset="utf-8">
  </head>
</html>`
const htmlHeadMetaCharsetWithTagBetween = `<html>
  <head>
    <link href="/foo.css">
    <meta charset="utf-8">
  </head>
</html>`
const htmlHeadMetaCharsetWithClosingTag = `<html>
  <head>
    <meta charset="utf-8"></meta>
  </head>
</html>`
const htmlHeadMetaCharsetWithClosingTagAndWhitespace = `<html>
  <head>
    <meta charset="utf-8"> </ meta>
  </head>
</html>`

const htmlBody1 = '<html><body></body></html>'
const htmlBody2 = `<html>
  <body></body>
</html>`
const htmlBody3 = `<html>
  <body>
  </body>
</html>`

const tag1 = '<link href="/foo.ttf">'
const tag2 = '<script src="/foo.js"></script>'

describe('injectHtmlTags', () => {
  it('injectHtmlFragments()', () => {
    expect(injectHtmlFragments('HTML_BEGIN', tag1, htmlHead1, null)).toMatchInlineSnapshot(
      '"<html><head><link href=\\"/foo.ttf\\"></head></html>"'
    )
    expect(injectHtmlFragments('HTML_BEGIN', tag1, htmlHeadMetaCharsetWithoutWhitespace, null)).toMatchInlineSnapshot(
      '"<html><head><meta charset=\\"utf-8\\"><link href=\\"/foo.ttf\\"></head></html>"'
    )
    expect(injectHtmlFragments('HTML_BEGIN', tag1, htmlHeadMetaCharsetWithWhitespace, null)).toMatchInlineSnapshot(
      `
      "<html>
        <head>
          <meta charset=\\"utf-8\\">
          <link href=\\"/foo.ttf\\">
        </head>
      </html>"
    `
    )
    expect(injectHtmlFragments('HTML_BEGIN', tag1, htmlHeadMetaCharsetWithTagBetween, null)).toMatchInlineSnapshot(
      `
      "<html>
        <head>
          <link href=\\"/foo.ttf\\">
          <link href=\\"/foo.css\\">
          <meta charset=\\"utf-8\\">
        </head>
      </html>"
    `
    )
    expect(injectHtmlFragments('HTML_BEGIN', tag1, htmlHeadMetaCharsetWithClosingTag, null)).toMatchInlineSnapshot(
      `
      "<html>
        <head>
          <meta charset=\\"utf-8\\"></meta>
          <link href=\\"/foo.ttf\\">
        </head>
      </html>"
    `
    )
    expect(injectHtmlFragments('HTML_BEGIN', tag1, htmlHeadMetaCharsetWithClosingTagAndWhitespace, null)).toMatchInlineSnapshot(
      `
      "<html>
        <head>
          <meta charset=\\"utf-8\\"> </ meta>
          <link href=\\"/foo.ttf\\">
        </head>
      </html>"
    `
    )   
  })
  
  it('injectAtOpeningTag()', () => {
    expect(injectAtOpeningTag('head','', htmlHead1, tag1)).toMatchInlineSnapshot(
      '"<html><head><link href=\\"/foo.ttf\\"></head></html>"'
    )
    expect(injectAtOpeningTag('head', '', htmlHead1, `${tag1}${tag1}`)).toMatchInlineSnapshot(
      '"<html><head><link href=\\"/foo.ttf\\"><link href=\\"/foo.ttf\\"></head></html>"'
    )
    expect(injectAtOpeningTag('head', '', htmlHead2, `${tag1}${tag1}`)).toMatchInlineSnapshot(
      `
      "<html>
        <head>
          <link href=\\"/foo.ttf\\">
          <link href=\\"/foo.ttf\\">
        </head>
      </html>"
    `
    )
    expect(injectAtOpeningTag('head', '', htmlHead3, `${tag2}${tag2}${tag1}`)).toMatchInlineSnapshot(
      `
      "<html>
        <head>
          <script src=\\"/foo.js\\"></script>
          <script src=\\"/foo.js\\"></script>
          <link href=\\"/foo.ttf\\">
        </head>
      </html>"
    `
    )
  })

  it('injectAtClosingTag()', () => {
    expect(injectAtClosingTag('body', htmlBody1, tag1)).toMatchInlineSnapshot(
      '"<html><body><link href=\\"/foo.ttf\\"></body></html>"'
    )
    expect(injectAtClosingTag('body', htmlBody1, `${tag1}${tag1}`)).toMatchInlineSnapshot(
      '"<html><body><link href=\\"/foo.ttf\\"><link href=\\"/foo.ttf\\"></body></html>"'
    )
    expect(injectAtClosingTag('body', htmlBody2, `${tag1}${tag1}`)).toMatchInlineSnapshot(
      `
      "<html>
        <body>
          <link href=\\"/foo.ttf\\">
          <link href=\\"/foo.ttf\\">
        </body>
      </html>"
    `
    )
    expect(injectAtClosingTag('body', htmlBody3, `${tag1}${tag2}${tag1}${tag2}`)).toMatchInlineSnapshot(
      `
      "<html>
        <body>
          <link href=\\"/foo.ttf\\">
          <script src=\\"/foo.js\\"></script>
          <link href=\\"/foo.ttf\\">
          <script src=\\"/foo.js\\"></script>
        </body>
      </html>"
    `
    )
  })
})
