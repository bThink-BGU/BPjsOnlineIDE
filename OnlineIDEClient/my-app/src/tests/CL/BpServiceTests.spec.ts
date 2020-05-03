import {BpService} from '../../CL/BpService';
import {DebugStep} from '../../CL/DebugStep';

describe('initCL', () => {
  let bpService: BpService;

  beforeEach(() => {
    bpService = new BpService('wss://echo.websocket.org/');
  });

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

  it('step', done => {
    const observer = {
      next: (response) => {
        expect(response.type).toEqual('step');
        expect(response.bpss).toBe(null);
        expect(response.variables).toEqual(null);
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
    bpService.stepCL(new DebugStep(null, null, ['a', 'b'], ['c', 'd'],
      ['e', 'f'], ['g', 'h'], 'e'));
  });
});

describe('addExternalEventCL', () => {
  let bpService: BpService;

  beforeEach(() => {
    bpService = new BpService('wss://echo.websocket.org/');
  });

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
