"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverLogger = void 0;
var winston_1 = require("winston");
var combine = winston_1.format.combine, timestamp = winston_1.format.timestamp, label = winston_1.format.label, printf = winston_1.format.printf;
var myFormat = printf(function (_a) {
    var level = _a.level, message = _a.message, label = _a.label, timestamp = _a.timestamp;
    return "[" + timestamp + " : " + label + "]  " + level + ": " + message;
});
var serverLogger = winston_1.createLogger({
    format: combine(winston_1.format.colorize(), label({ label: "Server 🤖" }), timestamp({
        format: 'hh:mm:ss A',
    }), myFormat),
    transports: [new winston_1.transports.Console()],
});
exports.serverLogger = serverLogger;
