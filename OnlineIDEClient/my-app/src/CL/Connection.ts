import {Injectable} from "@angular/core";
import {webSocket} from "rxjs/webSocket";

@Injectable()
export class WebSocketService {

  private static connection = webSocket({
    url: 'ws://localhost:8080/OnlineIDEServer/api',
    serializer: value => { return JSON.stringify(value); }, // when sending a message
    deserializer: e => { return JSON.parse(e.data); }, // when receiving a message
  });

  public static send_data(type: string, message: string){
    WebSocketService.connection.next({type: type, message: message});
  }

  public static get_observable(){
    return WebSocketService.connection.asObservable();
  }

}

