// Snapshottable dependencies

require('semver');
require('circular-json');
require('lodash');
require('async');
require('i18next');

// Snapshottable dependencies of 'electron-json-storage'
{
  require('electron-json-storage/node_modules/async');
  require('rimraf');
  require('mkdirp');

  // Snapshottable dependencies of 'write-file-atomic'
  {
    // Snapshottable dependencies of 'graceful-fs'
    {
      // TODO(RaisinTen): Why does require('graceful-fs/polyfills'); not work?
      require('graceful-fs/legacy-streams');
      require('graceful-fs/clone');
    }
    require('imurmurhash');
    // Snapshottable dependencies of 'signal-exit'
    {
      // TODO(RaisinTen): Can we add require('signal-exit');?
      require('signal-exit/signals');
    }
  }

  require('electron-json-storage/lib/utils');
  require('electron-json-storage/lib/lock');
}

require('uuid/v4');
require('nedb');
require('@sentry/node');
require('shelljs');
require('sudo-prompt');
require('serialised-error');
require('@postman/app-updater');
require('ws');
require('@raisinten/aes-crypto-js');

// Snapshottable dependencies of 'node-ipc'
{
  require('node-ipc/entities/Defaults');
}

// TODO(RaisinTen): Can we add require('@postman/app-logger');?

// TODO(RaisinTen): Can we add require('node-forge');?

// TODO(RaisinTen): Can we add require('@postman/pem');?
