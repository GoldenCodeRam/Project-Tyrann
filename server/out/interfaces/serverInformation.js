"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfServerInformation = void 0;
function instanceOfServerInformation(object) {
    return 'serverName, serverPort, serverId, serverIp' in object;
}
exports.instanceOfServerInformation = instanceOfServerInformation;
