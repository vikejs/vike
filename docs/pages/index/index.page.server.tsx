import React from 'react'
import { Header, MobileCallToAction } from './Header'
import { Features } from './features/Features'
import { HorizontalLine, Link, Sponsors } from '@brillout/docpress'

export { Page }

function Page() {
  return (
    <>
      <GlobalNote>
        こちらは、日本語版のVikeのドキュメントです。 <br />
        誤訳・表記ゆれ・未修正箇所などありましたら
        <a href="https://github.com/vike-ja-support/vike-docs-ja/issues">こちらのIssue</a>
        にお願いします。
      </GlobalNote>
      <GlobalNote>
        <i>V1デザイン</i>がリリースされました。
        <Link text="マイグレーションガイド" href="/migration/v1-design" />
        をご覧ください。
      </GlobalNote>
      <GlobalNote>
        Vite-plugin-ssrはVikeへと名称が変更されました。
        <a href="https://vite-plugin-ssr.com/vike">マイグレーションガイド</a>をご覧ください。
      </GlobalNote>
      <Header />
      <HorizontalLine primary={true} />
      <Features />
      <MobileCallToAction />
      <HorizontalLine />
      <Sponsors />
      <div style={{ height: 50 }} />
    </>
  )
}

function GlobalNote({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
        <blockquote style={{ marginTop: 0 }}>
          <p style={{ margin: 0 }}>{children}</p>
        </blockquote>
      </div>
    </>
  )
}
