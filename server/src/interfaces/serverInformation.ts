export interface ServerInformation {
  serverName: string,
  serverPort: number,
  serverId: string,
  serverIp: string,
}

export function instanceOfServerInformation(object: any): object is ServerInformation {
  return 'serverName, serverPort, serverId, serverIp' in object;
}