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

// Snapshottable dependencies of '@postman/app-logger'
{
  // Snapshottable dependencies of '@postman/app-logger/lib'
  {
    require('@postman/app-logger/lib/originators');

    // Snapshottable dependencies of '@postman/app-logger/collectors'
    {
      // Snapshottable dependencies of '@postman/app-logger/collectors/winston/WinstonCollector'
      {
        // Snapshottable dependencies of 'winston'
        {
          // Snapshottable dependencies of 'logform'
          {
            require('logform/format');
            require('logform/levels');
          }

          require('winston/lib/winston/common');
          require('winston/package.json');

          // TODO(RaisinTen): Can we add require('winston/lib/winston/transports');?
          // TODO(RaisinTen): Can we add require('winston/lib/winston/config');?

          // Snapshottable dependencies of 'winston/lib/winston/create-logger'
          {
            // Snapshottable dependencies of 'winston/lib/winston/logger'
            {
              require('winston/node_modules/async/forEach');
              require('is-stream');
              require('winston/lib/winston/exception-handler');
              require('winston-transport/legacy');
              require('winston/lib/winston/profiler');
            }
          }

          // TODO(RaisinTen): Can we add require('winston/lib/winston/container');?
          // TODO(RaisinTen): Can we add require('winston-transport');?

          require('logform/json');
        }

        require('@postman/app-logger/lib/helpers/format');
      }

      // TODO(RaisinTen): Can we add require('@postman/app-logger/lib/collectors/winston/FileCollector');?
      // TODO(RaisinTen): Can we add require('@postman/app-logger/lib/collectors/winston/NewRelicCollector');?
      // TODO(RaisinTen): Can we add require('@postman/app-logger/lib/collectors/winston/SentryCollector');?
    }
  }
}

require('node-forge');

// TODO(RaisinTen): Can we add require('@postman/pem');?
