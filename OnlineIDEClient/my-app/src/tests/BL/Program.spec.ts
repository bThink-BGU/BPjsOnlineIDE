import {Program} from '../../BL/Program';
import {fakeAsync, tick} from "@angular/core/testing";

describe('init', () => {
  let program: Program;

  beforeEach(() => {
    program = new Program('wss://echo.websocket.org/');
  });

  // 2.1
  it('init', fakeAsync(() => {
    const observer = {
      next: () => {
        expect(program.code).toBe('test');
      },
      error: () => {
        fail('CHECK YOUR INTERNET CONNECTION');
      }
    };

    program.bpService.subscribeObserver(observer);
    program.init('init', 'test');

    tick(3000)
  }));
});

