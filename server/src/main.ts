import express from 'express';

import ServerHeartbeat from './serverHeartbeat';
import { serverLogger } from './utils/logger';

console.clear();

const app = express();
const port = 8080;

const serverHeartbeat = new ServerHeartbeat();

app.get('/status', (_, response) => {
  response.sendStatus(200);
})

app.listen(port, () => {
  serverLogger.info(`Server running on inner port: 127.0.0.1:${port}`);
});