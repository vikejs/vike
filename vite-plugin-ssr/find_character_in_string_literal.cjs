const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const acorn = require('acorn');
const walk = require('acorn-walk');
const esbuild = require('esbuild');

function execute(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

async function getGitFiles() {
  try {
    const stdout = await execute('git ls-files');
    return stdout.split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error running "git ls-files":', error.message);
    process.exit(1);
  }
}

async function transpileToJavaScript(tsFilePath) {
  const jsFilePath = tsFilePath.replace(/\.tsx?$/, '.js');
  
  // Use esbuild to transpile TypeScript to JavaScript
  await esbuild.build({
    entryPoints: [tsFilePath],
    outfile: jsFilePath,
    logLevel: 'error',
    format: 'esm', // Use ECMAScript Modules (ESM) format
  });
  
  return jsFilePath;
}

function searchFileForCharacter(filePath, character) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const ast = acorn.parse(fileContent, { ecmaVersion: 'latest', sourceType: 'module' }); // Specify sourceType: 'script'

  walk.simple(ast, {
    Literal(node) {
      if (typeof node.value === 'string' && node.value.includes(character)) {
        console.log(filePath.slice(0, -1 * '.js'.length)+'.ts');
      }
    },
  });
}

async function removeJavaScriptFiles(filePaths) {
  for (const filePath of filePaths) {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error(`Error deleting ${filePath}:`, error.message);
    }
  }
}

async function main() {
  const gitFiles = await getGitFiles();
  const generatedJavaScriptFiles = [];

  const characterToSearch = '`'; // Change this to the character you want to find

  for (const filePath of gitFiles) {
    if (path.extname(filePath) === '.ts' || path.extname(filePath) === '.tsx') {
      // If it's a TypeScript file, transpile it to JavaScript
      const jsFilePath = await transpileToJavaScript(filePath);
      generatedJavaScriptFiles.push(jsFilePath);
      searchFileForCharacter(jsFilePath, characterToSearch);
    }
  }

  // Remove the generated JavaScript files
  removeJavaScriptFiles(generatedJavaScriptFiles);
}

main();

