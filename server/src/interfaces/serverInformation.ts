export interface ServerInformation {
  serverName: string,
  serverPort: number,
  serverId: string,
  serverIp: string,
  serverStatus: string,
}

export interface CoordinatorServerInformation {
  serverName: string,
  serverPort: number,
  serverStatus: string,
  serverId: string,
}

export function instanceOfServerInformation(object: any): object is ServerInformation {
  return 'serverName, serverPort, serverId, serverIp' in object;
}

export function toServerInformation(object: CoordinatorServerInformation): ServerInformation {
  return {
    serverName: object.serverName,
    serverPort: object.serverPort,
    serverId: object.serverId,
    serverIp: process.env.SERVER_NETWORK_IP as string,
    serverStatus: object.serverStatus,
  };
}