const path = require('path')
const fs = require('fs')

const snapshotFileName = 'snapshot_blob.bin'
const v8ContextFileName = getV8ContextFileName()
const pathToBlob = path.resolve(__dirname, '..', snapshotFileName)
const pathToBlobV8 = path.resolve(__dirname, '..', v8ContextFileName)

switch (process.platform) {
  case 'darwin': {
    const pathToElectron = path.resolve(
      __dirname,
      '..',
      'node_modules/electron/dist/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources'
    )
    console.log('Copying v8 snapshots from', pathToBlob, 'to', pathToElectron)
    fs.copyFileSync(pathToBlob, path.join(pathToElectron, snapshotFileName))
    fs.copyFileSync(pathToBlobV8, path.join(pathToElectron, v8ContextFileName))
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
    console.log('Copying v8 snapshots from', pathToBlob, 'to', pathToElectron)
    fs.copyFileSync(pathToBlob, path.join(pathToElectron, snapshotFileName))
    fs.copyFileSync(pathToBlobV8, path.join(pathToElectron, v8ContextFileName))
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
