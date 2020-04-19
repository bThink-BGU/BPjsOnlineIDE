
import {WebSocketService} from './Connection';
import {DebugStep} from './DebugStep';
import {debug} from "util";

const BpService = {
  isTest: false
};

export function initCL(type, code) {
  if (!BpService.isTest) {
    WebSocketService.sendDataMess(type, code);
  }
}

export function runCL() {
  if (!BpService.isTest) {
    WebSocketService.sendDataMess('run', '');
  }
}

export function stepCL(debugStep: DebugStep) {
  WebSocketService.sendDataStep('step', debugStep);
}

export function addExternalEventCL(bEvent) {
  if (!BpService.isTest) {
    WebSocketService.sendDataMess('externalEvent', bEvent);
  }
}
