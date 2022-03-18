# Contribute to `vite-plugin-ssr`

- [System requirements](#system-requirements)
  - [Testing on Debian](#testing-on-debian)
- [Install & build](#install--build)
- [Ceate new example](#create-new-example)
- [Modify existing example](#modify-existing-example)
- [Modify `vite-plugin-ssr`](#modify-vite-plugin-ssr)
- [Run test suite](#run-test-suite)

<br/>

## System requirements

- Unix (e.g. macOS or Linux). (Windows may work but there are no guarantees.)
- Node.js `>= v15.0.0`.
- [pnpm](https://pnpm.io/) `>= v6.21.0`. (To install it: `$ npm install -g pnpm`.)

> These requirements are for developing only; `vite-plugin-ssr` can be used with any package manager, Windows, and Node.js `>= v12.19.0`.

### Testing on Debian

To run the test suite on Debian, additional dependencies are needed to install [playwright](https://github.com/microsoft/playwright).

<details>
  <summary>Click for details</summary>
  
  #### Installing playwright
  
  When running the test suite on Debian, playwright prompts to install its dependencies using:
  
  ```shell
  npx playwright install-deps
  ```
  
  According to the playwright's [system requirements](https://playwright.dev/docs/library#system-requirements), only Ubuntu is officially supported, so when running the command, it tries to install the required packages `libjpeg-turbo8` and `libicu66` with apt-get, which does not exist in the Debian sources list.
  
  #### Resolve missing dependencies
  
  To resolve the missing dependencies, you can:
  
  1. either follow the error messages and install all dependencies manually
  2. add `non-free` sources to `sources.list` and install `libjpeg-turbo8` and `libicu66` manually

  To add the `non-free` sources to `deb` and `deb-src`:

  ```shell
  sudo nano /etc/apt/sources.list

  # add the sources

  deb http://deb.debian.org/debian/ bullseye main non-free
  deb-src http://deb.debian.org/debian/ bullseye main non-free

  # update package information

  sudo apt-get update
  ```

  Download the official Ubuntu `libjpeg-turbo8` and `libicu66` packages from [pkgs.org](https://pkgs.org/) using `wget`:

  - [libjpeg-turbo8](https://pkgs.org/download/libjpeg-turbo8)
  - [libicu66](https://pkgs.org/download/libicu66)

  You should be able to install both packages, since the required dependencies will be resolved automatically through the non-free sources:

  ```shell
  wget <url-topackage>.deb
  dpkg -i <package>.deb
  ```

  With all packages successfully installed, you can finally install `playwright`:

  ```shell
  npx playwright install-deps
  ``` 
</details>

<br/>

## Install & build

Install all dependencies of the entire monorepo:

```shell
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/
pnpm run setup
pnpm install
```

> We need `pnpm run setup` for setting up the [`libframe/`](https://github.com/vikejs/libframe) submodule.

Build the `vite-plugin-ssr` source code:

```shell
pnpm run build
```

<br/>

## Create new example

New examples should be minimal and implement only what you want to showcase.

Start off with `/examples/react/` or `/examples/vue/` as these are minimal demos.

> Do not start off `/examples/react-full/` nor `/examples/vue-full/` as these are full-featured demos.

<br/>

## Modify existing example

Follow the instructions of [Install & Build](#install--build).

> We do not follow the `README` instructions of the example, instead we install the entire monorepo in order to be able to run the example's test.

To run the example:

```shell
cd examples/some-example/
pnpm run dev
# Or, depending on the example:
pnpm run start
```

Check whether the tests defined in `examples/some-example/*.spec.ts` are still valid and make changes accordingly.

To run the example's tests, follow the instructions of [Run test suite](#run-test-suite).

<br/>

## Modify `vite-plugin-ssr`

Follow the instructions of [Install & Build](#install--build).

Run TypeScript in watch mode:

```shell
pnpm run dev
```

You can now change the source code of `vite-plugin-ssr` (`/vite-plugin-ssr/`) and try your modifications with one of the examples (`/examples/*`) or boilerplates (`/boilerplates/boilerplate-*`).
You may need to restart the example's Node.js server for your modifications to apply.

If you are having problems running the test suite (e.g. your machine has low memory),
you can open a Pull Request in
[draft mode](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/changing-the-stage-of-a-pull-request#converting-a-pull-request-to-a-draft)
to let GitHub Actions run the test suite for you.

<br/>

## Run test suite

Follow the instructions of [Install & Build](#install--build).

To run all tests:

```shell
pnpm run test
# To skip TypeScript type checking:
pnpm run test --skipTs
```

To run only the tests of a single example/boilerplate:

```shell
# Provide example/boilerplate path
pnpm run test examples/some-example/
# Or provide a substring of the path
pnpm run test ome-exampl
```

