import express from 'express';
import axios from 'axios';

import { COORDINATOR_SERVER_PORT } from './utils/Constants';
import { serverLogger as logger } from './utils/logger';

import { getRunningServers } from './serverManager';

console.clear();

const app = express();
app.use(express.json());

app.get('/connect', async (_, response) => {
  logger.info('New server connected to the network!');
  const runningServers = await getRunningServers();
  response.send({
    runningServers: runningServers
  });
  
  logger.info('Sending the new server list to the network');
  for (const server of runningServers) {
    const response = await axios.post(
      `http://127.0.0.1:${server.serverPort}/nodes`,
      { runningServers: runningServers }
    ).catch(() => {
      logger.error(`Error sending the new server list to the server on port ${server.serverPort}`);
    });
    if (response) {
      console.log(`New server list sent to server in port ${server.serverPort}`);
    }
  }
});

app.listen(COORDINATOR_SERVER_PORT, () => {
  logger.info(`Coordinator server running in host at: ${COORDINATOR_SERVER_PORT}.`);
});