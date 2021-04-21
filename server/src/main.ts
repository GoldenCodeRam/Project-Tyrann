import express from 'express';
import axios from 'axios';

import ServerHeartbeat from './serverHeartbeat';
import { serverLogger as logger } from './utils/logger';
import { SERVER_PORT, COORDINATOR_SERVER_URL } from './utils/Constants';
import { CoordinatorServerInformation } from './interfaces/serverInformation';

console.clear();

const app = express();
app.use(express.json());

const _serverHeartbeat: ServerHeartbeat = new ServerHeartbeat();

app.get('/status', (_, response) => {
  logger.info('Request to get the status of the server');
  response.sendStatus(200);
});

app.get('/id', (_, response) => {
  logger.info('Request to get the ID of the server');
  response.send({ id: _serverHeartbeat.currentServerId });
});

app.get('/leader', (_, response) => {
  logger.info(`Request to get the current leader of the network, and it is: ${_serverHeartbeat.currentLeaderPort}`);
  if (_serverHeartbeat.currentLeaderPort) {
    response.send({ leader: _serverHeartbeat.currentLeaderPort });
  }
});

// Peticion que nos indica si hay o no eleccion de lider en un momento determinado
app.get('/electionStatus', (_, response) => {
  logger.info(`Request to get the election status, and it is: ${_serverHeartbeat.electionInProgress}`);
  response.send({ electionStatus: _serverHeartbeat.electionInProgress });
});

// Peticion que establece la lista de nodos del servidor en caso de ser necesario
app.post('/nodes', (request, response) => {
  logger.info('Post request to set new list of servers in the network');
  console.log(request.body.runningServers);
  _serverHeartbeat.listOfNodes = request.body.runningServers;
  response.sendStatus(200);
});


app.put('/newLeader', (request) => {
  const leaderPort = request.body.leader;
  if (leaderPort) {
    _serverHeartbeat.leaderPort = leaderPort;
    logger.info(`Server leader updated successfully with ${request.body.leader}`);
  } else {
    logger.error(`New leader server information malformed! Server information: ${request.body}`);
  }
});

app.put('/election', (_, response) => {
  _serverHeartbeat.continueElections();
  response.sendStatus(200);
});

app.put('/electionInCourse', (_, response) => {
  _serverHeartbeat.electionInProgress = true;
  response.sendStatus(200);
});

app.listen(SERVER_PORT, () => {
  logger.info(`Server running on inner port: ${SERVER_PORT}`);

  // Communicate with the coordinator server as soon it starts
  axios.get(`http://${COORDINATOR_SERVER_URL}/connect`).then((response) => {
    logger.info('Response got from coordinator server:');
    console.log(response.data.runningServers);

    _serverHeartbeat.listOfNodes = response.data.runningServers as Array<CoordinatorServerInformation>;
    _serverHeartbeat.startHeartbeat();
  }).catch((error) => {
    logger.error(`Could not connect to coordinator server! ${error}`);
  });
});