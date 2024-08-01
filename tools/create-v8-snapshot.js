const childProcess = require('child_process')
const vm = require('vm')
const path = require('path')
const fs = require('fs')
const electronLink = require('electron-link')

const excludedModules = {}

async function main () {
  const baseDirPath = path.resolve(__dirname, '..')

  console.log('Creating a linked script..')
  const result = await electronLink({
    baseDirPath: baseDirPath,
    mainPath: `${baseDirPath}/snapshot.js`,
    cachePath: `${baseDirPath}/cache`,
    shouldExcludeModule: (modulePath) => excludedModules.hasOwnProperty(modulePath)
  })

  const snapshotScriptPath = `${baseDirPath}/cache/snapshot.js`
  fs.writeFileSync(snapshotScriptPath, result.snapshotScript)

  // Verify if we will be able to use this in `mksnapshot`
  vm.runInNewContext(result.snapshotScript, undefined, {filename: snapshotScriptPath, displayErrors: true})

  const outputBlobPath = baseDirPath
  console.log(`Generating startup blob in "${outputBlobPath}"`)
  childProcess.execFileSync(
    path.resolve(
      __dirname,
      '..',
      'node_modules',
      '.bin',
      'mksnapshot' + (process.platform === 'win32' ? '.cmd' : '')
    ),
    [snapshotScriptPath, '--output_dir', outputBlobPath]
  )
}

main().catch(err => console.error(err))
