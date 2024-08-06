const { flipFuses, FuseVersion, FuseV1Options } = require('@electron/fuses')
const path = require('path')
const fs = require('fs')

const snapshotFileName = 'snapshot_blob.bin'
const v8ContextFileName = 'browser_v8_context_snapshot.bin'

switch (process.platform) {
  case 'darwin': {
    const pathToElectron = path.resolve(
      __dirname,
      '..',
      'node_modules/electron/dist/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources'
    )

    console.log('Removing v8 snapshot from', path.join(pathToElectron, snapshotFileName))
    fs.unlinkSync(path.join(pathToElectron, snapshotFileName))
    fs.unlinkSync(path.join(pathToElectron, v8ContextFileName))
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

    console.log('Removing v8 snapshot from', path.join(pathToElectron, snapshotFileName))
    fs.unlinkSync(path.join(pathToElectron, snapshotFileName))
    fs.unlinkSync(path.join(pathToElectron, v8ContextFileName))
    break
  }
}

flipFuses(
  // Path to electron
  require('electron'),
  // Fuses to flip
  {
    version: FuseVersion.V1,
    [FuseV1Options.LoadBrowserProcessSpecificV8Snapshot]: false
  }
)
