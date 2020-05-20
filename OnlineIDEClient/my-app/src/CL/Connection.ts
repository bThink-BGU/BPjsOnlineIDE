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
    const gv = this.mapVarsToLists(debugStep.globalVariables);

    let bThreads = [];
    if (debugStep.bThreads === undefined) {
      bThreads = undefined;
    } else {
      for (let i = 0; i < debugStep.bThreads.length; i++) {
        const b = debugStep.bThreads[i];
        const lv = this.mapVarsToLists(b.localVariables);
        bThreads.push({bThreadName: b.bThreadName, firstLinePC: b.firstLinePC, localShift: b.localShift,
          localVars: lv[0], localVals: lv[1]});
      }
    }


    const response = {type: type, bpss: debugStep.bpss, globalVars: gv[0], globalVals: gv[1],
      bThreads: bThreads, reqList: debugStep.reqList, selectableEvents: debugStep.selectableEvents,
      waitList: debugStep.waitList, blockList: debugStep.blockList, selectedEvent: debugStep.selectedEvent};

    this._webSocket.next(response);
  }

  private mapVarsToLists(map: Map<object, object>) {
    let vars = [];
    let vals = [];
    if (map === undefined) {
      vars = undefined;
      vals = undefined;
    } else {
      for (const key of map.keys()) {
        vars.push(key);
        vals.push(map.get(key));
      }
    }
    return [vars, vals];
  }

  public getObservable() {
    return this._webSocket.asObservable();
  }

  get webSocket() {
    return this._webSocket;
  }
}
