var winston     = require("winston"),
    Konsole     = require("konsole"),
    fs          = require('fs'),
    logentries  = require('node-logentries'),
    ftUtils     = require("./lib/utils.js"),
    logE;

// Configuration options for the logger module
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
    splunk: {
        splunkHostname: null,
        logLevel: 'info'
    },
    logentries: {
        token: null,
        logLevel: 'info'
    }
};

function getFileLogPath () {
    "use strict";
    return loggerConfig.local.logDir + loggerConfig.local.logFile;
}

// The initialise the logger; merge default and passed config then setup the winston transports
exports.init = function (passedConfig) {
    "use strict";
    loggerConfig = ftUtils.mergeConfig(loggerConfig, passedConfig);
    console.log('Logging configured with:', loggerConfig);
    setupLoggly(loggerConfig.loggly);
    setupLocalLogging(loggerConfig.local);
    setupSplunk();
    setupLogentries(loggerConfig.logentries);
};

// We have to remove the console logger otherwise recursion occurs because we're overriding console.* using Konsole (and winston.transports.Console uses console.log)
winston.remove(winston.transports.Console);

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

function setupSplunk (splunkCfg) {
    "use strict";
        // Add the loggly transport
    // if (splunkCfg.logglyKey !== null && splunkCfg.logglyDomain !== null) {
    //     console.info('Loggly enabled');
    //     var logLevel = logglyCfg.logLevel || 'warn';

    //     winston.add(require('winston-splunk').splunk, {
    //         splunkHostname: "node-server"
    //     });
    // } else {
    //     console.info('Splunk logging not enabled');
    // }
}

function setupLocalLogging (localCfg) {
    "use strict";
    if (localCfg.logDir !== null && localCfg.logFile !== null) {
        // Make the local logDir folder if it does not exist
        fs.exists(localCfg.logDir, function (exists) {
            if (exists === false) {
                fs.mkdirSync(localCfg.logDir);
            }
            console.info('Local logging enabled');

            // Add the file transport to winston
            winston.add(winston.transports.File, {
                filename: getFileLogPath(),
                //colorize: true,
                timestamp: true,
                maxsize: 52428800, //50Mb
                maxFiles: 1,
                level: localCfg.logLevel,
                json: true
            });
        });
    } else {
        console.warn('Local logging not enabled');
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


function getConsoleOut (level, msg, config) {
    var logLevel = config.logLevel,
        response = false;

    if (logLevel === 'log') {
        response = level.toUpperCase() + ':' + msg;
    } else if (logLevel === 'info' && level !== 'log') {
        response = level.toUpperCase() + ':' + msg;
    } else if (logLevel === 'warn' && (level === 'warn' || level === 'error')) {
        response = level.toUpperCase() + ':' + msg;
    } else if (logLevel === 'error' && level === 'error') {
        response = level.toUpperCase() + ':' + msg;
    }
    return response;
}

var restoreConsole = require("konsole/overrideConsole");
////
/////**
//// * Default Listener for Konsole
//// * @param level String Level used for logging. log|info|warn|error
//// * @param args Array Original arguments of the konsole.* call
//// * @scope konsole
//// */
console.on('message', function (level, args) {
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
        msg = this.format.apply(this, args),
        consoleOut = getConsoleOut(level, msg, loggerConfig.console),
        trace = this.trace; // trace is a getter, if you do not access the property it will not generate a trace


    logJson = {
        pid: this.pid,
        processType: this.processType,
        path: trace.path,
        line: trace.line
    };

    // If we pass in a JSON object it will not be parsed to a string but instead persisted as JSON for later consumption in the logs
    if (args.length === 1 && args[0] instanceof Object) {
        logJson.data = args[0];
    } else {
        logJson.data = msg;
    }

    // Output the data to stdout
    if (consoleOut !== false) {
        this.write(consoleOut);
    }

    // Log the data using all registered transports
    winston.log(level, logJson);
});

console.on('error', function (args) {
    // need to handle this otherwise Error: Uncaught, unspecified 'error' event.
});