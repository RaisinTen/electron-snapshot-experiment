const path = require('path')
const fs = require('fs')

const snapshotFileName = 'snapshot_blob.bin'
const v8ContextFileName = getV8ContextFileName()
const pathToBlobV8Old = path.resolve(__dirname, '..', `old-${v8ContextFileName}`)

switch (process.platform) {
  case 'darwin': {
    const pathToElectron = path.resolve(
      __dirname,
      '..',
      'node_modules/electron/dist/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources'
    )

    console.log('Removing v8 snapshot from', path.join(pathToElectron, snapshotFileName))
    fs.unlinkSync(path.join(pathToElectron, snapshotFileName))

    console.log('Copying old v8 snapshots from', pathToBlobV8Old, 'to', pathToElectron)
    fs.copyFileSync(pathToBlobV8Old, path.join(pathToElectron, v8ContextFileName))
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

    console.log('Copying old v8 snapshots from', pathToBlobV8Old, 'to', pathToElectron)
    fs.copyFileSync(pathToBlobV8Old, path.join(pathToElectron, v8ContextFileName))
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
