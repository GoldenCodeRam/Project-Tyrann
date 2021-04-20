import express from 'express';
import axios from 'axios';

import ServerHeartbeat from './serverHeartbeat';
import { serverLogger } from './utils/logger';
import { SERVER_PORT, COORDINATOR_SERVER_URL } from './utils/Constants';
import { checkServerInformation, ServerInformation } from './interfaces/serverInformation';

console.clear();

const app = express();
app.use(express.json());

// Id aleatorio del servidor
const currentServerInformation: ServerInformation = {
  serverId: Math.round(Math.random() * 100),
  serverIp: 'localhost',
  serverPort: process.env.SERVER_PORT as string,
};

const id = Math.round(Math.random() * 100);

// Informacion del servidor lider
let leader: ServerInformation;
// Estado de la eleccion
let electionStatus = false;
// Informacion de este servidor
let myinfo: ServerInformation;

let serverHeartbeat: ServerHeartbeat;

function startElection(): void {
  let flag = true;
  const aux = serverHeartbeat.getListOfNodes();
  for (let i = 0; i < aux.length; i++) {
    if (aux[i].serverIp == myinfo.serverIp && aux[i].serverPort == myinfo.serverPort) {
      serverLogger.error('Something wrong happened!');
    } else {
      axios.put(`http://${aux[i].serverIp}:${aux[i].serverPort}/electionInCourse`, { electionStatus: true });
      axios.post(`http://${aux[i].serverIp}:${aux[i].serverPort}/election`).then(function (response) {
        if (response.data == true) {
          flag = false;
        }
        serverLogger.info(`Server ${aux[i].serverIp}:${aux[i].serverPort} is on`);
      }).catch(function (error) {
        serverLogger.error(`Server ${aux[i].serverIp}:${aux[i].serverPort} is off`);
      });
    }
  }
  for (let i = 0; i < aux.length; i++) {
    if (flag == true) {
      if (aux[i].serverIp == myinfo.serverIp && aux[i].serverPort == myinfo.serverPort) {
        serverLogger.error('Something wrong happened!');
      } else {
        axios.put(`http://${aux[i].serverIp}:${aux[i].serverPort}/newLeader`, { newLeader: myinfo });
        axios.put(`http://${aux[i].serverIp}:${aux[i].serverPort}/electionInCourse`, { electionStatus: false });
      }
      serverLogger.info('I am the new leader');
    }
  }
  serverLogger.info('Election finished');
}

//Funcion que hace el latido de corazon al servidor lider cada segundo mientras el estado de eleccion sea falso
function heartBeat(): void {
  setInterval(() => {
    if (!electionStatus) {
      axios.get(`http://${leader.serverIp}:${leader.serverPort}/status`).then(function (response) {
        serverLogger.info('Leader is on');
      }).catch(function (error) {
        startElection();
        serverLogger.info('Leader is off, starting new election');
      });
    }
  }, 1000);
}

app.get('/status', (_, res) => {
  res.sendStatus(200);
});

// Peticion que establece la lista de nodos del servidor en caso de ser necesario
app.post('/nodes', (req) => {
  serverHeartbeat.setListOfNodes(req.body);
  serverLogger.info('List of nodes updated successfully');
});

app.put('/newLeader', (request) => {
  const serverInformation = checkServerInformation(request.body);
  if (serverInformation) {
    leader = serverInformation;
    serverLogger.info('Server leader updated successfully');
  } else {
    serverLogger.error(`New leader server information malformed! Server information: ${serverInformation}`);
  }
});

// Peticion para comprobar si el id es mayor o menor
app.post('/election', (req, res) => {
  if (req.body.id < id) {
    startElection();
    res.json({ data: true });
  } else {
    serverLogger.error('Something wrong happened!');
  }
});

app.put('/electionInCourse', (req, res) => {
  electionStatus = req.body.electionStatus;
  res.json({ data: 'Election started succesfully' });
});

// Peticion que nos indica si hay o no eleccion de lider en un momento determinado
app.get('/electionStatus', (_, res) => {
  res.json({ data: electionStatus });
  serverLogger.info(`Request to get the election status, and it is: ${electionStatus}`);
});

app.listen(SERVER_PORT, () => {
  serverLogger.info(`Server running on inner port: 127.0.0.1:${SERVER_PORT}`);
  // Se comunica con el servidor inmediatamente 
  axios.post(`http://${COORDINATOR_SERVER_URL}/connect`).then((response) => {
    serverLogger.info(`Response got from coordinator server: ${response.data.data}`);
    leader = response.data.leader;
    myinfo = response.data.info;
    serverHeartbeat = new ServerHeartbeat();
    heartBeat();
    serverLogger.error('Connection established with server coordinator');
  }).catch((error) => {
    serverLogger.error(`Could not connect to server coordinator: ${error}`);
  });
});