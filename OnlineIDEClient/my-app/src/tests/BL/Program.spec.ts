import {Program} from '../../BL/Program';

describe('init', () => {
  let program: Program;

  beforeEach(() => {
    program = new Program('wss://echo.websocket.org/');
  });

  // 2.1
  it('init', done => {
    const observer = {
      next: () => {
        expect(program.code).toBe('test');
        done();
      },
      error: () => {
        fail();
        done();
      }
    };

    program.bpService.subscribeObserver(observer);
    program.init('init', 'test');
  });
});

