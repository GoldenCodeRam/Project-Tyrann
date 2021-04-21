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
var serverInformation_1 = require("./interfaces/serverInformation");
console.clear();
var app = express_1.default();
app.use(express_1.default.json());
// Id aleatorio del servidor
var _currentServerInformation = {
    serverName: "server_" + process.env.SERVER_PORT,
    serverId: String(Math.round(Math.random() * 100)),
    serverIp: process.env.SERVER_NETWORK_IP,
    serverPort: parseInt(process.env.SERVER_PORT),
};
var _serverHeartbeat;
// Informacion del servidor lider
var leader;
// Estado de la eleccion
var electionStatus = false;
// Informacion de este servidor
var myinfo;
// function startElection(): void {
//   let flag = true;
//   const aux = serverHeartbeat.getListOfNodes();
//   for (let i = 0; i < aux.length; i++) {
//     if (aux[i].serverIp == myinfo.serverIp && aux[i].serverPort == myinfo.serverPort) {
//       serverLogger.error('Something wrong happened!');
//     } else {
//       axios.put(`http://${ip de la red}:${aux[i].serverPort}/electionInCourse`, { electionStatus: true });
//       axios.post(`http://${ip de la red}:${aux[i].serverPort}/election`).then(function (response) {
//         if (response.data == true) {
//           flag = false;
//         }
//         serverLogger.info(`Server ${aux[i].serverIp}:${aux[i].serverPort} is on`);
//       }).catch(function (error) {
//         serverLogger.error(`Server ${aux[i].serverIp}:${aux[i].serverPort} is off`);
//       });
//     }
//   }
//   for (let i = 0; i < aux.length; i++) {
//     if (flag == true) {
//       if (aux[i].serverIp == myinfo.serverIp && aux[i].serverPort == myinfo.serverPort) {
//         serverLogger.error('Something wrong happened!');
//       } else {
//         axios.put(`http://${172.20.0.1}:${aux[i].serverPort}/newLeader`, { newLeader: myinfo });
//         axios.put(`http://${172.20.0.1}:${aux[i].serverPort}/electionInCourse`, { electionStatus: false });
//       }
//       serverLogger.info('I am the new leader');
//     }
//   }
//   serverLogger.info('Election finished');
// }
//Funcion que hace el latido de corazon al servidor lider cada segundo mientras el estado de eleccion sea falso
// function heartBeat(): void {
//   setInterval(() => {
//     if (!electionStatus) {
//       axios.get(`http://${leader.serverIp}:${leader.serverPort}/status`).then(function (response) {
//         serverLogger.info('Leader is on');
//       }).catch(function (error) {
//         startElection();
//         serverLogger.info('Leader is off, starting new election');
//       });
//     }
//   }, 1000);
// }
app.get('/status', function (_, response) {
    logger_1.serverLogger.info('Request to get the status of the server');
    response.sendStatus(200);
});
app.get('/id', function (_, response) {
    logger_1.serverLogger.info('Request to get the ID of the server');
    response.send({ id: _currentServerInformation.serverId });
});
// Peticion que establece la lista de nodos del servidor en caso de ser necesario
app.post('/nodes', function (request) {
    logger_1.serverLogger.info('List of nodes updated successfully');
    //serverHeartbeat.setListOfNodes(req.body);
});
app.put('/newLeader', function (request) {
    var serverInformation = serverInformation_1.instanceOfServerInformation(request.body);
    if (serverInformation) {
        logger_1.serverLogger.info('Server leader updated successfully');
    }
    else {
        logger_1.serverLogger.error("New leader server information malformed! Server information: " + serverInformation);
    }
});
// Peticion para comprobar si el id es mayor o menor
// app.post('/election', (req, res) => {
//   if (req.body.id < id) {
//     startElection();
//     res.json({ data: true });
//   } else {
//     serverLogger.error('Something wrong happened!');
//   }
// });
app.put('/electionInCourse', function (req, res) {
    electionStatus = req.body.electionStatus;
    res.json({ data: 'Election started succesfully' });
});
// Peticion que nos indica si hay o no eleccion de lider en un momento determinado
app.get('/electionStatus', function (_, res) {
    res.json({ data: electionStatus });
    logger_1.serverLogger.info("Request to get the election status, and it is: " + electionStatus);
});
app.listen(Constants_1.SERVER_PORT, function () {
    logger_1.serverLogger.info("Server running on inner port: " + Constants_1.SERVER_PORT);
    logger_1.serverLogger.info('Current server information:');
    console.log(_currentServerInformation);
    // Communicate with the coordinator server as soon it starts
    axios_1.default.get("http://" + Constants_1.COORDINATOR_SERVER_URL + "/connect").then(function (response) {
        logger_1.serverLogger.info('Response got from coordinator server:');
        console.log(response.data.runningServers);
        _serverHeartbeat = new serverHeartbeat_1.default(response.data.runningServers);
    }).catch(function (error) {
        logger_1.serverLogger.error("Could not connect to coordinator server! " + error);
    });
});
