import {BpService} from '../../CL/BpService';
import {DebugStep} from '../../CL/DebugStep';

describe('initCL', () => {
  let bpService: BpService;

  beforeEach(() => {
    bpService = new BpService('wss://echo.websocket.org/');
  });

  // 1.1
  it('initRun', done => {
    const observer = {
      next: (response) => {
        expect(response.type).toBe('initRun');
        expect(response.message).toBe('test');
        done();
      },
      error: () => {
        fail();
        done();
      }
    };
    bpService.subscribeObserver(observer);
    bpService.initCL('initRun', 'test');
  });

  // 1.2
  it('initStep', done => {
    const observer = {
      next: (response) => {
        expect(response.type).toBe('initStep');
        expect(response.message).toBe('test');
        done();
      },
      error: () => {
        fail();
        done();
      }
    };
    bpService.subscribeObserver(observer);
    bpService.initCL('initStep', 'test');
  });
});

describe('runCL', () => {
  let bpService: BpService;

  beforeEach(() => {
    bpService = new BpService('wss://echo.websocket.org/');
  });

  // 1.3
  it('run', done => {
    const observer = {
      next: (response) => {
        expect(response.type).toBe('run');
        expect(response.message).toBe('');
        done();
      },
      error: () => {
        fail();
        done();
      }
    };
    bpService.subscribeObserver(observer);
    bpService.runCL();
  });
});

describe('stepCL', () => {
  let bpService: BpService;

  beforeEach(() => {
    bpService = new BpService('wss://echo.websocket.org/');
  });

  // 1.4
  it('step', done => {
    const observer = {
      next: (response) => {
        expect(response.type).toEqual('step');
        expect(response.bpss).toBe(undefined);
        expect(response.variables).toEqual(undefined);
        expect(response.reqList).toEqual(['a', 'b']);
        expect(response.selectableEvents).toEqual(['c', 'd']);
        expect(response.waitList).toEqual(['e', 'f']);
        expect(response.blockList).toEqual(['g', 'h']);
        expect(response.selectedEvent).toBe('e');
        done();
      },
      error: () => {
        fail();
        done();
      }
    };
    bpService.subscribeObserver(observer);
    bpService.stepCL(new DebugStep(undefined, undefined, null, ['c', 'd'],
      ['e', 'f'], ['g', 'h'], null, null, null));
  });
});

describe('addExternalEventCL', () => {
  let bpService: BpService;

  beforeEach(() => {
    bpService = new BpService('wss://echo.websocket.org/');
  });

  // 1.5
  it('addExternalEvent', done => {
    const observer = {
      next: (response) => {
        expect(response.type).toBe('externalEvent');
        expect(response.message).toBe('e');
        done();
      },
      error: () => {
        fail();
        done();
      }
    };
    bpService.subscribeObserver(observer);
    bpService.addExternalEventCL('e');
  });
});
// import {BpService} from '../../CL/BpService';
// import {DebugStep} from '../../CL/DebugStep';
//
// describe('initCL', () => {
//   let bpService: BpService;
//
//   beforeEach(() => {
//     bpService = new BpService('wss://echo.websocket.org/');
//   });
//
//   // 1.1
//   it('initRun', done => {
//     const observer = {
//       next: (response) => {
//         expect(response.type).toBe('initRun');
//         expect(response.message).toBe('test');
//         done();
//       },
//       error: () => {
//         fail();
//         done();
//       }
//     };
//     bpService.subscribeObserver(observer);
//     bpService.initCL('initRun', 'test');
//   });
//
//   // 1.2
//   it('initStep', done => {
//     const observer = {
//       next: (response) => {
//         expect(response.type).toBe('initStep');
//         expect(response.message).toBe('test');
//         done();
//       },
//       error: () => {
//         fail();
//         done();
//       }
//     };
//     bpService.subscribeObserver(observer);
//     bpService.initCL('initStep', 'test');
//   });
// });
//
// describe('runCL', () => {
//   let bpService: BpService;
//
//   beforeEach(() => {
//     bpService = new BpService('wss://echo.websocket.org/');
//   });
//
//   // 1.3
//   it('run', done => {
//     const observer = {
//       next: (response) => {
//         expect(response.type).toBe('run');
//         expect(response.message).toBe('');
//         done();
//       },
//       error: () => {
//         fail();
//         done();
//       }
//     };
//     bpService.subscribeObserver(observer);
//     bpService.runCL();
//   });
// });
//
// describe('stepCL', () => {
//   let bpService: BpService;
//
//   beforeEach(() => {
//     bpService = new BpService('wss://echo.websocket.org/');
//   });
//
//   // 1.4
//   it('step', done => {
//     const observer = {
//       next: (response) => {
//         expect(response.type).toEqual('step');
//         expect(response.bpss).toBe(undefined);
//         expect(response.variables).toEqual(undefined);
//         expect(response.reqList).toEqual(['a', 'b']);
//         expect(response.selectableEvents).toEqual(['c', 'd']);
//         expect(response.waitList).toEqual(['e', 'f']);
//         expect(response.blockList).toEqual(['g', 'h']);
//         expect(response.selectedEvent).toBe('e');
//         done();
//       },
//       error: () => {
//         fail();
//         done();
//       }
//     };
//     bpService.subscribeObserver(observer);
//     bpService.stepCL(new DebugStep(undefined, undefined, ['a', 'b'], ['c', 'd'],
//       ['e', 'f'], ['g', 'h'], 'e'));
//   });
// });
//
// describe('addExternalEventCL', () => {
//   let bpService: BpService;
//
//   beforeEach(() => {
//     bpService = new BpService('wss://echo.websocket.org/');
//   });
//
//   // 1.5
//   it('addExternalEvent', done => {
//     const observer = {
//       next: (response) => {
//         expect(response.type).toBe('externalEvent');
//         expect(response.message).toBe('e');
//         done();
//       },
//       error: () => {
//         fail();
//         done();
//       }
//     };
//     bpService.subscribeObserver(observer);
//     bpService.addExternalEventCL('e');
//   });
// });
