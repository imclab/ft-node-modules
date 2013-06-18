var util = require('util');

function getLogLevel (level, levels) {
    "use strict";
    var intLevel = -1;
    if (levels[level]) {
        intLevel = levels[level];
    }
    return intLevel;
}

var consoleWriter = function () {
    var logLevel = 'info',
        logLevels = {},
        logLevelInt = 0;

    function log (msgLogLevel, msg) {
        var msgLoglevelInt = getLogLevel(msgLogLevel, logLevels);

        if (msgLoglevelInt >= logLevelInt) {
            if (msgLogLevel === 'error') {
                process.stderr.write(util.format(msg) + '\n');
            } else {
                process.stdout.write(util.format(msg) + '\n');
            }
        }
    }

    function init (config) {
        logLevel = config.logLevel;
        logLevels = config.logLevels;
        logLevelInt = getLogLevel(logLevel, logLevels);
    }

    return {
        init: init,
        log: log
    };
}();
exports.consoleWriter = consoleWriter;