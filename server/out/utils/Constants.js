"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_PORT = exports.COORDINATOR_SERVER_URL = void 0;
// I got the 172.28.67.179 ip from the ifconfig command ran in the WSL. Maybe change it if it does
// not work in other machine.
var COORDINATOR_SERVER_URL = '172.28.72.13:8080';
exports.COORDINATOR_SERVER_URL = COORDINATOR_SERVER_URL;
var SERVER_PORT = 8080;
exports.SERVER_PORT = SERVER_PORT;
