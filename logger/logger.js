var winston = require("winston"),
    Konsole = require("konsole");

//winston.add(require('winston-loggly').Loggly, options);
//winston.add(require('winston-splunk').splunk, options);

//var logentries = require("node-logentries");
//var log = logentries.logger({
//
//});
//// use as a winston transport
//log.winston( winston, {level:"info"} );

// have to remove the console logger otherwise recursion occurs because we're overriding console.* using Konsole (and winston.transports.Console uses console.log)
winston.remove(winston.transports.Console);

winston.add(winston.transports.File, {
    filename: "logs/console.log",
    //colorize: true,
    timestamp: true,
    maxsize: 52428800, //50Mb
    maxFiles: 1,
    json: true
});

// winston.add(winston.transports.Loggly, {
//     subdomain: "financialtimes",
//     inputToken: "98cf7d67-90bf-4a93-839c-cff4c33bf568",
//     json: true
// });

// winston.add(winston.transports.splunk, {
//         splunkHostname: "node-server"
//         //,splunkPort:""
// });


//winston.loggers.options.transports = [
//    // Setup your shared transports here
//    new winston.transports.Console({
//        level: "info",
//        colorize: true,
//        timestamp: true
//    }),
//
//    new winston.transports.File({
//        filename: Env.path.LOGS_DIR + "console.log",
//        //colorize: true,
//        timestamp: true,
//        maxsize: 52428800, //50Mb
//        maxFiles: 1,
//        json: true
//    }),
//
//    new winston.transports.Loggly({
//        subdomain: "financialtimes",
//        inputToken: "98cf7d67-90bf-4a93-839c-cff4c33bf568",
//        json: true
//    })
//
//// http://blogs.splunk.com/2012/09/28/meet-your-splunk-hackathon-winners-splunk-for-winston
//// https://github.com/erichelgeson/winston-splunk
//
////    new winston.transports.splunk({
////        splunkHostname: "node-server"
////        //,splunkPort:""
////
////    })
//];

//var logger = new (winston.Logger)({
//    transports: [
////        new winston.transports.Console({
////            level: "info",
////            colorize: true,
////            timestamp: true
////        }),
//
//        new winston.transports.File({
//            filename: Env.path.LOGS_DIR + "console.log",
//            //colorize: true,
//            timestamp: true,
//            maxsize: 52428800, //50Mb
//            maxFiles: 1,
//            json: true
//        }),
//
//        new winston.transports.Loggly({
//            subdomain: "financialtimes",
//            inputToken: "98cf7d67-90bf-4a93-839c-cff4c33bf568",
//            json: true
//        }),
//
//// http://blogs.splunk.com/2012/09/28/meet-your-splunk-hackathon-winners-splunk-for-winston
//// https://github.com/erichelgeson/winston-splunk
//
//        new winston.transports.splunk({
//            splunkHostname: "node-server"
//            //,splunkPort:""
//
//        })
//
//    ]
////    ,
////    exceptionHandlers: [
////        new winston.transports.File({ filename: Env.path.LOGS_DIR + "exceptions.log" })
////    ]
//});
//
//exports.logger = logger;


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

    this.write(this.format.apply(this, args));

    winston.log(level, this.format.apply(this, args), {
        pid: this.pid,
        processType: this.procesType,
        label: this.label,
        path: trace.path,
        line: trace.line
    });
});
//
console.on('error', function (args) {
    // need to handle this otherwise Error: Uncaught, unspecified 'error' event.
});
//console.on('log', function ( args) {
//
//});

var value = {obj: "two"};
console.log("LOG SAMPLE");
console.info("INFO SAMPLE  %s", value.obj);
console.error("ERROR SAMPLE");
//winston.info("HELLO")

