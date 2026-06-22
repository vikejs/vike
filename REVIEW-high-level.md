# Vike — High-Level Design Review

> Scope: business goals & model, high-level flows (business logic), overall architecture,
> tech-stack fit, and simplification opportunities. This is a *design* review, not a code
> audit — low-level nits are deliberately omitted.
>
> Method: read the public docs (`why`, `why-the-v1-design`, `pricing`, `config`), the
> package manifests and `TODO`, and analyzed the core subsystems (config resolution,
> rendering/hooks pipeline, Vite plugins/build) with file-level investigation. Facts cited
> below (version history, marker counts, dependency lists, code paths) were verified directly
> in the repo.
>
> Each point has a stable **reference number** (e.g. `FL-1`) for easy follow-up. Only
> *critical* points are listed — points I merely agree with are omitted. Priority labels
> (`High`/`Medium`/`Low`) are a triage aid, not a verdict.

---

## What's genuinely strong (context, not review points)

So the critical points below land as fair rather than one-sided, three things are
genuinely well-designed and I am **not** flagging them:

- **The decoupled core + extensions architecture is the real achievement.** The
  `onRenderHtml`/`onRenderClient` low-level seam that lets you swap UI framework, data
  layer, and deploy target independently is a structurally better separation of concerns
  than Next.js/Nuxt. This is Vike's defensible moat.
- **The tech stack baseline is a good fit.** Building *as* a Vite plugin (rather than
  wrapping Vite) aligns Vike with the ecosystem; TypeScript + pnpm + Biome + Vitest +
  Playwright are modern, low-friction, and appropriate. The stack critiques below are about
  *redundancy at the edges*, not the baseline.
- **The funding philosophy is principled and user-aligned** (MIT stays MIT, no investors,
  privacy-preserving). The critiques in `BG-3/BG-4` are about execution and risk, not intent.

---

## 1. Business goals & model (`BG`)

### BG-1 — The "stability / mission-critical" promise is undercut by perma-0.x and an unfinished migration · `High`
The headline is *"Build mission-critical applications with stability."* Yet the signals say
the opposite to a risk-averse buyer:
- Still **0.4.x after ~5 years** (`0.1.0` in 2021-06 → `0.4.259` in 2026-05), no 1.0.
- An old→new ("V1") design migration that is **still incomplete**: **145** `next-major-release`
  markers in `src/`, an entire `test-deprecated-design/` kept alive (290 files, 1.6 MB), and a
  large soft-deprecation surface (**125** `assertWarning` calls).

Engineering-wise Vike is genuinely conservative about back-compat (that's *why* the old design
still runs) — but "perpetual 0.x with a 'remove old design' major looming" reads as *instability*
to exactly the enterprise persona the pricing model targets. **Recommend:** ship a real 1.0 and
let SemVer carry the stability message (ties to `FL-1`).

### BG-2 — Concentration / bus-factor risk is the biggest unaddressed business risk · `High`
Vike, ~10 of its dependencies, *and* the funding model are effectively one author's projects:
`@brillout/{import,json-serializer,picocolors,vite-plugin-server-entry,release-me,test-e2e,
test-types,replace,spellcheck,docpress}`, `@universal-middleware/*`, `@universal-deploy/*`, plus
the `vike-react/vue/solid` extensions. For a tool sold on *"maintained for a very long time"* and
*"mission-critical,"* single-maintainer concentration is the first thing a procurement/security
review flags. **Recommend:** address continuity explicitly (co-maintainers, foundation/escrow,
or at minimum a documented governance/continuity statement). This is also directly monetizable —
continuity *is* what enterprises pay for.

### BG-3 — Open Source Pricing is unproven and not yet built; the sustainability story rests on it · `Medium`
The model is novel and user-aligned, but the docs themselves say it *"isn't implemented yet"*, and
the `TODO` gates a whole batch of work behind `after-open-source-pricing`. The revenue that funds
the long-term-maintenance promise is therefore still hypothetical. Until it's shipped and shown to
convert, "we'll maintain this for years" is a promise without a proven engine — which compounds
`BG-1`/`BG-2`.

### BG-4 — Heuristic license enforcement carries UX, trust, and security-review friction · `Medium`
Enforcement is an offline heuristic that *"analyzes your Vike configuration (number of `+Page.js`
files) and Git history (commit count)"* plus a deliberately *"pesky toaster"* in dev for
larger teams. Concerns:
- **Trust:** locally reading git history — even with zero telemetry — is precisely what enterprise
  security review distrusts; "trust us, it's offline" is a hard sell to the buyer you most want.
- **False positives:** a small team on a long-lived monorepo trips the heuristic and gets nagged —
  annoying the people you promised free access.
- **Gameable:** trivially circumvented, so it taxes honest payers.
- **Wrong lever:** intentionally degrading DX risks pushing enterprises to *fork* (which the
  license explicitly permits) rather than pay.

**Recommend:** lean on relationship/contract + value-add (priority support, the continuity story
in `BG-2`) as the primary lever; keep the heuristic/toaster as a gentle nudge, not the mechanism.

### BG-5 — "Replaces Next.js/Nuxt" may be the wrong headline for Vike's actual strength · `Medium`
Vike's defensible advantage is being an *unopinionated, decoupled foundation* (swap any component;
build-your-own-framework). But "replace Next.js" is judged by the median product developer on
*batteries-included DX* — which Vike delivers only through the **separately-maintained**
`vike-react/vue/solid` extensions, not the core. So the headline invites comparison on the axis
where a small team is structurally disadvantaged (vs. Vercel/Nuxt polish) while underselling the
axis where Vike wins (architecture/flexibility for framework authors & architects). **Consider**
leading with the "flexible foundation / build your own framework" identity.

---

## 2. High-level flows / business logic (`FL`)

### FL-1 — Dual-design coexistence is the dominant source of accidental complexity · `High`
Supporting the old `.page.js` design and the new `+config.js` design *simultaneously* means
nearly every subsystem carries two code paths:
- config resolution: `getPageFiles/` vs `resolveVikeConfigInternal/`
- hook discovery: `getHookFromPageContext` vs `getHooksFromPageContextNew`
- virtual-file codegen: `generateVirtualFileGlobalEntryWithOldDesign` vs the page-entry generator
- build entry generation (`pluginBuildConfig` branches on design), plus the whole
  `test-deprecated-design/`.

This is the **single biggest simplification lever** in the codebase (see the 145
`next-major-release` markers) and it has been pending for years. **Recommend:** make old-design
removal the defining content of 1.0 (`BG-1`). Every other simplification gets easier afterward.

### FL-2 — `pageContext` is an unbounded "god object" with a *runtime-enforced* server→client boundary · `High`
Properties are accumulated implicitly across routing → guard → data → onBeforeRender → render.
What crosses to the client is governed by `passToClient` and validated by **serializing at
runtime** (non-serializable values are detected, warned, and replaced with `NOT_SERIALIZABLE`). So
a whole class of mistakes — forgot `passToClient`, value isn't serializable, typo'd key — surfaces
*at runtime, far from its cause*, rather than at build/type time. A typed `PassToClientPublic`
variant now exists (good direction), but the contract is still runtime-enforced. **Recommend:**
move toward a build-time-checkable contract and consider segmenting `pageContext` so its shape is
inspectable rather than emergent.

### FL-3 — Control flow is exception-based (`throw redirect()/render()`) with recursive re-entry and an ad-hoc loop cap · `Medium`
`redirect()`, `render(statusCode)`, and `render(urlRewrite)` are thrown, caught, then
*re-enter routing+render recursively*; infinite-abort loops are bounded by a hard-coded max
(~10) plus a uniqueness check. It's ergonomic for users, but "exceptions as primary control flow
+ recursion + magic-number guard" is a non-obvious model that's easy to get subtly wrong (e.g.
`A→B→A` rewrite cycles) and hard to reason about. **Recommend:** document the state machine
explicitly and revisit whether the loop guard can be made principled rather than a fixed limit.

---

## 3. Architecture — robustness & simplicity (`AR`)

### AR-1 — Config resolution is the deepest complexity; trim the *accidental* part · `High`
Essential complexity (inheritance, cumulative, `.clear`/`.default`, `_computed`) is the price of
the flexibility promise — fair. Two hotspots look *accidental*:
- **Pointer-import wire format is a magic string** (`'import:/path:export'`) with a *zero-width-space*
  marker to distinguish user vs generated imports. Fragile, undocumented, parser-coupled.
- **Config env is decided in ~4 places** (`metaBuiltIn` default → file suffix `_client/_server/_ssr`
  → `+meta` override → conditional function), so there is no single answer to *"where does this
  value run?"*

**Recommend:** replace the string pointer format with a typed structure, and consolidate env
resolution into a single pass. Both reduce a class of silent bugs.

### AR-2 — Two `getPageContext()` mechanisms; the universal one uses a fragile microtask global · `Medium`
The public `getPageContext()` (server *and* client) reads a module-global that is set immediately
before a hook runs and cleared on the **next microtask** (`Promise.resolve().then(() => … = null)`),
i.e. valid only synchronously before the first `await`. Meanwhile Vike *already* uses
`AsyncLocalStorage` on the server (`asyncHook.ts`, dev logging). Using a microtask-reset global for
request-scoped state **on the server, where ALS is available**, is both a robustness smell
(interleaving/concurrency) and an internal inconsistency. **Recommend:** back the server path with
ALS; keep the global only for the client where ALS isn't available.

### AR-3 — Cumulative hooks run in parallel by default (`Promise.all`) with no ordering guarantee · `Medium`
`execHookList`/`execHookGlobal` fire all hooks of the same name concurrently. For cumulative hooks
that mutate `pageContext` (e.g. multiple `data`/`onBeforeRender` from different extensions or
inheritance levels) this creates order-dependence/race ambiguity, and there is no defined order
between inherited cumulative hooks. The `TODO` wants *more* hooks cumulative by default — which
makes ordering semantics **more** important, not less. **Recommend:** define and document a
deterministic order; consider sequential-by-default for `pageContext`-mutating cumulative hooks.

### AR-4 — `onHookCall` wrapping is intricate for what it delivers · `Medium`
The observability wrapper builds a *recursive chain of mutable `call` closures* with
`originalCalled/originalReturn/originalError` flags and a runtime usage-assertion that the user
"must run `hook.call()` before `await`." It's powerful (e.g. Sentry spans) but it's a lot of
subtle, mutation-heavy control flow on the hottest path, with the key constraint enforced at
runtime rather than by design. **Recommend:** isolate and heavily test it, and explore a simpler
shape (e.g. explicit before/after callbacks) that doesn't rely on closure mutation + ordering
assertions.

### AR-5 — Two client runtimes duplicate routing/hook/abort logic · `Medium`
`runtime-client-routing` (~30 files) re-implements routing, hook execution, and abort handling
that also exist server-side/shared. Some divergence is inherent (the client can't do everything the
server does), but the shared core could be larger; today it's double the surface to keep in sync
and to test. **Recommend:** maximize the shared layer and treat both runtimes as thin shells over it.

### AR-6 — Symptoms of accumulated surface: util sprawl + very high assertion density · `Low`
`src/utils/` has **127** files (many tiny single-function modules); `assert()` ×**1004**,
`assertUsage()` ×**303**, `assertWarning()` ×**125**. None of this is wrong — it reflects a mature,
defensively-coded framework. I flag it only as a *metric of API-surface churn*: surface reduction
(`FL-1`, `AR-7`, `BG-1`) pays compounding dividends here.

### AR-7 — Public import-path sprawl (~17 entrypoints) · `Low`
The package exposes ~17 subpaths (`vike/server`, `vike/client`, `vike/client/router`,
`vike/routing`, `vike/abort`, `vike/getPageContext`, `vike/modifyUrl`, …). The author's own `TODO`
already calls this out ("Simplify import paths"). It's real DX/cognitive overhead and a teaching
burden. **Recommend:** collapse toward a small, memorable set (the `TODO`'s `import { navigate }
from 'vike/navigate'` direction or a single `vike` barrel), behind the 1.0 migration.

---

## 4. Tech stack (`TS`)

### TS-1 — Multiple bundlers/parsers; consolidation is pending · `Medium`
The toolchain carries Babel (`@babel/core` + `@babel/types`, as **runtime** deps) + esbuild +
es-module-lexer + rolldown (dev) + rollup (via Vite), and performs **two separate Rollup builds**
(client + SSR) which is what blocks moving to a single Rolldown build. Each parser has a present-day
justification (Babel for AST rewrites + import-attribute parsing; esbuild to transpile/execute
`+config`; lexer for fast export scans), but it's at the edge of redundancy and Babel-at-runtime is
heavy for a build tool. **Recommend:** treat the **single Rolldown build** as a first-class goal —
it collapses the dual build *and* removes parser duplication *and* shrinks dev/prod divergence in
one move.

### TS-2 — Prerender is triggered from a Rollup `writeBundle` hook and swallows errors · `Low`
Coupling prerendering to an output-lifecycle hook (and catching/eating errors there) is a fragile
lifecycle dependency that can hide failures. **Recommend:** an explicit, observable prerender phase
in the build orchestration rather than a side effect of `writeBundle`.

---

## Top simplification opportunities (consolidated)

In rough order of leverage — each links to the point that argues it:

1. **Ship 1.0 = remove the old design** (`FL-1`, `BG-1`). Collapses two-of-everything across
   config/hooks/build, deletes `test-deprecated-design/`, and clears 145 `next-major-release`
   markers. Unblocks almost everything else.
2. **Single Rolldown build** (`TS-1`). Removes the dual Rollup build, parser duplication, and a
   chunk of dev/prod divergence.
3. **Typed pointer format + single-pass env resolution** (`AR-1`). Removes magic strings and the
   "4 places decide env" problem.
4. **Unify `getPageContext()` on ALS server-side** (`AR-2`). Removes the microtask-global fragility.
5. **Collapse public import paths** (`AR-7`). Smaller, teachable API surface.
6. **Deterministic (or sequential) cumulative-hook ordering** (`AR-3`). De-risks the planned
   "cumulative by default" direction.

---

## One-line summary

The architecture's *flexibility* is excellent and is the right bet; the main risks are **business
continuity** (single-maintainer, unbuilt funding model vs. a "mission-critical/stability" promise)
and **a years-long unfinished old→new migration** that keeps two of everything alive. Shipping a
1.0 that removes the old design is the lever that most improves both the product story and the
codebase.
