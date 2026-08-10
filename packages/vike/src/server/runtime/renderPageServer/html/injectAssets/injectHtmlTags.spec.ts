import { injectAtOpeningTag, injectAtClosingTag } from './injectHtmlTags.js'
import { expect, describe, it } from 'vitest'

const htmlHead1 = '<html><head></head></html>'
const htmlHead2 = `<html>
  <head></head>
</html>`
const htmlHead3 = `<html>
  <head>
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
// https://github.com/vikejs/vike/issues/3457
const tag3 = `<script type="module">i.contentWindow?.document.write('<h1>Hello</h1>')</script>`
const tag4 = '<style>a::before { content: "<" }</style>'
const tag5 = '<meta name="foo" content="a < b">'

describe('injectHtmlTags', () => {
  it('injectAtOpeningTag()', () => {
    expect(injectAtOpeningTag('head', htmlHead1, tag1)).toMatchInlineSnapshot(
      `"<html><head><link href="/foo.ttf"></head></html>"`,
    )
    expect(injectAtOpeningTag('head', htmlHead1, `${tag1}${tag1}`)).toMatchInlineSnapshot(
      `"<html><head><link href="/foo.ttf"><link href="/foo.ttf"></head></html>"`,
    )
    expect(injectAtOpeningTag('head', htmlHead2, `${tag1}${tag1}`)).toMatchInlineSnapshot(
      `
      "<html>
        <head>
          <link href="/foo.ttf">
          <link href="/foo.ttf">
        </head>
      </html>"
    `,
    )
    expect(injectAtOpeningTag('head', htmlHead3, `${tag2}${tag2}${tag1}`)).toMatchInlineSnapshot(
      `
      "<html>
        <head>
          <script src="/foo.js"></script>
          <script src="/foo.js"></script>
          <link href="/foo.ttf">
        </head>
      </html>"
    `,
    )
  })

  it('injectAtClosingTag()', () => {
    expect(injectAtClosingTag('body', htmlBody1, tag1)).toMatchInlineSnapshot(
      `"<html><body><link href="/foo.ttf"></body></html>"`,
    )
    expect(injectAtClosingTag('body', htmlBody1, `${tag1}${tag1}`)).toMatchInlineSnapshot(
      `"<html><body><link href="/foo.ttf"><link href="/foo.ttf"></body></html>"`,
    )
    expect(injectAtClosingTag('body', htmlBody2, `${tag1}${tag1}`)).toMatchInlineSnapshot(
      `
      "<html>
        <body>
          <link href="/foo.ttf">
          <link href="/foo.ttf">
        </body>
      </html>"
    `,
    )
    expect(injectAtClosingTag('body', htmlBody3, `${tag1}${tag2}${tag1}${tag2}`)).toMatchInlineSnapshot(
      `
      "<html>
        <body>
          <link href="/foo.ttf">
          <script src="/foo.js"></script>
          <link href="/foo.ttf">
          <script src="/foo.js"></script>
        </body>
      </html>"
    `,
    )
  })

  // https://github.com/vikejs/vike/issues/3457
  it("doesn't inject line breaks inside inline <script>/<style> nor inside attributes", () => {
    expect(injectAtClosingTag('body', htmlBody3, `${tag3}${tag4}${tag5}${tag1}`)).toMatchInlineSnapshot(
      `
      "<html>
        <body>
          <script type="module">i.contentWindow?.document.write('<h1>Hello</h1>')</script>
          <style>a::before { content: "<" }</style>
          <meta name="foo" content="a < b">
          <link href="/foo.ttf">
        </body>
      </html>"
    `,
    )
  })
})
