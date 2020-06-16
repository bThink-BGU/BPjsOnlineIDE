import {BpService} from '../../CL/BpService';
import {DebugStep} from '../../CL/DebugStep';
import {fakeAsync, tick} from "@angular/core/testing";

describe('initCL', () => {
  let bpService: BpService;

  beforeEach(() => {
    bpService = new BpService('wss://echo.websocket.org/');
  });

  // 1.1
  it('initRun', fakeAsync(() => {
    const observer = {
      next: (response) => {
        expect(response.type).toBe('initRun');
        expect(response.message).toBe('test');
      },
      error: () => {
        fail('CHECK YOUR INTERNET CONNECTION');
      }
    };
    bpService.subscribeObserver(observer);
    bpService.initCL('initRun', 'test');

    tick(3000);
  }));

  // 1.2
  it('initStep', fakeAsync(() => {
    const observer = {
      next: (response) => {
        expect(response.type).toBe('initStep');
        expect(response.message).toBe('test');
      },
      error: () => {
        fail('CHECK YOUR INTERNET CONNECTION');
      }
    };
    bpService.subscribeObserver(observer);
    bpService.initCL('initStep', 'test');

    tick(3000);
  }));
});

describe('runCL', () => {
  let bpService: BpService;

  beforeEach(() => {
    bpService = new BpService('wss://echo.websocket.org/');
  });

  // 1.3
  it('run', fakeAsync(() => {
    const observer = {
      next: (response) => {
        expect(response.type).toBe('run');
        expect(response.message).toBe('');
      },
      error: () => {
        fail('CHECK YOUR INTERNET CONNECTION');
      }
    };
    bpService.subscribeObserver(observer);
    bpService.runCL();

    tick(3000);
  }));
});

describe('stepCL', () => {
  let bpService: BpService;

  beforeEach(() => {
    bpService = new BpService('wss://echo.websocket.org/');
  });

  // 1.4
  it('step', fakeAsync(() => {
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
      },
      error: () => {
        fail('CHECK YOUR INTERNET CONNECTION');
      }
    };
    bpService.subscribeObserver(observer);
    bpService.stepCL(new DebugStep(undefined, undefined, [], ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e', 1));

    tick(3000);
  }));
});

describe('addExternalEventCL', () => {

  let bpService: BpService;

  beforeEach(() => {
    bpService = new BpService('wss://echo.websocket.org/');
  });

  // 1.5
  it('addExternalEvent', fakeAsync(() => {
    const observer = {
      next: (response) => {
        expect(response.type).toBe('externalEvent');
        expect(response.message).toBe('e');
      },
      error: () => {
        fail('CHECK YOUR INTERNET CONNECTION');
      }
    };
    bpService.subscribeObserver(observer);
    bpService.addExternalEventCL('e');

    tick(3000);
  }));
});

describe('stop', () => {
  let bpService: BpService;

  beforeEach(() => {
    bpService = new BpService('wss://echo.websocket.org/');
  });

  // 1.6
  it('stop', fakeAsync(() => {
    const observer = {
      next: (response) => {
        expect(response.type).toBe('stop');
      },
      error: () => {
        fail('CHECK YOUR INTERNET CONNECTION');
      }
    };
    bpService.subscribeObserver(observer);
    bpService.stopRunCL();

    tick(3000);
  }));
});
