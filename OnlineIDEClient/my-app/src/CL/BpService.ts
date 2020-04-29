
import {WebSocketService} from './Connection';
import {DebugStep} from './DebugStep';

export function initCL(type, code) {
    WebSocketService.sendDataMess(type, code);
}

export function runCL() {
    WebSocketService.sendDataMess('run', '');
}

export function stepCL(debugStep: DebugStep) {
  WebSocketService.sendDataStep('step', debugStep);
}

export function addExternalEventCL(bEvent) {
    WebSocketService.sendDataMess('externalEvent', bEvent);
}
