"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toServerInformation = exports.instanceOfServerInformation = void 0;
function instanceOfServerInformation(object) {
    return 'serverName, serverPort, serverId, serverIp' in object;
}
exports.instanceOfServerInformation = instanceOfServerInformation;
function toServerInformation(object) {
    return {
        serverName: object.serverName,
        serverPort: object.serverPort,
        serverId: object.serverId,
        serverIp: process.env.SERVER_NETWORK_IP,
        serverStatus: object.serverStatus,
    };
}
exports.toServerInformation = toServerInformation;
