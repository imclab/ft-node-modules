var winston         = require("winston"),
    logModules      = require("./lib/logger/logModules.js"),
    Konsole         = require("konsole"),
    fs              = require("fs"),
    logentries      = require("node-logentries"),
    ftUtils         = require("./lib/utils.js"),
    util            = require('util'),
    logE;

// Default configuration options for the logger module
var loggerConfig = {
    console: {
        logLevel: 'log'
    },
    local: {
        logDir: null,
        logFile: null,
        logLevel: 'info'
    },
    loggly: {
        logglyKey: null,
        logglyDomain: null,
        logLevel: 'info'
    },
    logentries: {
        token: null,
        logLevel: 'info'
    },
    logAsJson: false
};

var logLevels = {
    "log":   1,
    "info":  2,
    "warn":  3,
    "error": 4
};

function getFileLogPath (logConfig) {
    "use strict";
    return logConfig.logDir + logConfig.logFile;
}

// We have to remove the console logger otherwise recursion occurs because we're overriding console.* 
// using Konsole (and winston.transports.Console uses console.log)
winston.remove(winston.transports.Console);

// Initialise the logger; merge default and passed config then setup the winston transports
exports.init = function (passedConfig) {
    "use strict";
    // Merge passed configuration with default
    loggerConfig = ftUtils.mergeConfig(loggerConfig, passedConfig);

    // Setup the logging for the console
    setupConsoleLogging(loggerConfig.console, logLevels);
    console.log('Logging configured with:', loggerConfig);

    setupLoggly(loggerConfig.loggly);
    setupFileLogging(loggerConfig.local);
    setupLogentries(loggerConfig.logentries);
};

function setupLoggly (logglyCfg) {
    "use strict";
    // Add the loggly transport
    if (logglyCfg.logglyKey !== null && logglyCfg.logglyDomain !== null) {
        winston.add(require('winston-loggly').Loggly, {
            subdomain: logglyCfg.logglyDomain,
            inputToken: logglyCfg.logglyKey,
            level: logglyCfg.logLevel,
            json: true
        });
        console.info('Loggly enabled');
    } else {
        console.warn('Loggly not enabled');
    }
}

function setupConsoleLogging (consoleCfg, logLevels) {
    "use strict";
    consoleCfg.logLevels = logLevels;
    logModules.consoleWriter.init(consoleCfg);
}

function setupFileLogging (localCfg) {
    "use strict";
    if (localCfg.logDir !== null && localCfg.logFile !== null) {
        // Make the local logDir folder if it does not exist
        fs.exists(localCfg.logDir, function (exists) {
            if (exists === false) {
                fs.mkdirSync(localCfg.logDir);
            }
            console.info('File logging enabled');

            // Add the file transport to winston
            winston.add(winston.transports.File, {
                filename: getFileLogPath(localCfg),
                //colorize: true,
                timestamp: true,
                maxsize: 52428800, //50Mb
                maxFiles: 1,
                level: localCfg.logLevel,
                json: true
            });
        });
    } else {
        console.warn('File logging not enabled');
    }
}

function setupLogentries (logentriesCfg) {
    "use strict";
    var logLevel = logentriesCfg.logLevel || 'warn';
    if (logentriesCfg.token !== null) {
        logE = logentries.logger({
            token: logentriesCfg.token
        });
        logE.winston(winston, {level:logLevel});
        console.info('Logentries enabled');
    } else {
        console.warn('Logentries not enabled');
    }
}

var restoreConsole = require("konsole/overrideConsole");

/////**
//// * Default Listener for Konsole
//// * @param level String Level used for logging. log|info|warn|error
//// * @param args Array Original arguments of the konsole.* call
//// * @scope konsole
//// */
console.on('message', function (level, args) {
    "use strict";
    // Scope within callback is the konsole instance.
    // you have access to the following additional information:
    // this.pid         - process id
    // this.processType - master or worker
    // this.label       - passed label. 'console' in case of automatic overriding console.
    // this.trace       - object containing path, line, char, etc. of the actual call
    // this.diff        - diff in milliseconds to the last call with the same label
    // this.write       - shortcut to process.stdout.write(this.format.apply(this, arguments) + '\n');
    // this.format      - shortcut to util.format

    var logJson,
        logMsg = level.toUpperCase() + ': ' + this.format.apply(this, args),
        trace = this.trace; // trace is a getter, if you do not access the property it will not generate a trace

    logJson = {
        //pid: this.pid,
        //processType: this.processType,
        //path: trace.path,
        //line: trace.line
        level: level,
        data: logMsg
    };

    // If we pass in a JSON object it will not be parsed to a string but instead persisted as JSON for later consumption by systems that understand JSON
    if (loggerConfig.logAsJson === true) {
        if (args.length === 1 && args[0] instanceof Object) {
            logJson.data = args[0];
        }
        winston.log(level, logJson);
        logModules.consoleWriter.log(level, logJson);
    } else {
        winston.log(level, logMsg);
        logModules.consoleWriter.log(level, logMsg);
    }
});

console.on('error', function (err) {
    "use strict";
});