"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkServerInformation = void 0;
function checkServerInformation(data) {
    if (data.serverIp && data.serverPort) {
        return data;
    }
}
exports.checkServerInformation = checkServerInformation;
