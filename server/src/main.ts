import express from 'express';
import axios from 'axios';

import ServerHeartbeat from './serverHeartbeat';
import { serverLogger as logger } from './utils/logger';
import { SERVER_PORT, COORDINATOR_SERVER_URL } from './utils/Constants';
import { instanceOfServerInformation, ServerInformation } from './interfaces/serverInformation';

console.clear();

const app = express();
app.use(express.json());

// Id aleatorio del servidor
const _currentServerInformation: ServerInformation = {
  serverName: `server_${process.env.SERVER_PORT}`,
  serverId: String(Math.round(Math.random() * 100)),
  serverIp: process.env.SERVER_NETWORK_IP as string,
  serverPort: parseInt(process.env.SERVER_PORT as string),
};
let _serverHeartbeat: ServerHeartbeat;

// Informacion del servidor lider
let leader: ServerInformation;
// Estado de la eleccion
let electionStatus = false;
// Informacion de este servidor
let myinfo: ServerInformation;

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

app.get('/status', (_, response) => {
  logger.info('Request to get the status of the server');
  response.sendStatus(200);
});

app.get('/id', (_, response) => {
  logger.info('Request to get the ID of the server');
  response.send({ id: _currentServerInformation.serverId });
});

// Peticion que establece la lista de nodos del servidor en caso de ser necesario
app.post('/nodes', (request) => {
  logger.info('List of nodes updated successfully');
  //serverHeartbeat.setListOfNodes(req.body);
});

app.put('/newLeader', (request) => {
  const serverInformation = instanceOfServerInformation(request.body);
  if (serverInformation) {
    logger.info('Server leader updated successfully');
  } else {
    logger.error(`New leader server information malformed! Server information: ${serverInformation}`);
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

app.put('/electionInCourse', (req, res) => {
  electionStatus = req.body.electionStatus;
  res.json({ data: 'Election started succesfully' });
});

// Peticion que nos indica si hay o no eleccion de lider en un momento determinado
app.get('/electionStatus', (_, res) => {
  res.json({ data: electionStatus });
  logger.info(`Request to get the election status, and it is: ${electionStatus}`);
});

app.listen(SERVER_PORT, () => {
  logger.info(`Server running on inner port: ${SERVER_PORT}`);
  logger.info('Current server information:');
  console.log(_currentServerInformation);

  // Communicate with the coordinator server as soon it starts
  axios.get(`http://${COORDINATOR_SERVER_URL}/connect`).then((response) => {
    logger.info('Response got from coordinator server:');
    console.log(response.data.runningServers);

    _serverHeartbeat = new ServerHeartbeat(response.data.runningServers);
  }).catch((error) => {
    logger.error(`Could not connect to coordinator server! ${error}`);
  });
});