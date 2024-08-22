const util = require('node:util');
const { EventEmitter } = require('node:events');
const Agent = require('agent-base');

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
  util.inherits(AbstractUpdater, EventEmitter);
}
