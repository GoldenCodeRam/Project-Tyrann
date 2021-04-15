import { ServerInformation } from './interfaces/serverInformation';
import { getNeighbours } from './network';

export default class ServerHeartbeat {
  private _listOfNeighbours: Array<ServerInformation> = [];

  constructor() {
    getNeighbours().then((neighbours) => {
      this._listOfNeighbours = neighbours;
    });
  }
}