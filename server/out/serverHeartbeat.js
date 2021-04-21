"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./utils/logger");
var ServerHeartbeat = /** @class */ (function () {
    function ServerHeartbeat(neighbours) {
        var _this = this;
        this._listOfNodes = [];
        neighbours.forEach(function (information) {
            if (information.serverPort !== process.env.SERVER_PORT) {
                _this._listOfNodes.push({
                    serverName: information.serverName,
                    serverPort: information.serverPort,
                    serverId: information.serverId,
                    serverIp: process.env.SERVER_NETWORK_IP,
                });
            }
        });
        logger_1.heartbeatLogger.info('Neighbours got from coordinator:');
        console.log(this._listOfNodes);
    }
    return ServerHeartbeat;
}());
exports.default = ServerHeartbeat;
