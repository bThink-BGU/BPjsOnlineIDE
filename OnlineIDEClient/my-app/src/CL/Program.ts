import {WebSocketService} from './Connection';

export const initCL = {
  func: init
};

function init(code) {
    WebSocketService.sendData('step', code);
}

