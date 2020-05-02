import {WebSocketService} from '../../CL/Connection';

describe('Connection', () => {
  let connection: WebSocketService;

  beforeEach(() => {
    connection = new WebSocketService('wss://echo.websocket.org/');
  });

  it('should start a web socket connection on the given address', () => {
    const webSocket = connection.webSocket;
    expect(webSocket.closed).toBe(false); // a constructor must provide an open socket
  });

  it('should send a message and receive an echo of that message using sendDataMess', done => {
    const observer = {
      next: (response) => {
        expect(response.type).toBe('test_type');
        expect(response.message).toBe('test_message');
        done();
      },
      error: () => {
        fail();
        done();
      }
    };
    connection.getObservable().subscribe(observer);
    connection.sendDataMess('test_type', 'test_message');
  });

  it('should send a message and receive an echo of that message using sendDataMess', () => {
    // doesn't recognize the third test and i dont know why ... FIX LATER
  });
});


