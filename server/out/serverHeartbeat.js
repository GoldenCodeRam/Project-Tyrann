"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var network_1 = require("./network");
var ServerHeartbeat = /** @class */ (function () {
    function ServerHeartbeat() {
        var _this = this;
        this._listOfNeighbours = [];
        network_1.getNeighbours().then(function (neighbours) {
            _this._listOfNeighbours = neighbours;
        });
    }
    return ServerHeartbeat;
}());
exports.default = ServerHeartbeat;
