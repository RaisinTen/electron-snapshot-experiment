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
require('node-ipc');

// TODO(RaisinTen): Can we add require('@postman/app-logger');?

// Snapshottable dependencies of 'node-forge'
{
  require('node-forge/lib/aes');
  // Snapshottable dependencies of 'node-forge/lib/aesChipherSuites'
  {
    // Snapshottable dependencies of 'node-forge/lib/tls'
    {
      require('node-forge/lib/asn1');
      require('node-forge/lib/hmac');
      require('node-forge/lib/md5');
      require('node-forge/lib/pem');

      // Snapshottable dependencies of 'node-forge/lib/pki'
      {
        require('node-forge/lib/pbe');
      }
    }
  }
}

// TODO(RaisinTen): Can we add require('@postman/pem');?
