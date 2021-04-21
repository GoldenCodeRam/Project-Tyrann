"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var serverInformation_1 = require("./interfaces/serverInformation");
var logger_1 = require("./utils/logger");
var ServerHeartbeat = /** @class */ (function () {
    function ServerHeartbeat() {
        this._listOfNodes = [];
        this._electionInProgress = false;
        this._heartbeatInterval = Math.round((Math.random() + Math.random() * 10) * 10000);
        this._currentServerInformation = {
            serverName: "server_" + process.env.SERVER_PORT,
            serverId: String(Math.round(Math.random() * 100)),
            serverIp: process.env.SERVER_NETWORK_IP,
            serverPort: parseInt(process.env.SERVER_PORT),
            serverStatus: 'OK',
        };
        logger_1.heartbeatLogger.info('Current server information:');
        console.log(this._currentServerInformation);
    }
    Object.defineProperty(ServerHeartbeat.prototype, "electionInProgress", {
        set: function (status) {
            this._electionInProgress = status;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServerHeartbeat.prototype, "listOfNodes", {
        set: function (nodes) {
            var _this = this;
            this._listOfNodes = [];
            nodes.forEach(function (information) {
                var serverInformation = serverInformation_1.toServerInformation(information);
                if (serverInformation.serverPort != _this._currentServerInformation.serverPort) {
                    _this._listOfNodes.push(serverInformation);
                }
            });
            logger_1.heartbeatLogger.info('Neighbours got from coordinator:');
            console.log(this._listOfNodes);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServerHeartbeat.prototype, "leaderPort", {
        set: function (port) {
            for (var _i = 0, _a = this._listOfNodes; _i < _a.length; _i++) {
                var node = _a[_i];
                if (port == node.serverPort) {
                    this._currentLeader = node;
                    break;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServerHeartbeat.prototype, "currentLeaderPort", {
        get: function () {
            var _a;
            return (_a = this._currentLeader) === null || _a === void 0 ? void 0 : _a.serverPort;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServerHeartbeat.prototype, "currentServerId", {
        get: function () {
            return parseInt(this._currentServerInformation.serverId);
        },
        enumerable: false,
        configurable: true
    });
    ServerHeartbeat.prototype.startHeartbeat = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.heartbeatLogger.info('Starting heartbeat');
                        if (!(this._listOfNodes.length == 0)) return [3 /*break*/, 1];
                        logger_1.heartbeatLogger.info('This server is the only server in the network, so it is the leader.');
                        this._currentLeader = this._currentServerInformation;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCurrentNetworkLeader()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        logger_1.heartbeatLogger.info("Heartbeat interval: " + this._heartbeatInterval);
                        if (!this._electionInProgress) {
                            setInterval(function () { _this.doHeartbeat(); }, this._heartbeatInterval);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerHeartbeat.prototype.continueElections = function () {
        return __awaiter(this, void 0, void 0, function () {
            var availableLeaderServers, _loop_1, this_1, _i, _a, node;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        logger_1.heartbeatLogger.info('Continuing elections');
                        availableLeaderServers = false;
                        _loop_1 = function (node) {
                            var response;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (!(node.serverId > this_1._currentServerInformation.serverId)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, axios_1.default.put("http://" + node.serverIp + ":" + node.serverPort + "/election").catch(function () {
                                                logger_1.heartbeatLogger.error("Error sending the notification of election to server on port " + node.serverPort);
                                            })];
                                    case 1:
                                        response = _c.sent();
                                        if (response) {
                                            console.log("Notification of election send to server on port " + node.serverPort);
                                            availableLeaderServers = true;
                                        }
                                        _c.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = this._listOfNodes;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        node = _a[_i];
                        return [5 /*yield**/, _loop_1(node)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (!availableLeaderServers) {
                            logger_1.heartbeatLogger.info('This server is the only server available in the network, so it is the leader.');
                            this.notifyNewLeader();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerHeartbeat.prototype.getCurrentNetworkLeader = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var leaderPort, _i, _b, node, response, _c, _d, node;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        logger_1.heartbeatLogger.info('Getting the current leader of this network');
                        leaderPort = 0;
                        _i = 0, _b = this._listOfNodes;
                        _e.label = 1;
                    case 1:
                        if (!(_i < _b.length)) return [3 /*break*/, 4];
                        node = _b[_i];
                        return [4 /*yield*/, axios_1.default.get("http://" + node.serverIp + ":" + node.serverPort + "/leader").catch(function () {
                                logger_1.heartbeatLogger.error('Error getting the current leader of the network');
                            })];
                    case 2:
                        response = _e.sent();
                        if (response) {
                            leaderPort = response.data.leader;
                            return [3 /*break*/, 4];
                        }
                        _e.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        for (_c = 0, _d = this._listOfNodes; _c < _d.length; _c++) {
                            node = _d[_c];
                            if (node.serverPort == leaderPort) {
                                this._currentLeader = node;
                                break;
                            }
                        }
                        logger_1.heartbeatLogger.info("The current leader of the network is on the port " + ((_a = this._currentLeader) === null || _a === void 0 ? void 0 : _a.serverPort));
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerHeartbeat.prototype.doHeartbeat = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._currentLeader) return [3 /*break*/, 3];
                        if (!(this._currentServerInformation.serverPort !== this._currentLeader.serverPort)) return [3 /*break*/, 2];
                        logger_1.heartbeatLogger.info('Making heartbeat to leader');
                        return [4 /*yield*/, axios_1.default.get("http://" + this._currentLeader.serverIp + ":" + this._currentLeader.serverPort + "/status").catch(function () {
                                logger_1.heartbeatLogger.error('Error making the heartbeat to the leader! Should make new election');
                            })];
                    case 1:
                        response = _a.sent();
                        if (response && response.status == 200) {
                            logger_1.heartbeatLogger.info('Leader is 👌');
                        }
                        else {
                            logger_1.heartbeatLogger.warn('Leader did not answer correctly. Starting new election');
                            this.startElections();
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        logger_1.heartbeatLogger.info('This server is the leader');
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ServerHeartbeat.prototype.startElections = function () {
        return __awaiter(this, void 0, void 0, function () {
            var availableLeaderServers, _loop_2, _i, _a, node, _loop_3, this_2, _b, _c, node;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this._electionInProgress = true;
                        logger_1.heartbeatLogger.info('Starting new elections');
                        availableLeaderServers = false;
                        // Notify all servers an election is being made
                        console.log(this._listOfNodes);
                        _loop_2 = function (node) {
                            var response;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, axios_1.default.put("http://" + node.serverIp + ":" + node.serverPort + "/electionInCourse").catch(function () {
                                            logger_1.heartbeatLogger.error("Error sending the notification of new election to server on port " + node.serverPort);
                                        })];
                                    case 1:
                                        response = _e.sent();
                                        if (response) {
                                            console.log("Notification of new election send to server on port " + node.serverPort);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, _a = this._listOfNodes;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        node = _a[_i];
                        return [5 /*yield**/, _loop_2(node)];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        _loop_3 = function (node) {
                            var response;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        if (!(node.serverId > this_2._currentServerInformation.serverId)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, axios_1.default.put("http://" + node.serverIp + ":" + node.serverPort + "/election").catch(function () {
                                                logger_1.heartbeatLogger.error("Error sending the notification of election to server on port " + node.serverPort);
                                            })];
                                    case 1:
                                        response = _f.sent();
                                        if (response) {
                                            console.log("Notification of election send to server on port " + node.serverPort);
                                            availableLeaderServers = true;
                                        }
                                        _f.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        _b = 0, _c = this._listOfNodes;
                        _d.label = 5;
                    case 5:
                        if (!(_b < _c.length)) return [3 /*break*/, 8];
                        node = _c[_b];
                        return [5 /*yield**/, _loop_3(node)];
                    case 6:
                        _d.sent();
                        _d.label = 7;
                    case 7:
                        _b++;
                        return [3 /*break*/, 5];
                    case 8:
                        if (!availableLeaderServers) {
                            logger_1.heartbeatLogger.info('This server is the only server available in the network, so it is the leader.');
                            this._currentLeader = this._currentServerInformation;
                            this.notifyNewLeader();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerHeartbeat.prototype.notifyNewLeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_4, this_3, _i, _a, node;
            return __generator(this, function (_b) {
                logger_1.heartbeatLogger.info('Notifying all servers that this server is the new leader');
                _loop_4 = function (node) {
                    var response = axios_1.default.put("http://" + node.serverIp + ":" + node.serverPort + "/newLeader", { leader: this_3._currentServerInformation.serverPort }).catch(function () {
                        logger_1.heartbeatLogger.error("Error sending the notification of new election to server on port " + node.serverPort);
                    });
                    if (response) {
                        console.log("Notification of new election send to server on port " + node.serverPort);
                    }
                };
                this_3 = this;
                for (_i = 0, _a = this._listOfNodes; _i < _a.length; _i++) {
                    node = _a[_i];
                    _loop_4(node);
                }
                return [2 /*return*/];
            });
        });
    };
    return ServerHeartbeat;
}());
exports.default = ServerHeartbeat;
