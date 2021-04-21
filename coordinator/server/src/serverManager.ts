import util from 'util';
import exec from 'child_process';

import { ServerInformation } from './interfaces/serverInformation';
import { serverManagerLogger as logger } from './utils/logger';

const _execPromise = util.promisify(exec.exec);

async function getRunningServers(): Promise<Array<ServerInformation>> {
  logger.info('Getting running servers from Docker.');
  const runningServers = new Array<ServerInformation>();
  const { stdout } = await _execPromise('bash ./src/scripts/getRunningServers.sh');
  const runningServersInformation = JSON.parse(stdout);
  runningServersInformation.forEach((information: ServerInformation) => {
    runningServers.push({
      serverName: information.serverName,
      serverPort: information.serverPort,
      serverStatus: information.serverStatus,
      serverId: information.serverId,
    });
  });
  return runningServers;
}

export {
  getRunningServers,
};