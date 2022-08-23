#!/usr/bin/env node

// @ts-check
const fs = require('fs')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))
const { prompt } = require('enquirer')
const { green, cyan, stripColors, bold } = require('kolorist')
const { execSync } = require('child_process')

const BOILERPLATES = [green('vue'), green('vue-ts'), cyan('react'), cyan('react-ts')]
const IGNORE_FILES = ['.prettierrc', '.test-dev.spec.ts', '.test-prod.spec.ts']
//const IGNORE_PACKAGE_JSON = ['name', 'version', '// Needed for Yarn workspaces']
const IGNORE_PACKAGE_JSON = []
const RENAME_FILES = {
  _gitignore: '.gitignore'
}

const cwd = process.cwd()

async function init() {
  let targetDir = argv._[0]
  if (!targetDir) {
    /**
     * @type {{ name: string }}
     */
    const { name } = await prompt({
      type: 'input',
      name: 'name',
      message: `Project name:`,
      initial: 'vite-ssr-project'
    })
    targetDir = name
  }

  const root = path.join(cwd, targetDir)
  console.log(`\nScaffolding project in ${root}...`)

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true })
  } else {
    const existing = fs.readdirSync(root)
    if (existing.length) {
      /**
       * @type {{ yes: boolean }}
       */
      const { yes } = await prompt({
        type: 'confirm',
        name: 'yes',
        initial: 'Y',
        message: `Target directory ${targetDir} is not empty.\n` + `Remove existing files and continue?`
      })
      if (yes) {
        emptyDir(root)
      } else {
        return
      }
    }
  }

  // determine boilerplate
  let boilerplate = argv.t || argv.boilerplate
  let message = 'Select a boilerplate:'
  let isValidBoilerplate = false

  // --boilerplate expects a value
  if (typeof boilerplate === 'string') {
    const availableBoilerplates = BOILERPLATES.map(stripColors)
    isValidBoilerplate = availableBoilerplates.includes(boilerplate)
    message = `${boilerplate} isn't a valid boilerplate. Please choose from below:`
  }

  if (!boilerplate || !isValidBoilerplate) {
    /**
     * @type {{ t: string }}
     */
    const { t } = await prompt({
      type: 'select',
      name: 't',
      message,
      choices: BOILERPLATES
    })
    boilerplate = stripColors(t)
  }

  const boilerplateDir = path.join(__dirname, `boilerplate-${boilerplate}`)

  const write = (file) => {
    const targetPath = RENAME_FILES[file] ? path.join(root, RENAME_FILES[file]) : path.join(root, file)
    if (file === 'package.json') {
      let content = JSON.parse(fs.readFileSync(path.join(boilerplateDir, file)).toString())
      IGNORE_PACKAGE_JSON.forEach((key) => {
        delete content[key]
      })
      content = JSON.stringify(content, null, 2)
      fs.writeFileSync(targetPath, content + '\n')
    } else {
      copy(path.join(boilerplateDir, file), targetPath)
    }
  }

  const files = fs.readdirSync(boilerplateDir)
  for (const file of files.filter((f) => !IGNORE_FILES.includes(f))) {
    write(file)
  }

  if (!argv['skip-git']) {
    initGitRepo(root)
  }

  console.log(`\nDone. Now run:\n`)
  if (root !== cwd) {
    console.log(cmd(`  cd ${path.relative(cwd, root)}/`))
  }
  console.log(`  ${cmd('npm install')} (or ${cmd('pnpm install')} / ${cmd('yarn install')})`)
  console.log(`  ${cmd('npm run dev')} (or ${cmd('pnpm run dev')} / ${cmd('yarn dev')})`)
  console.log()
}

function cmd(str) {
  return bold(str)
}

function copy(src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    const abs = path.resolve(dir, file)
    // baseline is Node 12 so can't use rmSync :(
    if (fs.lstatSync(abs).isDirectory()) {
      emptyDir(abs)
      fs.rmdirSync(abs)
    } else {
      fs.unlinkSync(abs)
    }
  }
}

function initGitRepo(cwd) {
  if (!isGitInstalled()) {
    return
  }

  execSync('git init', { cwd })
  execSync('git add .', { cwd })
  execSync(
    [
      'git',
      '-c user.name="Romuald Brillout"',
      '-c user.email="vite-plugin-ssr@brillout.com"',
      'commit',
      '--no-gpg-sign',
      '--message="boilerplate Vite w/ vite-plugin-ssr"'
    ].join(' '),
    { cwd }
  )
}
function isGitInstalled() {
  let stdout
  try {
    stdout = execSync('git --version')
  } catch (err) {
    return false
  }
  return !!stdout
}

init().catch((e) => {
  console.error(e)
})
