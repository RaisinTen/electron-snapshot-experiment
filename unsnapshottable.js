const util = require('node:util');
const { EventEmitter } = require('node:events');
const { Writable } = require('node:stream');
const Agent = require('agent-base');
const TransportStream = require('winston-transport/modern');

// Dynamically make the `target` class extend from `base`. Differences with
// util.inherits():
// - Unlike extendClass, util.inherits() defines the `super_` property
// - Unlike extendClass, util.inherits() does not allow inheriting static
//   properties
function extendClass(target, base) {
  Object.setPrototypeOf(target, base);
  Object.setPrototypeOf(target.prototype, base.prototype);
}

// Make require('glob').Glob inherit from EventEmitter. This needs to be done
// here because EventEmitter is not a part of the default V8 context which is
// used to generate the V8 snapshot.
{
  const glob = require('glob');
  util.inherits(glob.Glob, EventEmitter);
}

// Set minimatch.sep with path.sep. This needs to be done here because the
// 'node:path' module is not a part of the default V8 context which is
// used to generate the V8 snapshot.
{
  const minimatch = require('minimatch');
  const path = require('node:path');
  minimatch.sep = path.sep
}

// Since `util.debuglog` and 'signal-exit' are not a part of the V8 snapshot,
// the code from the 'lockfile' module that uses these have been moved here.
{
  const debug = util.debuglog('LOCKFILE')

  const onExit = require('signal-exit')
  onExit(function () {
    const { locks, unlockSync } = require('lockfile');
    debug('exit listener')
    // cleanup
    Object.keys(locks).forEach(unlockSync)
  })
}

// Make require('binary-search-tree').AVLTree._AVLTree inherit from
// require('binary-search-tree').BinaryTree. This needs to be done here because
// util.inherits() is not a part of the default V8 context which is used to
// generate the V8 snapshot.
{
  const { BinarySearchTree, AVLTree } = require('binary-search-tree');
  util.inherits(AVLTree._AVLTree, BinarySearchTree);
}

// Move the code for attaching the fs module methods from 'nedb/lib/storage' to
// here because the fs module is not available in the V8 snapshot.
{
  const fs = require('node:fs');
  const storage = require('nedb/lib/storage');
  storage.exists = fs.exists;
  storage.rename = fs.rename;
  storage.writeFile = fs.writeFile;
  storage.unlink = fs.unlink;
  storage.appendFile = fs.appendFile;
  storage.readFile = fs.readFile;
}

// Make require('nedb/lib/datastore') inherit from
// require('events').EventEmitter. This needs to be done here because
// util.inherits() is not a part of the default V8 context which is used to
// generate the V8 snapshot.
{
  const Datastore = require('nedb/lib/datastore');
  util.inherits(Datastore, EventEmitter);
}

// Move code to capture process.exit and process.env and delete
// process.env.OLDPWD from 'shelljs' to here because these are not available in
// the V8 snapshot.
{
  const sh = require('shelljs');
  sh.exit = process.exit;
  sh.env = process.env;

  delete process.env.OLDPWD; // initially, there's no previous directory
}

// Make require('agent-base') inherit from EventEmitter. This needs to be done
// here because EventEmitter is not a part of the default V8 context which is
// used to generate the V8 snapshot. Also, runs 'agent-base/patch-core'.
{
  require('agent-base/patch-core')
  util.inherits(Agent, EventEmitter);
}

// Make require('https-proxy-agent') inherit from Agent. This needs to be done
// here because util.inherits() is not a part of the default V8 context which is
// used to generate the V8 snapshot.
{
  const HttpsProxyAgent = require('https-proxy-agent');
  util.inherits(HttpsProxyAgent, Agent);
}

// Move the code to the require the 'console' module from
// 'node_modules/@sentry/node/dist/integrations/console.js to here because the
// 'console' module is not available in the context of the V8 snapshot.
{
  // special case: since console is built-in and app-level code won't require() it, do that here
  require('console');
}

// Move the code for making AbstractUpdater from
// '@postman/app-updater/lib/AbstractUpdater' inherit from EventEmitter here
// because EventEmitter is not a part of the V8 snapshot.
{
  const AbstractUpdater = require('@postman/app-updater/lib/AbstractUpdater');
  extendClass(AbstractUpdater, EventEmitter);
}

// Move the code for making LinuxAutoUpdater from
// '@postman/app-updater/lib/autoUpdater/LinuxAutoUpdater' inherit from
// EventEmitter here because EventEmitter is not a part of the V8 snapshot.
{
  const LinuxAutoUpdater = require('@postman/app-updater/lib/autoUpdater/LinuxAutoUpdater');
  extendClass(LinuxAutoUpdater, EventEmitter);
}

// Move the code for making Receiver from 'ws/lib/receiver' inherit from
// stream.Writable here because Writable is not a part of the V8 snapshot.
{
  const { Writable } = require('node:stream');
  const Receiver = require('./node_modules/ws/lib/receiver');
  extendClass(Receiver, Writable);
}

// Move the code for making WebSocket from 'ws/lib/websocket' inherit from
// EventEmitter here because EventEmitter is not a part of the V8 snapshot.
{
  const WebSocket = require('./node_modules/ws/lib/websocket');
  extendClass(WebSocket, EventEmitter);
}

// Move the code for making WebSocket from 'ws/lib/websocket-server' inherit from
// EventEmitter here because EventEmitter is not a part of the V8 snapshot.
{
  const WebSocketServer = require('./node_modules/ws/lib/websocket-server');
  extendClass(WebSocketServer, EventEmitter);
}

// Monkey-patch the 'node-ipc' module to export an IPCModule instance instead of
// the IPCModule class because that is what the original module does. It has
// been patched to return the class, so that it can be snapshotted.
{
  const IPCModule = require('node-ipc');
  require.cache[require.resolve('node-ipc')] = new IPCModule();
}

// Move the code for assigning nextTick, setImmediate and globalScope to the
// 'node-forge/lib/util' module here because those variables are not available
// in the default context of the V8 snapshot.
{
  const nodeForgeUtil = require('node-forge/lib/util');
  nodeForgeUtil.nextTick = process.nextTick;
  nodeForgeUtil.setImmediate = setImmediate;
  nodeForgeUtil.globalScope = global;
}

// Move the code for creating the default PRNG context out of
// 'node-forge/lib/random.js' because that requires the usage of the 'crypto'
// module which is not available in the default context of the V8 snapshot.
{
  const { forge, spawnPrng } = require('node-forge/lib/random');
  forge.random = spawnPrng();
  // expose spawn PRNG
  forge.random.createInstance = spawnPrng;
  require.cache[require.resolve('node-forge/lib/random')] = forge.random;
}

// Move the code from 'winston/lib/winston/exception-stream.js' for extending
// ExceptionStream from stream.Writable here because the 'stream' module is not
// available in the V8 snapshot.
{
  const ExceptionStream = require('winston/lib/winston/exception-stream');
  extendClass(ExceptionStream, Writable);
}

// Move the code from 'winston-transport/modern.js' for extending
// TransportStream from stream.Writable here because the 'stream' module is not
// available in the V8 snapshot.
{
  util.inherits(TransportStream, Writable);
}

// Move the code from 'winston-transport/legacy.js' for extending
// LegacyTransportStream from TransportStream here because the 'util' module
// is not available in the V8 snapshot.
{
  const LegacyTransportStream = require('winston-transport/legacy');
  util.inherits(LegacyTransportStream, TransportStream);
}
