import {WebSocketService} from './Connection';
import {DebugStep} from './DebugStep';

export class BpService {

  // ONLY TO PLACE A MOCK CONNECTION IN APP TESTS
  set connection(value) {
    this._connection = value;
  }

  private _connection;

  constructor(url: string) {
    this._connection = new WebSocketService(url);
  }

  initCL(type, code) {
    this._connection.sendDataMess(type, code);
  }

  stopRunCL() {
    this._connection.sendDataMess('stop', '');
  }

  runCL() {
    this._connection.sendDataMess('run', '');
  }

  stepCL(debugStep: DebugStep) {
    this._connection.sendDataStep('step', debugStep);
  }

  addExternalEventCL(bEvent) {
    this._connection.sendDataMess('externalEvent', bEvent);
  }

  subscribeObserver(observer) {
    this._connection.getObservable().subscribe(observer);
  }
}


