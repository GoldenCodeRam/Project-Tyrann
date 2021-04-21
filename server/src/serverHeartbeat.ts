import axios from 'axios';

import { CoordinatorServerInformation, ServerInformation, toServerInformation } from './interfaces/serverInformation';
import { heartbeatLogger as logger } from './utils/logger';

export default class ServerHeartbeat {
  private _listOfNodes: Array<ServerInformation> = [];
  private _electionInProgress = false;
  private _currentLeader: ServerInformation | undefined;

  private _heartbeatInterval = Math.round((Math.random() + Math.random() * 10) * 10000);

  private _currentServerInformation: ServerInformation = {
    serverName: `server_${process.env.SERVER_PORT}`,
    serverId: String(Math.round(Math.random() * 100)),
    serverIp: process.env.SERVER_NETWORK_IP as string,
    serverPort: parseInt(process.env.SERVER_PORT as string),
    serverStatus: 'OK',
  };

  constructor() {
    logger.info('Current server information:');
    console.log(this._currentServerInformation);
  }

  public set electionInProgress(status: boolean) {
    this._electionInProgress = status;
  }

  public set listOfNodes(nodes: Array<CoordinatorServerInformation>) {
    this._listOfNodes = [];
    nodes.forEach((information: CoordinatorServerInformation) => {
      const serverInformation = toServerInformation(information);
      if (serverInformation.serverPort != this._currentServerInformation.serverPort) {
        this._listOfNodes.push(serverInformation);
      }
    });
    // logger.info('Neighbours got from coordinator:');
    //console.log(this._listOfNodes);
  }

  public set leaderPort(port: number) {
    for (const node of this._listOfNodes) {
      if(port == node.serverPort) {
        this._currentLeader = node;
        break;
      }
    }
  }

  public get currentLeaderPort(): number | undefined {
    return this._currentLeader?.serverPort;
  }

  public get currentServerId(): number {
    return parseInt(this._currentServerInformation.serverId);
  }

  public async startHeartbeat(): Promise<void> {
    logger.info('Starting heartbeat');
    if (this._listOfNodes.length == 0) {
      logger.info('This server is the only server in the network, so it is the leader.');
      this._currentLeader = this._currentServerInformation;
    } else {
      await this.getCurrentNetworkLeader();
    }

    logger.info(`Heartbeat interval: ${this._heartbeatInterval}`);

    if (!this._electionInProgress) {
      setInterval(() => { this.doHeartbeat(); }, this._heartbeatInterval);
    }
  }

  public async continueElections(): Promise<void> {
    logger.info('Continuing elections');
    let availableLeaderServers= false;

    for (const node of this._listOfNodes) {
      if (node.serverId > this._currentServerInformation.serverId) {
        const response = await axios.put(`http://${node.serverIp}:${node.serverPort}/election`).catch(() => {
          logger.error(`Error sending the notification of election to server on port ${node.serverPort}`);
        });
        if (response) {
          console.log(`Notification of election send to server on port ${node.serverPort}`);
          availableLeaderServers = true;
        }
      }
    }

    if (!availableLeaderServers) {
      logger.info('This server is the only server available in the network, so it is the leader.');
      this.notifyNewLeader();
    }
  }

  private async getCurrentNetworkLeader() {
    logger.info('Getting the current leader of this network');
    let leaderPort = 0;

    for (const node of this._listOfNodes) {
      const response = await axios.get(`http://${node.serverIp}:${node.serverPort}/leader`).catch(() => {
        logger.error('Error getting the current leader of the network');
      });

      if (response) {
        leaderPort = response.data.leader;
        break;
      }
    }

    for (const node of this._listOfNodes) {
      if (node.serverPort == leaderPort) {
        this._currentLeader = node;
        break;
      }
    }

    logger.info(`The current leader of the network is on the port ${this._currentLeader?.serverPort}`);
  }

  private async doHeartbeat() {
    if (this._currentLeader) {
      if (this._currentServerInformation.serverPort !== this._currentLeader.serverPort) {
        logger.info('Making heartbeat to leader');
        const response = await axios.get(
          `http://${this._currentLeader.serverIp}:${this._currentLeader.serverPort}/status`
        ).catch(() => {
          logger.error('Error making the heartbeat to the leader! Should make new election');
        });
        if (response && response.status == 200) {
          logger.info('Leader is 👌');
        } else {
          logger.warn('Leader did not answer correctly. Starting new election');
          this.startElections();
          return;
        }
      } else {
        logger.info('This server is the leader');
      }
    }
  }

  private async startElections() {
    this._electionInProgress = true;
    logger.info('Starting new elections');
    let availableLeaderServers= false;

    // Notify all servers an election is being made
    // console.log(this._listOfNodes);
    for (const node of this._listOfNodes) {
      const response = await axios.put(`http://${node.serverIp}:${node.serverPort}/electionInCourse`).catch(() => {
        logger.error(`Error sending the notification of new election to server on port ${node.serverPort}`);
      });
      if (response) {
        console.log(`Notification of new election send to server on port ${node.serverPort}`);
      }
    }

    for (const node of this._listOfNodes) {
      if (node.serverId > this._currentServerInformation.serverId) {
        const response = await axios.put(`http://${node.serverIp}:${node.serverPort}/election`).catch(() => {
          logger.error(`Error sending the notification of election to server on port ${node.serverPort}`);
        });
        if (response) {
          console.log(`Notification of election send to server on port ${node.serverPort}`);
          availableLeaderServers = true;
        }
      }
    }

    if (!availableLeaderServers) {
      logger.info('This server is the only server available in the network, so it is the leader.');
      this._currentLeader = this._currentServerInformation;
      this.notifyNewLeader();
    }
  }

  private async notifyNewLeader() {
    logger.info('Notifying all servers that this server is the new leader');
    for (const node of this._listOfNodes) {
      const response = axios.put(
        `http://${node.serverIp}:${node.serverPort}/newLeader`,
        { leader: this._currentServerInformation.serverPort }
      ).catch(() => {
        logger.error(`Error sending the notification of new election to server on port ${node.serverPort}`);
      });
      if (response) {
        console.log(`Notification of new election send to server on port ${node.serverPort}`);
      }
    }
  }
}