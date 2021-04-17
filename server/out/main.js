"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var serverHeartbeat_1 = __importDefault(require("./serverHeartbeat"));
var logger_1 = require("./utils/logger");
console.clear();
var app = express_1.default();
var port = 8080;
var serverHeartbeat = new serverHeartbeat_1.default();
app.get('/status', function (_, response) {
    response.sendStatus(200);
});
app.listen(port, function () {
    logger_1.serverLogger.info("Server running on inner port: 127.0.0.1:" + port);
});
