import { getFiles, replaceFile } from '@brillout/replace'

const files = await getFiles()
files
  .filter((f) => f.endsWith('test-e2e.json'))
  .forEach((file) => {
    replaceFile(file, (fileContent) => fileContent.replace('"name"', '"ci": { "job"') + '}')
  })
