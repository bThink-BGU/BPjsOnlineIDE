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
      this._webSocket.next({type: type, bpss: debugStep.bpss, variables: debugStep.variables,
        reqList: debugStep.reqList, selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList,
        blockList: debugStep.blockList, selectedEvent: debugStep.selectedEvent});
  }

  public getObservable() {
    return this._webSocket.asObservable();
  }

  get webSocket() {
    return this._webSocket;
  }

}

