
import homePath from './paths.js';
var log4js = require('log4js');

console.log('loggerPath:' + homePath)
log4js.configure({
    appenders: {
        tdarr: {
            type: 'file',
            filename: homePath + "/Tdarr/Logs/log.txt",
            maxLogSize: 1 * 1024 * 1024, // = 10Mb
            backups: 5, // keep five backup files
        },
        console: { type: 'console' }
    },
    categories: { default: { appenders: ['console', 'tdarr'], level: 'trace' } }
});

logger = log4js.getLogger('tdarr');

module.exports = logger