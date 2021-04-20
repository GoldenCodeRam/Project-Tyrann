"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var network_1 = require("./network");
var logger_1 = require("./utils/logger");
var ServerHeartbeat = /** @class */ (function () {
    function ServerHeartbeat() {
        var _this = this;
        this._listOfNodes = [];
        network_1.getNodes().then(function (neighbours) {
            _this._listOfNodes = neighbours;
            logger_1.heartbeatLogger.info('List of nodes received successfully');
        })
            .catch(function (error) {
            logger_1.heartbeatLogger.error('Could not received the list of nodes successfully');
        });
    }
    ServerHeartbeat.prototype.getListOfNodes = function () {
        return this._listOfNodes;
    };
    ServerHeartbeat.prototype.setListOfNodes = function (listOfNodes) {
        this._listOfNodes = listOfNodes;
    };
    return ServerHeartbeat;
}());
exports.default = ServerHeartbeat;
