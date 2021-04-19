"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var serverHeartbeat_1 = __importDefault(require("./serverHeartbeat"));
var logger_1 = require("./utils/logger");
var axios_1 = __importDefault(require("axios"));
console.clear();
var app = express_1.default();
var port = 8080;
// Direccion del servidor coordinador
var COORDINATOR_SERVER_URL = "127.0.0.1:8080";
// Id aleatorio del servidor
var id = Math.round(Math.random() * 100);
// Informacion del servidor lider
var leader;
// Estado de la eleccion
var electionStatus = false;
// Informacion de este servidor
var myinfo;
var serverHeartbeat;
// Funcion que comienza la eleccion
function startElection() {
    var flag = true;
    var aux = serverHeartbeat.getListOfNodes();
    var _loop_1 = function (i) {
        if (aux[i].serverIp == myinfo.serverIp && aux[i].serverPort == myinfo.serverPort) {
        }
        else {
            axios_1.default.put("http://" + aux[i].serverIp + ":" + aux[i].serverPort + "/electionInCourse", { electionStatus: true });
            axios_1.default.post("http://" + aux[i].serverIp + ":" + aux[i].serverPort + "/election")
                .then(function (response) {
                if (response.data == true) {
                    flag = false;
                }
                logger_1.serverLogger.info("Server " + aux[i].serverIp + ":" + aux[i].serverPort + " is on");
            })
                .catch(function (error) {
                logger_1.serverLogger.error("Server " + aux[i].serverIp + ":" + aux[i].serverPort + " is off");
            });
        }
    };
    for (var i = 0; i < aux.length; i++) {
        _loop_1(i);
    }
    for (var i = 0; i < aux.length; i++) {
        if (flag == true) {
            if (aux[i].serverIp == myinfo.serverIp && aux[i].serverPort == myinfo.serverPort) {
            }
            else {
                axios_1.default.put("http://" + aux[i].serverIp + ":" + aux[i].serverPort + "/newLeader", { newLeader: myinfo });
                axios_1.default.put("http://" + aux[i].serverIp + ":" + aux[i].serverPort + "/electionInCourse", { electionStatus: false });
            }
            logger_1.serverLogger.info("I am the new leader");
        }
    }
    logger_1.serverLogger.info("Election finished");
}
//Funcion que hace el latido de corazon al servidor lider cada segundo mientras el estado de eleccion sea falso
function heartBeat() {
    setInterval(function () {
        if (!electionStatus) {
            axios_1.default.get("http://" + leader.serverIp + ":" + leader.serverPort + "/status")
                .then(function (response) {
                logger_1.serverLogger.info("Leader is on");
            })
                .catch(function (error) {
                startElection();
                logger_1.serverLogger.info("Leader is off, starting new election");
            });
        }
    }, 1000);
}
// Peticion que devuelve el estado del servidor
app.get('/status', function (req, res) {
    res.sendStatus(200);
});
// Peticion que establece la lista de nodos del servidor en caso de ser necesario
app.post('/nodes', function (req, res) {
    serverHeartbeat.setListOfNode(req.body);
    logger_1.serverLogger.info('List of nodes updated successfully');
});
// Peticion que establece un nuevo lider
app.put('/newLeader', function (req, res) {
    leader = req.body;
    logger_1.serverLogger.info('Leader Node updated successfully');
});
// Peticion para comprobar si el id es mayor o menor
app.post('/election', function (req, res) {
    if (req.body.id < id) {
        startElection();
        res.json({ data: true });
    }
    else {
    }
});
// Peticion que establece que una eleccion de lider esta en curso
app.put('/electionInCourse', function (req, res) {
    electionStatus = req.body.electionStatus;
    res.json({ data: 'Election started succesfully' });
});
// Peticion que nos indica si hay o no eleccion de lider en un momento determinado
app.get('/electionStatus', function (req, res) {
    logger_1.serverLogger.info('Election Status is ' + electionStatus);
    res.json({ data: electionStatus });
});
app.listen(port, function () {
    logger_1.serverLogger.info("Server running on inner port: 127.0.0.1:" + port);
    // Se comunica con el servidor inmediatamente 
    axios_1.default.post("http://" + COORDINATOR_SERVER_URL + "/connect", {
        port: port,
    })
        .then(function (response) {
        leader = response.data.leader;
        myinfo = response.data.info;
        serverHeartbeat = new serverHeartbeat_1.default();
        heartBeat();
        logger_1.serverLogger.error('Connection established with server coordinator');
    })
        .catch(function (error) {
        logger_1.serverLogger.error('Could not connect to server coordinator');
    });
});
