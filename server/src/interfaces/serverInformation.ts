export interface ServerInformation {
  serverId: number,
  serverIp: string,
  serverPort: string,
}

export function checkServerInformation(data: ServerInformation): ServerInformation | undefined {
  if (data.serverIp && data.serverPort) {
    return data as ServerInformation;
  }
}