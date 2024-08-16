const util = require('node:util');

// Make require('glob').Glob inherit from EventEmitter. This needs to be done
// here because EventEmitter is not a part of the default V8 context which is
// used to generate the V8 snapshot.
{
  const glob = require('glob');
  const EE = require('node:events').EventEmitter;
  util.inherits(glob.Glob, EE);
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
