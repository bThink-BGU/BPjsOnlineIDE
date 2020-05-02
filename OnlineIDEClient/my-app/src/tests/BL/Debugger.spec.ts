import {BpService} from '../../CL/BpService';
import {Debugger} from '../../BL/Debugger';
import {DebugStep} from '../../CL/DebugStep';

describe('step', () => {
  let debug: Debugger;

  beforeEach(() => {
    debug = new Debugger(new BpService('wss://echo.websocket.org/'));
  });

  it('stepTraceIsEmpty', done => {
    const observer = {
      next: (response) => {
        expect(response.type).toBe('step');
        expect(response.bpss).toBe(null);
        expect(response.variables).toBe(null);
        expect(response.reqList).toBe(null);
        expect(response.selectableEvents).toBe(null);
        expect(response.waitList).toBe(null);
        expect(response.blockList).toBe(null);
        expect(response.selectedEvent).toBe(null);
        done();
      },
      error: () => {
        fail();
        done();
      }
    };
    debug.bpService.subscribeObserver(observer);
    debug.step();
  });

  it('stepTraceNotEmpty', done => {
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
    debug.bpService.subscribeObserver(observer);
    debug.stepTrace.push(new DebugStep(null, null, ['a', 'b'], ['c', 'd'],
      ['e', 'f'], ['g', 'h'], 'e'));
    debug.step();
  });
});


describe('stepBack', () => {
  let debug: Debugger;

  beforeEach(() => {
    debug = new Debugger(new BpService('wss://echo.websocket.org/'));
  });

  it('cantDoStepBack1', () => {
    debug.stepBack();
    expect(debug.stepTrace.length).toBe(0);
    expect(debug.eventTrace.length).toBe(0);
  });

  it('cantDoStepBack2', () => {
    debug.stepTrace.push(new DebugStep(null, null, ['a', 'b'], ['c', 'd'],
      ['e', 'f'], ['g', 'h'], 'e'));
    debug.eventTrace.push('e');

    debug.stepBack();

    expect(debug.stepTrace.length).toBe(1);
    expect(debug.eventTrace.length).toBe(1);
  });

  it('stepBack', () => {
    debug.stepTrace.push(new DebugStep(null, null, ['a', 'b'], ['c', 'd'],
      ['e', 'f'], ['g', 'h'], 'e'));
    debug.eventTrace.push('e');
    debug.stepTrace.push(new DebugStep(null, null, null, null,
      null, null, null));
    debug.eventTrace.push('');

    debug.stepBack();

    const debugStep = debug.stepTrace[debug.stepTrace.length - 1]; // last one

    expect(debugStep.type).toEqual('step');
    expect(debugStep.bpss).toBe(null);
    expect(debugStep.variables).toEqual(null);
    expect(debugStep.reqList).toEqual(['a', 'b']);
    expect(debugStep.selectableEvents).toEqual(['c', 'd']);
    expect(debugStep.waitList).toEqual(['e', 'f']);
    expect(debugStep.blockList).toEqual(['g', 'h']);
    expect(debugStep.selectedEvent).toBe('e');
    expect(debug.stepTrace.length).toBe(1);
    expect(debug.eventTrace.length).toBe(1);
  });
});


describe('stepBackToIndex', () => {
  let debug: Debugger;

  beforeEach(() => {
    debug = new Debugger(new BpService('wss://echo.websocket.org/'));
  });

  it('negativeStepNumber', () => {
    let counter = 0;

    do { debug.stepTrace.push(new DebugStep(null, null, ['a', 'b'], ['c', 'd'],
      ['e', 'f'], ['g', 'h'], 'e'));
         debug.eventTrace.push('e');
    } while (counter++ < 3);

    debug.stepBackToIndex(-1);

    expect(debug.stepTrace.length).toBe(4);
    expect(debug.eventTrace.length).toBe(4);
  });

  it('StepNumberEqualTo0', () => {
    let counter = 0;

    do { debug.stepTrace.push(new DebugStep(null, null, ['a', 'b'], ['c', 'd'],
      ['e', 'f'], ['g', 'h'], 'e'));
         debug.eventTrace.push('e');
    } while (counter++ < 3);

    debug.stepBackToIndex(0);

    expect(debug.stepTrace.length).toBe(4);
    expect(debug.eventTrace.length).toBe(4);
  });

  it('StepNumberBiggerThenLength', () => {
    let counter = 0;

    debug.setStepTrace([]);
    debug.setEventTrace([]);

    do { debug.stepTrace.push(new DebugStep(null, null, ['a', 'b'], ['c', 'd'],
      ['e', 'f'], ['g', 'h'], 'e'));
         debug.eventTrace.push('e');
    } while (counter++ < 3);

    debug.stepBackToIndex(debug.stepTrace.length + 1);

    expect(debug.stepTrace.length).toBe(4);
    expect(debug.eventTrace.length).toBe(4);
  });

  it('StepNumberEqualToLength', () => {
    let counter = 0;

    do { debug.stepTrace.push(new DebugStep(null, null, ['a', 'b'], ['c', 'd'],
      ['e', 'f'], ['g', 'h'], 'e'));
      debug.eventTrace.push('e');
    } while (counter++ < 3);

    debug.stepBackToIndex(debug.stepTrace.length);

    expect(debug.stepTrace.length).toBe(4);
    expect(debug.eventTrace.length).toBe(4);
  });

  it('cantDoStepBack1', () => {
    debug.stepBackToIndex(1);
    expect(debug.stepTrace.length).toBe(0);
    expect(debug.eventTrace.length).toBe(0);
  });

  it('cantDoStepBack2', () => {
    debug.stepTrace.push(new DebugStep(null, null, ['a', 'b'], ['c', 'd'],
      ['e', 'f'], ['g', 'h'], 'e'));
    debug.eventTrace.push('e');

    debug.stepBackToIndex(1);

    expect(debug.stepTrace.length).toBe(1);
    expect(debug.eventTrace.length).toBe(1);
  });

  it('stepBack', () => {
    debug.stepTrace.push(new DebugStep(null, null, ['a', 'b'], ['c', 'd'],
      ['e', 'f'], ['g', 'h'], 'e'));
    debug.eventTrace.push('e');

    debug.stepTrace.push(new DebugStep(null, null, ['aa', 'bb'], ['cc', 'dd'],
      ['ee', 'ff'], ['gg', 'hh'], 'ee'));
    debug.eventTrace.push('e');

    let counter = 0;

    do {
      debug.stepTrace.push(new DebugStep(null, null, ['av', 'bv'], ['cv', 'dv'],
        ['ev', 'fv'], ['gv', 'hv'], 'e'));
      debug.eventTrace.push('ev');
    } while (counter++ < 3);

    debug.stepTrace.push(new DebugStep(null, null, null, null,
      null, null, null));
    debug.eventTrace.push('');

    debug.stepBackToIndex(2);

    let debugStep = debug.stepTrace[debug.stepTrace.length - 1]; // last one

    expect(debugStep.type).toEqual('step');
    expect(debugStep.bpss).toBe(null);
    expect(debugStep.variables).toEqual(null);
    expect(debugStep.reqList).toEqual(['aa', 'bb']);
    expect(debugStep.selectableEvents).toEqual(['cc', 'dd']);
    expect(debugStep.waitList).toEqual(['ee', 'ff']);
    expect(debugStep.blockList).toEqual(['gg', 'hh']);
    expect(debugStep.selectedEvent).toBe('ee');
    expect(debug.stepTrace.length).toBe(2);
    expect(debug.eventTrace.length).toBe(2);

    debug.stepBackToIndex(1);

    debugStep = debug.stepTrace[debug.stepTrace.length - 1];

    expect(debugStep.type).toEqual('step');
    expect(debugStep.bpss).toBe(null);
    expect(debugStep.variables).toEqual(null);
    expect(debugStep.reqList).toEqual(['a', 'b']);
    expect(debugStep.selectableEvents).toEqual(['c', 'd']);
    expect(debugStep.waitList).toEqual(['e', 'f']);
    expect(debugStep.blockList).toEqual(['g', 'h']);
    expect(debugStep.selectedEvent).toBe('e');
    expect(debug.stepTrace.length).toBe(1);
    expect(debug.eventTrace.length).toBe(1);
  });
});
