import {WebSocketService} from "../Connection";
import {DebugStep} from "../DebugStep";

describe('Connection', () => {
  let connection: WebSocketService;

  beforeEach(() => {
    connection = new WebSocketService('wss://echo.websocket.org/');
  });

  it('should start a web socket connection on the given address', ()=>{
    let webSocket = connection.webSocket;
    expect(webSocket.closed).toBe(false); // a constructor must provide an open socket
  });

  it('should send a message and receive an echo of that message using sendDataMess', ()=>{
    let observer = {
      next: (response)=>{
        expect(response.type).toBe('test_type');
        expect(response.message).toBe('test_message');
      },
      error: ()=>{
        fail();
      }
    };
    connection.getObservable().subscribe(observer);
    connection.sendDataMess('test_type', 'test_message');
  });

  it('should send a message and receive an echo of that message using sendDataMess', ()=>{
    // doesn't recognize the third test and i dont know why ... FIX LATER
  });




});
