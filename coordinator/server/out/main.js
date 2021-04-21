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
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
var Constants_1 = require("./utils/Constants");
var logger_1 = require("./utils/logger");
var serverManager_1 = require("./serverManager");
console.clear();
var app = express_1.default();
app.use(express_1.default.json());
app.get('/connect', function (_, response) { return __awaiter(void 0, void 0, void 0, function () {
    var runningServers, _loop_1, _i, runningServers_1, server;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger_1.serverLogger.info('New server connected to the network!');
                return [4 /*yield*/, serverManager_1.getRunningServers()];
            case 1:
                runningServers = _a.sent();
                response.send({
                    runningServers: runningServers
                });
                logger_1.serverLogger.info('Sending the new server list to the network');
                _loop_1 = function (server) {
                    var response_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, axios_1.default.post("http://127.0.0.1:" + server.serverPort + "/nodes", { runningServers: runningServers }).catch(function () {
                                    logger_1.serverLogger.error("Error sending the new server list to the server on port " + server.serverPort);
                                })];
                            case 1:
                                response_1 = _b.sent();
                                if (response_1) {
                                    console.log("New server list sent to server in port " + server.serverPort);
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, runningServers_1 = runningServers;
                _a.label = 2;
            case 2:
                if (!(_i < runningServers_1.length)) return [3 /*break*/, 5];
                server = runningServers_1[_i];
                return [5 /*yield**/, _loop_1(server)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.listen(Constants_1.COORDINATOR_SERVER_PORT, function () {
    logger_1.serverLogger.info("Coordinator server running in host at: " + Constants_1.COORDINATOR_SERVER_PORT + ".");
});
