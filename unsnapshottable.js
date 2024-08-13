// Make require('glob').Glob inherit from EventEmitter. This needs to be done
// here because EventEmitter is not a part of the default V8 context which is
// used to generate the V8 snapshot.
{
  const glob = require('glob');
  const util = require('node:util');
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
