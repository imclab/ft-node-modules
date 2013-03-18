var winston     = require("winston"),
    Konsole     = require("konsole"),
    fs          = require('fs'),
    logentries  = require('node-logentries'),
    ftUtils     = require("./lib/utils.js"),
    logE;

// Configuration options for the logger module
var loggerConfig = {
    local: {
        logDir: null,
        logFile: null,
        logLevel: 'warn'
    },
    loggly: {
        logglyKey: null,
        logglyDomain: null,
        logLevel: 'warn'
    },
    splunk: {
        splunkHostname: null,
        logLevel: 'warn'
    },
    logentries: {
        token: null,
        logLevel: 'warn'
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
        console.info('Loggly not enabled');
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
        console.info('Local logging not enabled');
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
        console.info('Logentries not enabled');
    }
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

    var trace = this.trace; // trace is a getter, if you do not access the property it will not generate a trace
    var msg = this.format.apply(this, args);
    this.write(msg);

    winston.log(level, {
        msg: msg,
        pid: this.pid,
        processType: this.processType,
        label: this.label,
        path: trace.path,
        line: trace.line
    });
});

console.on('error', function (args) {
    // need to handle this otherwise Error: Uncaught, unspecified 'error' event.
});