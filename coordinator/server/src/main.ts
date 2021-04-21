import express from 'express';

import { COORDINATOR_SERVER_PORT } from './utils/Constants';
import { serverLogger as logger } from './utils/logger';

import { getRunningServers } from './serverManager';

console.clear();

const app = express();
app.use(express.json());

app.get('/connect', async (_, response) => {
  logger.info('New server connected to the network!');
  // TODO: Search for the servers and send the response with a list of them.
  const runningServers = await getRunningServers();
  response.send({
    runningServers: runningServers
  });
});

app.listen(COORDINATOR_SERVER_PORT, () => {
  logger.info(`Coordinator server running in host at: ${COORDINATOR_SERVER_PORT}.`);
});