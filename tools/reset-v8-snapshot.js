const { flipFuses, FuseVersion, FuseV1Options } = require('@electron/fuses')
const path = require('path')
const fs = require('fs')

const v8ContextFileName = 'browser_v8_context_snapshot.bin'

switch (process.platform) {
  case 'darwin': {
    const pathToElectron = path.resolve(
      __dirname,
      '..',
      'node_modules/electron/dist/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources'
    )
    const pathToV8ContextFileName = path.join(pathToElectron, v8ContextFileName);

    console.log('Removing v8 snapshot from', pathToV8ContextFileName)
    fs.unlinkSync(pathToV8ContextFileName)
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
    const pathToV8ContextFileName = path.join(pathToElectron, v8ContextFileName);

    console.log('Removing v8 snapshot from', pathToV8ContextFileName)
    fs.unlinkSync(pathToV8ContextFileName)
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
