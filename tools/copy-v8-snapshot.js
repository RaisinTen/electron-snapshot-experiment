const { flipFuses, FuseVersion, FuseV1Options } = require('@electron/fuses')
const path = require('path')
const fs = require('fs')

const snapshotFileName = 'snapshot_blob.bin'
const v8ContextFileName = getV8ContextFileName()
const pathToSnapshotBlob = path.resolve(__dirname, '..', snapshotFileName)
const pathToV8ContextBlob = path.resolve(__dirname, '..', v8ContextFileName)

switch (process.platform) {
  case 'darwin': {
    const pathToElectron = path.resolve(
      __dirname,
      '..',
      'node_modules/electron/dist/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources'
    )

    console.log('Copying v8 snapshots from', pathToSnapshotBlob, 'to', pathToElectron)
    fs.copyFileSync(pathToSnapshotBlob, path.join(pathToElectron, snapshotFileName))
    fs.copyFileSync(pathToV8ContextBlob, path.join(pathToElectron, 'browser_v8_context_snapshot.bin'))
    break
  }
  case 'win32':
  case 'linux': {
    const pathToElectron = path.resolve(
      __dirname,
      '..',
      'node_modules',
      'electron',
      'dist'
    )

    console.log('Copying v8 snapshots from', pathToSnapshotBlob, 'to', pathToElectron)
    fs.copyFileSync(pathToSnapshotBlob, path.join(pathToElectron, snapshotFileName))
    fs.copyFileSync(pathToV8ContextBlob, path.join(pathToElectron, 'browser_v8_context_snapshot.bin'))
    break
  }
}

function getV8ContextFileName() {
  if (process.platform === 'darwin') {
    return `v8_context_snapshot${
      process.arch.startsWith('arm') ? '.arm64' : '.x86_64'
    }.bin`
  } else {
    return `v8_context_snapshot.bin`
  }
}

flipFuses(
  // Path to electron
  require('electron'),
  // Fuses to flip
  {
    version: FuseVersion.V1,
    [FuseV1Options.LoadBrowserProcessSpecificV8Snapshot]: true
  }
)
