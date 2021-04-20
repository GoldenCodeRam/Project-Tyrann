"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var Constants_1 = require("./utils/Constants");
var logger_1 = require("./utils/logger");
console.clear();
var app = express_1.default();
app.use(express_1.default.json());
app.post('/connect', function (request, response) {
    logger_1.serverLogger.info('New server connected to the network!');
    // TODO: Search for the servers and send the response with a list of them.
    response.send({
        data: 'testing',
    });
});
app.listen(Constants_1.COORDINATOR_SERVER_PORT, function () {
    logger_1.serverLogger.info("Coordinator server running at: 127.0.0.1:" + Constants_1.COORDINATOR_SERVER_PORT + ".");
});
