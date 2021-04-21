"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
var serverHeartbeat_1 = __importDefault(require("./serverHeartbeat"));
var logger_1 = require("./utils/logger");
var Constants_1 = require("./utils/Constants");
console.clear();
var app = express_1.default();
app.use(express_1.default.json());
var _serverHeartbeat = new serverHeartbeat_1.default();
app.get('/status', function (_, response) {
    logger_1.serverLogger.info('Request to get the status of the server');
    response.sendStatus(200);
});
app.get('/id', function (_, response) {
    logger_1.serverLogger.info('Request to get the ID of the server');
    response.send({ id: _serverHeartbeat.currentServerId });
});
app.get('/leader', function (_, response) {
    logger_1.serverLogger.info("Request to get the current leader of the network, and it is: " + _serverHeartbeat.currentLeaderPort);
    if (_serverHeartbeat.currentLeaderPort) {
        response.send({ leader: _serverHeartbeat.currentLeaderPort });
    }
});
// Peticion que nos indica si hay o no eleccion de lider en un momento determinado
app.get('/electionStatus', function (_, response) {
    logger_1.serverLogger.info("Request to get the election status, and it is: " + _serverHeartbeat.electionInProgress);
    response.send({ electionStatus: _serverHeartbeat.electionInProgress });
});
// Peticion que establece la lista de nodos del servidor en caso de ser necesario
app.post('/nodes', function (request, response) {
    logger_1.serverLogger.info('Post request to set new list of servers in the network');
    console.log(request.body.runningServers);
    _serverHeartbeat.listOfNodes = request.body.runningServers;
    response.sendStatus(200);
});
app.put('/newLeader', function (request) {
    var leaderPort = request.body.leader;
    if (leaderPort) {
        _serverHeartbeat.leaderPort = leaderPort;
        logger_1.serverLogger.info("Server leader updated successfully with " + request.body.leader);
    }
    else {
        logger_1.serverLogger.error("New leader server information malformed! Server information: " + request.body);
    }
});
app.put('/election', function (_, response) {
    _serverHeartbeat.continueElections();
    response.sendStatus(200);
});
app.put('/electionInCourse', function (_, response) {
    _serverHeartbeat.electionInProgress = true;
    response.sendStatus(200);
});
app.listen(Constants_1.SERVER_PORT, function () {
    logger_1.serverLogger.info("Server running on inner port: " + Constants_1.SERVER_PORT);
    // Communicate with the coordinator server as soon it starts
    axios_1.default.get("http://" + Constants_1.COORDINATOR_SERVER_URL + "/connect").then(function (response) {
        logger_1.serverLogger.info('Response got from coordinator server:');
        console.log(response.data.runningServers);
        _serverHeartbeat.listOfNodes = response.data.runningServers;
        _serverHeartbeat.startHeartbeat();
    }).catch(function (error) {
        logger_1.serverLogger.error("Could not connect to coordinator server! " + error);
    });
});
