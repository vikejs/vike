import React from 'react'
import { Emoji } from '@brillout/docpress'
import { FeatureList } from '@brillout/docpress/features/FeatureList'
import Control from './Control.mdx'
import FullFleged from './FullFledged.mdx'
import DeployAnywhere from './DeployAnywhere.mdx'
import { TweetsAboutScability } from './TweetsAboutScability'
import { ViteLogo } from './ViteLogo'
import { VikeLogo } from './VikeLogo'
import { RollupLogo } from './RollupLogo'

export { Features }

function Features() {
  return (
    <FeatureList
      features={[
        {
          title: (
            <>
              <Emoji name="wrench" /> コントロール
            </>
          ),
          desc: (
            <>
              <p>
                <b>お好みのUI framework</b> （React、 Vue、 Svelte、 Solid、 ...） と <b>お好みのツール</b>
                （フロントエンドライブラリ、 web技術、 デプロイ環境、 Vite プラグイン、 ...）を使うことができます。
              </p>
              <p>
                Vikeを使えば、手動でツールを統合し、<b>アーキテクチャをコントロール</b>し続けることができます。
              </p>
            </>
          ),
          learnMore: <Control />
        },
        {
          title: (
            <>
              <Emoji name="package" /> ゼロコンフィグ
            </>
          ),
          desc: (
            <>
              <p>
                Vikeは<b>重要なところだけをコントロール</b>できます。
              </p>
              <p>
                それ以外のすべては、何も設定することなく<b>機能します</b>。
              </p>
            </>
          )
        },
        {
          title: (
            <>
              <Emoji name="dizzy" /> シンプル
            </>
          ),
          desc: (
            <>
              <p>
                Vikeでは、手動でツールを統合します。そのため作業は増えますが、
                <b>根本的にはシンプルで安定した基盤を構築</b>することができます。
              </p>
              <p>
                VikeとあなたのUI framework （React/Vue/...）が混合されないことで、 アプリに関する推論が簡単になります。
              </p>
            </>
          ),
          learnMore: (
            <>
              <h3>簡単ではないが、よりシンプル</h3>
              <p>Vikeでは、自分でツールを統合します。これは通常、より多くの作業を意味し、簡単ではありません。</p>
              <p>
                しかし、Next.js/Nuxtのようなフレームワークのブラックボックス的な性質は制限的で、もろい回避策を必要とします。その結果、フレームワークと戦って時間を浪費することになります。
              </p>
              <p>
                対照的に、Vikeは透明です。邪魔にならず、ツールの統合は単にツールの公式インストールガイドに従うだけで大丈夫です。
              </p>
              <p>一言で言えば、Vikeは簡単ではないが、よりシンプルです。</p>
              <h3>安定した基盤</h3>
              <p>
                フレームワークは常にエコシステムに対応する必要がありますが、「1つのことをうまくやる」ツールはすぐに安定します。
              </p>
              <p>
                実際、Vikeはすでに安定しています。変更を加えるのはVikeのデザインを改善するためだけで、統合は将来も機能し続けることが期待できます。
              </p>
              <h3>クリーンカット</h3>
              <p>
                VikeとあなたのUIフレームワーク（React/Vue/...）は混同されません。これにより、アプリの推論がより簡単になります。
              </p>
              <h3>楽しい</h3>
              <p>
                最後になりましたが、手作業での統合は楽しく、洞察に富んでいます！（フレームワークと戦うのは不要で厄介ですが）
              </p>
            </>
          )
        },
        {
          title: (
            <>
              <Emoji name="mechanical-arm" /> 本格的
            </>
          ),
          desc: (
            <>
              <p>
                <b>ファイルシステムルーティング</b>、<b>データフェッチ</b>、<b>プリレンダリング</b>、<b>レイアウト</b>、
                <b>HMR</b>、<b>i18n</b>、<b>リンクプリフェッチ</b>、<b>HTMLストリーミング</b>。
              </p>
              <p>
                <b>クライアントルーティング</b> （高速なページナビゲーション） または<b>サーバールーティング</b>{' '}
                （シンプルなアーキテクチャ）。
              </p>
              <p>
                各ページは<b>SSR</b>、<b>SPA</b>、<b>MPA</b>、<b>SSG</b>、<b>HTML-only</b>
                の異なるモードでレンダリングできます。
              </p>
            </>
          ),
          learnMore: <FullFleged />
        },
        {
          title: (
            <>
              <Emoji name="earth" /> どこにでもデプロイ
            </>
          ),
          desc: (
            <>
              <p>
                Vercel Serverless/Edge/ISR、Cloudflare Workers、AWS EC2/Lambda、Netlify Functions/Edge、Firebase、Google
                Cloudなど、<b>どこにでもデプロイできます</b>。
              </p>
              <p>
                アプリをプリレンダリングし、任意の静的ホスト（Netlify、GitHub Pages、Cloudflare
                Pagesなど）にデプロイできます。
              </p>
              <p>
                <b>Cloudflare Workers</b>の小規模要件にぴったりです。
              </p>
            </>
          ),
          learnMore: <DeployAnywhere />
        },
        {
          title: (
            <>
              <Emoji name="gem-stone" /> 非常に安定
            </>
          ),
          desc: (
            <>
              <p>
                Vikeのソースコードには<b>既知のバグがなく</b>
                、すべてのリリースは重厚な<b>自動テスト</b>群に照らし合わされており、<b>多くの企業で実運用</b>
                されています。
              </p>
            </>
          )
        },
        {
          title: (
            <>
              <Emoji name="rocket" /> スケーラブル
            </>
          ),
          desc: (
            <>
              <p>
                HMRで数百kLOCにスケールする<b>DX</b>と、高速を維持する開発スタートアップ。Powered by Vite <ViteLogo />
              </p>
              <p>
                小さな趣味のプロジェクトから大規模な企業プロジェクトまで、<b>柔軟に対応できるアーキテクチャ。</b>
              </p>
            </>
          ),
          learnMore: (
            <>
              <h3>Lazy-transpiling</h3>
              <p>
                基本的な新しさのひとつは、lazy-transpilingの開発です。
                開発を始める前にコードベース全体をトランスパイルする代わりに、Viteはロードされたコードだけをトランスパイルします。
              </p>
              <p>
                例えば、100ページを定義し、ブラウザでページを開くと、その1ページのコードだけがトランスパイルされ、他の99ページのコードはそのまま残されます。
              </p>
              <p>
                lazy-transpilingのおかげで、高速なHMRと開発体験を維持しながら、（非常に）大規模なコードベースに拡張することができます。
              </p>
              <h3>ブラックボックスなし</h3>
              <p>規模が大きくなると、Next.js/Nuxtのブラックボックス的な性質は、痛いほど制限的になります。</p>
              <p>対照的に、Vikeは透過的であり、サーバー側とブラウザ側の両方をコントロールし続けることができます。</p>
              <p>
                規模が大きくなるにつれて、カスタムSSRの統合が必要になってきますが、Vikeの柔軟性はそのようなニーズにも対応します。
              </p>
              <h3>
                Vite + SSR + Scale = <Emoji name="red-heart" />
              </h3>
              <p>
                （非常に）大規模な場合、VikeをViteのネイティブSSR
                APIに徐々に置き換えていくことができます。もしあなたがNetflixで、UXを完璧にすることが大幅な収益増加につながるのであれば、VikeとViteのネイティブSSR
                APIはあなたが探しているものです。
              </p>
              <TweetsAboutScability />
            </>
          ),
          isSecondaryFeature: true
        },
        {
          title: (
            <>
              <Emoji name="high-voltage" /> 高速
            </>
          ),
          desc: (
            <>
              <p>
                <b>コード分割</b>、<b>クライアントルーティング</b>、<b>リンクプリフェッチ</b>、
                <b>高速コールドスタート</b>による最先端のパフォーマンス。
              </p>
              <p>Lighthouseスコア: 100%</p>
            </>
          ),
          isSecondaryFeature: true,
          learnMore: (
            <>
              <h3>コード分割</h3>
              <p>
                各ページのブラウザ側では必要なコードのみをロードし、ページ間で共通のチャンクを共有することで最適なキャッシュを実現します。
                Powered by Rollup <RollupLogo />
              </p>
              <h3>クライアントルーティング</h3>
              <p>
                ページナビゲーション時に、サーバーサイドとブラウザサイドの両方で次のページをロードしてレンダリングするのではなく、ブラウザサイドのみで次のページをロードしてレンダリングします。
              </p>
              <h3>リンクプリフェッチ</h3>
              <p>瞬時にページナビゲーションを行うために、リンクをプリロードすることができます。</p>
              <h3>高速コールドスタート</h3>
              <p>
                サーバーサイドでは、ページも遅延ロードされる。ページを追加しても、（サーバーレスの）デプロイのコールドスタートが増えることはありません。
              </p>
            </>
          )
        },
        {
          title: (
            <>
              <Emoji name="sparkling-heart" /> 楽しい
            </>
          ),
          desc: (
            <>
              <p>
                Vikeはシンプルで明快、そしてロバスト。マジックも、予期せぬ動作も、コンフリクトも、（Vikeのソースコードで知られている）バグもない。
              </p>
              <p>
                Vikeを使えば、<b>コントロールが効くので病みつきになる面白い。</b>
              </p>
            </>
          ),
          isSecondaryFeature: true
        },
        {
          title: (
            <>
              <VikeLogo /> 独自のフレームワークを構築
            </>
          ),
          desc: (
            <>
              <p>
                Vikeを使って<a href="https://vike.land/">独自のフレームワークを構築しよう。</a>数百行のコードでNext.js /
                Nuxtを構築できます。
              </p>
              <p>
                <b>社内でフレームワークを構築</b>
                してチームを拡張したり、特注のフレームワークで<b>製品を強化</b>
                してユーザーを喜ばせたり、<b>アーキテクチャを管理</b>したりすることができます。
              </p>
            </>
          ),
          isSecondaryFeature: true
        },
        {
          title: (
            <>
              <Emoji name="red-heart" /> クラフトマンシップ
            </>
          ),
          desc: (
            <>
              <p>
                <b>ディテールにこだわり</b>、<b>シンプルであること</b>を大切にしています。
              </p>
              <p>上流ではViteなどにコントリビュートしています。</p>
              <p>
                GitHubやDiscordでの<b>会話を歓迎しています</b>
              </p>
            </>
          ),
          isSecondaryFeature: true
        },
        {
          title: (
            <>
              <Emoji name="lab" /> 最先端
            </>
          ),
          desc: (
            <>
              <p>
                私たちは定期的にRFCに参加しており、最新技術を<b>いち早くサポート</b>しています。
              </p>
            </>
          ),
          isSecondaryFeature: true
        }
      ]}
    />
  )
}
