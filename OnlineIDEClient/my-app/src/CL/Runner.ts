import {WebSocketService} from './Connection';

export const runCL = {
  func: run
};

function run() {
  WebSocketService.sendData('run', '');
}


