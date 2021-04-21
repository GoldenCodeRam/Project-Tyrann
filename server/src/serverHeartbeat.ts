import { ServerInformation } from './interfaces/serverInformation';
import { heartbeatLogger as logger } from './utils/logger';

export default class ServerHeartbeat {
  private _listOfNodes: Array<ServerInformation> = [];

  constructor(neighbours: any) {
    neighbours.forEach((information: any) => {
      if (information.serverPort !== process.env.SERVER_PORT) {
        this._listOfNodes.push({
          serverName: information.serverName,
          serverPort: information.serverPort,
          serverId: information.serverId,
          serverIp: process.env.SERVER_NETWORK_IP as string,
        });
      }
    });
    logger.info('Neighbours got from coordinator:');
    console.log(this._listOfNodes);
  }
}