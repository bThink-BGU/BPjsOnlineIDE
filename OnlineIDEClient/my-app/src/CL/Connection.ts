import {Injectable} from '@angular/core';
import {webSocket} from 'rxjs/webSocket';
import {DebugStep} from './DebugStep';

@Injectable()
export class WebSocketService {

  private static connection = webSocket({
    url: 'ws://localhost:8080/OnlineIDEServer/api',
    serializer: value => JSON.stringify(value), // when sending a message
    deserializer: e => JSON.parse(e.data), // when receiving a message
  });

  public static sendDataMess(type: string, message: string) {
    WebSocketService.connection.next({type: type, message: message});
  }

  public static sendDataStep(type: string, debugStep: DebugStep) {
      WebSocketService.connection.next({type: type, bpss: debugStep.bpss,
        bThreadDebugData: debugStep.bThreadDebugData, globalVariables: debugStep.globalVariables,
        reqList: debugStep.reqList, selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList,
        blockList: debugStep.blockList, selectedEvent: debugStep.selectedEvent});
  }

  public static getObservable() {
    return WebSocketService.connection.asObservable();
  }

}

