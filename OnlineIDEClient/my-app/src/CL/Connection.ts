import {Injectable} from '@angular/core';
import {webSocket} from 'rxjs/webSocket';

@Injectable()
export class WebSocketService {

  private static connection = webSocket({
    url: 'ws://localhost:8080/OnlineIDEServer/api',
    serializer: value => JSON.stringify(value), // when sending a message
    deserializer: e => JSON.parse(e.data), // when receiving a message
  });

  public static sendData(type: string, message: string) {
    WebSocketService.connection.next({type: type, message: message});
  }

  public static getObservable() {
    return WebSocketService.connection.asObservable();
  }

}

