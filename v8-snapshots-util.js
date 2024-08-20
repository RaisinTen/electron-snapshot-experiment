const path = require('path')

if (typeof snapshotResult !== 'undefined') {
  // console.log('snapshotResult available!', snapshotResult)

  const Module = require('module')
  const entryPointDirPath = __dirname;
  // console.log('entryPointDirPath:', entryPointDirPath)

  Module.prototype.require = function (module) {
    const absoluteFilePath = Module._resolveFilename(module, this, false)
    let relativeFilePath = path.relative(entryPointDirPath, absoluteFilePath)
    if (!relativeFilePath.startsWith('./')) {
      relativeFilePath = `./${relativeFilePath}`
    }
    if (process.platform === 'win32') {
      relativeFilePath = relativeFilePath.replace(/\\/g, '/')
    }
    let cachedModule = snapshotResult.customRequire.cache[relativeFilePath]
    if (snapshotResult.customRequire.cache[relativeFilePath]) {
      // console.log('Snapshot cache hit:', relativeFilePath)
    }
    if (!cachedModule) {
      // console.log('Uncached module:', module, relativeFilePath)
      cachedModule = { exports: Module._load(module, this, false) }
      snapshotResult.customRequire.cache[relativeFilePath] = cachedModule
    }
    return cachedModule.exports
  }

  snapshotResult.setGlobals(
    global,
    process,
    undefined /* window */,
    undefined /* document */,
    console,
    require
  )
}
