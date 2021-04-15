import util from 'util';
import { exec } from 'child_process';
import axios from 'axios';

import { networkLogger } from './utils/logger';

import { ServerInformation } from './interfaces/serverInformation';

const execPromise = util.promisify(exec);

async function getNeighbours(): Promise<Array<ServerInformation>> {
  networkLogger.info('Getting the neighbours of this node.')

  const neighbours: Array<ServerInformation> = [];
  const {stderr, stdout} = await execPromise('bash ./src/scripts/getNeighbours.sh');
  // TODO: Parse the information from the getNeighbours.sh file, maybe format the output of the script to a JSON.
  networkLogger.info(`The found neighbours are: ${neighbours}`);
  return neighbours;
}

export {
  getNeighbours,
}