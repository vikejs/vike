# High-level design review — “Sync GitHub Releases” (PR #3367)

Scope reviewed: the `sync-github-releases` workflow and its TypeScript implementation
(`.github/workflows/sync-github-releases/**`, `sync-github-releases.yml`), plus the
supporting changes (CHANGELOG.md move to `packages/vike/`, doc-link updates, workspace /
vitest / CI config). This is a **high-level / design** review — business goals, flows,
architecture, simplicity — not a line-by-line code review.

## Context (what the PR does)

- **Goal** (issue #3154): every released version should also exist as a **GitHub Release**, so
  users can *watch → get notified*, and read **per-version notes** instead of the 360 KB
  `CHANGELOG.md`.
- **Approach**: `CHANGELOG.md` is the single source of truth. On every push to `main` that
  touches `packages/**/CHANGELOG.md` (or on manual dispatch), a Bun-run TS script parses the
  changelog, fetches existing GitHub Releases, and **creates missing** releases + **updates
  drifted** ones via the REST API. It is idempotent and re-runnable, and it backfills the full
  history.

## Strengths (context, not review points)

- Clean **pure-core / IO-shell** split: `parseChangelog`, `getReleasePlan`, `toPackageDirs` are
  pure and unit-tested with realistic fixtures across 5 changelog dialects.
- **Idempotent** design makes partial failures safe to retry.
- **Minimal dependencies** (hand-rolled `fetch`, no octokit), least-privilege token
  (`contents: write` only on the job), gated `environment: release`, and a `--dry-run` path.
- Bun-to-run-TS is **consistent with the rest of `.github/workflows`** (ci, discord, dependabot
  all use it) — the tech stack is a good fit; no concern there.

---

## A. Business goals & scope

### A1. One-time notification spam from backfilling the full history
Creating a *published* GitHub Release notifies every user watching “Releases”. Backfilling
~250 historical versions (the changelog goes back to `v0.1.0-beta.6`) will, on first
activation, emit one notification **per release per watcher**. This is a real (if one-time)
UX cost that the design doesn't acknowledge.
- Recommend: confirm whether the initial backfill has already been done quietly (the PR title
  “chore: sync …” suggests it may have), and if not, decide deliberately — e.g. accept the
  one-off noise, or seed the releases through a path that minimizes notifications — rather than
  discovering it in production.

### A2. GitHub Releases become a strictly read-only mirror — manual enrichment gets clobbered
Because drift-detection rewrites any release whose body differs from the changelog, a
maintainer can **never** hand-enrich a GitHub Release (highlights, contributor shout-outs,
screenshots, migration call-outs): the next sync silently overwrites it back to the raw
changelog section. That is an acceptable trade-off for “mirror the changelog”, but it is a
hard constraint worth stating explicitly, because populated GitHub Releases usually *tempt*
people to enrich them. If richer release notes are ever wanted, this design actively fights it.
- Recommend: document the “GitHub Releases are generated, do not edit by hand” contract
  (e.g. a short note in the release notes body or in CONTRIBUTING), so the clobbering is
  expected rather than surprising.

### A3. Whole-history backfill vs. forward-only — is the historical breadth needed?
The stated goals (notifications + readable recent notes) are served almost entirely by
*forward* releases. Backfilling years-old pre-releases adds machinery, API volume, and the A1
spam, for arguably little user value. Not necessarily wrong (completeness, browsability), but
the cost/value of *full-history* backfill deserves a conscious decision rather than being a
side-effect of “sync everything every time”.

---

## B. Core flow & architecture

### B1. (Headline) Asymmetric reconciliation — iterate the *source of truth*, not the mirror
`getReleasePlan` (`index.ts:230-246`) builds **creates** by iterating the changelog, but builds
**updates** by iterating **GitHub releases**. This asymmetry is both a latent bug and
unnecessary complexity:

- **Latent bug**: for any GitHub release whose tag is *not* in this package's changelog,
  `body = changelogSections[release.tag_name]` is `undefined`, the comparison
  `undefined === release.body?.trim()` is false, so it is queued for update with
  `body: undefined`. `JSON.stringify({body: undefined})` → `{}`, so the PATCH is a wasted
  no-op call (one per such release, each paying the 500 ms delay) **and it logs a misleading
  `Updated release <tag>`**. Today this is dormant for `vike` only if *every* GitHub release
  has a matching changelog entry; it activates the moment a release exists outside the
  changelog — a second package (see B2), a manually-created release, or a changelog entry that
  was trimmed/renamed.

- **Simplification**: drive the *entire* plan from the changelog (the source of truth) in one
  symmetric pass:
  ```ts
  const byTag = new Map(githubReleases.map((r) => [r.tag_name, r]))
  for (const [tag, body] of Object.entries(changelogSections).reverse()) {
    const existing = byTag.get(tag)
    if (!existing) → create
    else if (existing.body?.trim() !== body) → update
  }
  ```
  This is strictly better: it **cannot** touch releases outside the changelog (fixing the bug
  above *and* the cross-package contamination of B2), it's one loop instead of two, and it
  needs no `.reverse()` special-casing because creation order falls out naturally.

### B2. The multi-package generality is speculative *and* unsound as built
The workflow advertises multi-package syncing (`packages/**/CHANGELOG.md` glob,
`getPackageDirsToSync`, per-package loop, push-diff detection). But:
1. **Only `vike` has a `CHANGELOG.md`** today (`create-vike-core` has none), so none of this
   machinery is exercised — it is pure speculative generality that adds the entire
   `getPushedChangelogFiles` / `GITHUB_EVENT_PATH` / `git diff` / `toPackageDirs` layer.
2. It is **not actually sound** for multiple packages: releases are matched by **bare
   `vX.Y.Z` tag names** with no package namespace, while the repo tags `vike` as `v0.4.259`
   and (potentially) `create-vike-core` as `v0.0.391` in the **same `v*` namespace**. The
   moment a second package publishes releases, B1's pass cross-contaminates them, and two
   packages that ever share a version (`v0.0.x`) collide outright.
- Recommend **one of two clean directions**, not the current middle ground:
  - **Simplify to reality**: drop the package-selection machinery and just sync
    `packages/vike` (the trigger already filters to changelog pushes). Far less code, no
    event-payload parsing, no `git diff`.
  - **Commit to multi-package properly**: namespace tags per package (`vike@1.2.3`), and
    **filter `fetchGithubReleases` to the package's tag prefix** before planning (which also
    requires B1).

### B3. A separate reconciliation system vs. the release pipeline itself
The simplest place to create a GitHub Release is the release step that already creates the git
tag (`@brillout/release-me`). This PR instead stands up a separate parse-fetch-diff-reconcile
system. That is **justified** here by the two goals the release tool can't give you — *history
backfill* and *self-healing on changelog edits* — but it's worth stating that rationale
explicitly: absent those two goals, “emit the GitHub Release from the release pipeline” would
be dramatically simpler and should be preferred. If backfill (A3) is deemed low-value, this
whole subsystem could collapse into a release-time hook.

---

## C. Robustness

### C1. `target_commitish: defaultBranch` silently mis-tags any version that lacks a git tag
For each created release, `target_commitish` is set to `main` (`index.ts:235`). If the version
tag already exists (the normal case for published versions), GitHub ignores it. But if a
changelog version has **no** corresponding git tag (a typo in the changelog, a version
published without a tag, a hand-edited entry), GitHub **creates a new tag pointing at current
`main` HEAD** — i.e. a release silently attached to the wrong commit, with no error. The whole
backfill leans on the unstated invariant “every changelog version already has a tag”.
- Recommend: skip-and-warn (or hard-fail) when the tag is missing, rather than letting GitHub
  fabricate a wrong tag.

### C2. No `concurrency` guard — racing runs can fail or duplicate-create
Two changelog pushes to `main` in quick succession start two workflow runs; both fetch the
same release list and both attempt to create the same new release. The second create returns
`422 already_exists`, which throws and fails the run (noisy red CI), and more generally the two
runs interleave writes. Releases are infrequent and usually serialized, so this is
low-probability — but a one-line `concurrency: { group: sync-github-releases }` on the workflow
removes the class of problem cheaply.

### C3. Load-bearing dependence on GitHub's *undocumented* release ordering
The safety of backfilling old releases (“they slot into the right place / the newest stays
‘Latest’”) rests on GitHub ordering releases by the tag's semver rather than creation date.
This was verified empirically (linked PR comment) and the oldest-first `.reverse()` makes the
final `make_latest` land correctly — but it's an **undocumented behavior of an external
service** that could change. Worth a comment flagging it as an assumption (the code already
links the evidence, good) and, ideally, a defensive note that the newest release is created
last *on purpose*.

### C4. Fixed 500 ms sleep is a crude rate-limit strategy
`RATE_LIMIT_DELAY_MS = 500` after every request (`github-utils.ts:81`) is simple and fine for
an infrequent job, but it both over-waits in the common case (a single new release) and
under-protects against GitHub's *secondary* rate limits during a 250-call backfill (it ignores
`Retry-After` / `X-RateLimit-*`). Acceptable now; if API interaction grows, prefer
header-driven backoff (octokit's throttling plugin does this out of the box) over a constant
sleep.

---

## D. Simplification & efficiency

### D1. Full fetch + full diff on every run is O(all releases) for an O(1) common case
Every changelog push re-paginates **all** releases (already 3+ pages, growing unbounded) and
diffs **every** release, even though the typical push adds exactly **one** new version. B1's
source-of-truth loop doesn't change the fetch cost, but the fetch is the cheaper half; the more
interesting simplification is that the *push* path only ever needs the entries the push
actually added. If efficiency ever matters, split the responsibilities: **push → create the
newly-added entries only**; **manual `workflow_dispatch` → full resync/backfill + drift-heal**.
That keeps the steady-state path cheap and reserves the expensive whole-history reconcile for
when it's explicitly asked for. (Lower priority — releases are infrequent — but it's the
cleanest efficiency lever.)

### D2. `remove-all-releases.ts` is an unguarded, destructive admin script living in the repo
A committed script that deletes **all** GitHub Releases with no confirmation, dry-run, or
scoping is a foot-gun sitting next to the normal tooling (and reachable via the
`delete-all` package script). It's useful for redoing a botched backfill, but consider:
folding it into `index.ts` behind an explicit, loud flag (`--delete-all` with a typed
confirmation), giving it a dry-run like the main path, and/or scoping it to a package's tag
prefix so it can't nuke unrelated releases.

---

## E. Minor

### E1. Release body drops the heading line (date + compare link)
`parseChangelog` slices from the first newline *after* the heading (`index.ts:192`), so the
GitHub Release body excludes the `## [x.y.z](compare/…) (date)` line — i.e. the
version-to-version **compare link** is lost. GitHub shows the tag/date itself, so this is
probably intended, but worth confirming the compare link isn't wanted in the release notes.

### E2. `assertChangelog` couples every run to “latest entry === package.json version”
A reasonable safety guard, but it means the workflow can only succeed when the changelog's top
entry already matches the package version. That holds for release-me's atomic bump, but any
flow that edits the changelog out of lockstep with `package.json` (e.g. a release PR mid-merge)
will hard-fail the sync. Fine as-is; just be aware it's a strict invariant, not a soft check.

---

## Suggested priority

1. **B1** — fix the asymmetric reconcile (latent bug + simplification) by iterating the
   changelog. Low effort, high value.
2. **B2** — decide multi-package: simplify to `vike`-only, or namespace+filter properly.
3. **C1 / C2** — missing-tag mis-attribution and the `concurrency` guard (cheap robustness).
4. **A1 / A2** — make the backfill-spam and read-only-mirror trade-offs explicit decisions.
5. **D1 / D2 / C3 / C4 / E*** — efficiency, the destructive script, and the documented
   assumptions, as time allows.
