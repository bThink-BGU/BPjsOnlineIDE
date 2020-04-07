
import {WebSocketService} from './Connection';
import {DebugStep} from './DebugStep';

const BpService = {
  isTest: false
};

export function initCL(code) {
  if (!BpService.isTest) {
    WebSocketService.sendData('init', code);
  }
}

export function runCL() {
  if (!BpService.isTest) {
    WebSocketService.sendData('run', '');
  }
}

export function stepCL(debugStep: DebugStep) {
  WebSocketService.sendData('step', JSON.stringify(debugStep));
}

export function addExternalEventCL(bEvent) {
  if (!BpService.isTest) {
    WebSocketService.sendData('externalEvent', bEvent);
  }
}
