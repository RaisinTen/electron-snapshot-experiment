require('semver');
require('circular-json');
require('lodash');
require('async');
require('i18next');

// Snapshottable dependencies of 'electron-json-storage'.
require('electron-json-storage/node_modules/async');
require('rimraf');
require('mkdirp');

// Snapshottable dependencies of 'write-file-atomic'.
  // Snapshottable dependencies of 'graceful-fs'.
  // TODO(RaisinTen): Why does require('graceful-fs/polyfills'); not work?
  require('graceful-fs/legacy-streams');
  require('graceful-fs/clone');
require('imurmurhash');
// TODO(RaisinTen): Can we add require('signal-exit');?
require('signal-exit/signals');
