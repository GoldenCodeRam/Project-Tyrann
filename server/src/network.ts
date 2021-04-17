import util from 'util';
import { exec } from 'child_process';
import axios from 'axios';

import { networkLogger } from './utils/logger';
import { ServerInformation } from './interfaces/serverInformation';

const COORDINATOR_SERVER_URL = "127.0.0.1:8080";
const execPromise = util.promisify(exec);

async function getNeighbours(): Promise<Array<ServerInformation>> {
  networkLogger.info('Getting the neighbours of this node.');
  networkLogger.info('Making request for neighbours to the coordinator server...');
  return [];
}

export {
  getNeighbours,
}