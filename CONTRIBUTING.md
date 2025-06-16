# Contributing

To develop Vike's documentation (`https://vike.dev`):

- [Docs](#docs)

To develop Vike's source code:

- [Get started](#get-started)
- [Run tests](#run-tests)

<br/>


## Get started

**1. Install**

```shell
git clone git@github.com:vikejs/vike
cd vike/ # Go to the monorepo root
pnpm install
```

> [!NOTE]
> See [System requirements](#system-requirements) for how to install pnpm.

**2. Build**

To build Vike's source code:

```shell
pnpm build # At the monorepo root
```

Or, if you want to watch & re-build upon modifications:

```shell
pnpm run dev # At the monorepo root
```

> [!NOTE]
> When switching Git branches, you may need to run `$ pnpm reset` (at the monorepo root): it will re-install and re-build everything. It's required when switching to a branch that, for example, changes the `dependencies` list of `package.json`.

**3. Try**

To try your modifications, open a second shell and run:

```shell
cd examples/react-full/ # or another example
pnpm run dev
```

> [!WARNING]
> After changing the source code of Vike, make sure to **always clear Vite's client cache** with `$ rm -rf examples/some-example/node_modules/.vite/`. Otherwise you'll get a version mismatch between the server (using the latest build) and the client (using the previous cached build).

<br/>


## Run tests

**Run all**

At the monorepo root:

```shell
# Run the unit tests /**/*.spec.js
pnpm exec vitest --project unit

# Run the end-to-end tests /**/*.test.js
pnpm exec test-e2e
```

> [!TIP]
> The end-to-end tests can take a lot of time. We therefore recommend the following:
> - Instead of running all end-to-end tests, run only the end-to-end tests of one example.
> - Instead of running all end-to-end tests locally, run them on GitHub: push your changes to your Vike fork (`github.com/your-username/vike`) and see the result of all end-to-end tests on the GitHub actions of your fork. On GitHub, the tests run in parallel and thus *much* faster than locally.

> [!NOTE]
> On Debian, [these additional steps](https://github.com/vikejs/vike/issues/283#issuecomment-1072974554) are required.

**Run subset**

To run the end-to-end tests of only one example:

```shell
cd examples/some-example/ # From the monorepo root
pnpm exec test-e2e
```

Or:

<!-- spellcheck-ignore:on -->
```shell
# Filter
pnpm exec test-e2e ome-exampl # At the monorepo root
```
<!-- spellcheck-ignore:off -->

<br/>


## Docs

To develop Vike's documentation (`https://vike.dev`):

**1. Install**

```shell
git clone git@github.com:vikejs/vike
cd vike/ # Go to the monorepo root
pnpm install
```

> [!NOTE]
> See [System requirements](#system-requirements) for how to install pnpm.

**2. Build Vike**

```shell
pnpm build # At the monorepo root
```

**3. Develop docs**

```shell
cd packages/vike.dev/ # From the monorepo root
pnpm run dev
```

<br/>


## System requirements

- Node.js `>=20.0.0`
- [pnpm](https://pnpm.io)

> [!NOTE]
> To install [pnpm](https://pnpm.io) run:
> ```shell
> npm install -g pnpm
> ```
> (Or see [pnpm Docs > Installation](https://pnpm.io/installation) for alternative methods.)

> [!NOTE]
> These requirements are only needed for developing the source code of Vike. The npm package `vike` itself can be used with any package manager.
