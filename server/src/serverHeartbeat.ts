import { ServerInformation } from './interfaces/serverInformation';
import { getNodes } from './network';
import { heartbeatLogger } from './utils/logger';

export default class ServerHeartbeat {
  private _listOfNodes: Array<ServerInformation> = [];

  constructor() {
    getNodes().then((neighbours) => {
      this._listOfNodes = neighbours;
      heartbeatLogger.info('List of nodes received successfully');
    })
      .catch((error) => {
        heartbeatLogger.error('Could not received the list of nodes successfully');
      });
  }

  public getListOfNodes(): Array<ServerInformation> {
    return this._listOfNodes;
  }

  public setListOfNodes(listOfNodes: Array<ServerInformation>): void {
    this._listOfNodes = listOfNodes;
  }
}