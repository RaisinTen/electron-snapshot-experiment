const path = require('path')
const fs = require('fs')

const v8ContextFileName = getV8ContextFileName()
const pathToV8ContextBlobOld = path.resolve(__dirname, '..', `old-${v8ContextFileName}`)

switch (process.platform) {
  case 'darwin': {
    const pathToElectron = path.resolve(
      __dirname,
      '..',
      'node_modules/electron/dist/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources'
    )
    const pathToElectronV8ContextBlob = path.join(pathToElectron, v8ContextFileName);

    console.log('Replacing V8 snapshot from', pathToElectronV8ContextBlob, 'with old V8 snapshot from', pathToV8ContextBlobOld)
    fs.renameSync(pathToV8ContextBlobOld, pathToElectronV8ContextBlob)
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
    const pathToElectronV8ContextBlob = path.join(pathToElectron, v8ContextFileName);

    console.log('Replacing V8 snapshot from', pathToElectronV8ContextBlob, 'with old V8 snapshot from', pathToV8ContextBlobOld)
    fs.renameSync(pathToV8ContextBlobOld, pathToElectronV8ContextBlob)
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
