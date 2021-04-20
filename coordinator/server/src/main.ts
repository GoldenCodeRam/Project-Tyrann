import express from 'express';

import { COORDINATOR_SERVER_PORT } from './utils/Constants';
import { serverLogger } from './utils/logger';

console.clear();

const app = express();
app.use(express.json());

app.post('/connect', (request, response) => {
  serverLogger.info('New server connected to the network!');
  // TODO: Search for the servers and send the response with a list of them.
  response.send({
    data: 'testing',
  });
});

app.listen(COORDINATOR_SERVER_PORT, () => {
  serverLogger.info(`Coordinator server running at: 127.0.0.1:${COORDINATOR_SERVER_PORT}.`);
});