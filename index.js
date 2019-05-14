const { execSync } = require("child_process");
const glob = require("glob");

// 0: C:\Program Files\nodejs\node.exe
// 1: C:\Temp\test\index.js
var args = process.argv.slice(2);
args.forEach(function(arg) {
  const files = getFiles(arg);
  files.forEach(function(file) {
    if (!formatFile(file)) {
      process.exit(1);
    }
    if (!lintFile(file)) {
      process.exit(1);
    }
    stageFile(file);
  });
});

function getFiles(pattern) {
  var files = glob.sync(pattern);
  var stagedFiles = getStagedFiles();
  return files.filter(file => stagedFiles.includes(file));
}

function formatFile(file) {
  console.log(`formatting ${file}`);
  return executeCommand(`npm run sqlformat -- -f ${file} -g ${file}`);
}

function lintFile(file) {
  console.log(`linting ${file}`);
  return executeCommand(`npm run tsqllint -- ${file}`);
}

function stageFile(file) {
  console.log(`adding ${file} to index`);
  return executeCommand(`git add ${file}`);
}

function executeCommand(command) {
  try {
    execSync(command);
    return true;
  } catch (error) {
    console.log(`stderr ${error.stdout.toString()}`);
    return false;
  }
}

function getStagedFiles() {
  var output = execSync(
    `git diff --cached --name-only --diff-filter=ADMR`
  ).toString();
  return output;
}
