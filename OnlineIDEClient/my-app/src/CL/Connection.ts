import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {DebugStep} from './DebugStep';

export class WebSocketService {

  private readonly _webSocket : WebSocketSubject<any>;

  constructor(url: string) {
    this._webSocket = webSocket({
      url: url,
      serializer: value => JSON.stringify(value), // when sending a message
      deserializer: e => JSON.parse(e.data), // when receiving a message
    });
  }

  public sendDataMess(type: string, message: string) {
    this._webSocket.next({type: type, message: message});
  }

  public sendDataStep(type: string, debugStep: DebugStep) {
    let gVars = [];
    let gVals = [];
    if (debugStep.globalVariables === undefined) {
      gVars = undefined;
      gVals = undefined;
    } else {
      for (const key of debugStep.globalVariables.keys()) {
        gVars.push(key);
        gVals.push(debugStep.globalVariables.get(key));
      }
    }

    let bThreadNames = [];
    let lVars = [];
    let lVals = [];
    if (debugStep.localVariables === undefined) {
      bThreadNames = undefined;
      lVars = undefined;
      lVals = undefined;
    } else {
      for (const key of debugStep.localVariables.keys()) {
        bThreadNames.push(key);
        const tmpVars = [];
        const tmpVals = [];
        for (const key2 of debugStep.localVariables.get(key)) {
          tmpVars.push(key2);
          tmpVals.push(debugStep.localVariables.get(key).get(key2));
        }
        lVars.push(tmpVars);
        lVals.push(tmpVals);
      }
    }

    this._webSocket.next({type: type, bpss: debugStep.bpss, globalVars: gVars, globalVals: gVals,
      bThreadNames: bThreadNames, localVars: lVars, localVals: lVals, reqList: debugStep.reqList,
      selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList, blockList: debugStep.blockList,
      selectedEvent: debugStep.selectedEvent});
  }

  public getObservable() {
    return this._webSocket.asObservable();
  }

  get webSocket() {
    return this._webSocket;
  }
}
