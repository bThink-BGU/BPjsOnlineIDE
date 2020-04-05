import {State1} from './State';
import {WebSocketService} from './Connection';

export function initCL(code) {
  WebSocketService.sendData('init', code);
}

export function runCL() {
  WebSocketService.sendData('run', '');
}

// TODO - Now it stub
export function nextStepCL(cont) {
  return new State1('cont', 'e', ['r', 'l'], ['w', 'l'], ['b', 'l'],
    {a: 5, b: 7});
}

export function addExternalEventCL(bEvent) {
  WebSocketService.sendData('externalEvent', bEvent);
}
