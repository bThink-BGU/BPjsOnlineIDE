import {BpService} from '../../CL/BpService';
import {Debugger} from '../../BL/Debugger';
import {DebugStep} from '../../CL/DebugStep';
import {variable} from '@angular/compiler/src/output/output_ast';

describe('step', () => {
  let debug: Debugger;

  beforeEach(() => {
    debug = new Debugger(new BpService('wss://echo.websocket.org/'));
  });

  it('stepTraceIsEmpty', done => {
    const observer = {
      next: (response) => {
        expect(response.type).toBe('step');
        expect(response.bpss).toBe(undefined);
        expect(response.variables).toBe(undefined);
        expect(response.reqList).toBe(undefined);
        expect(response.selectableEvents).toBe(undefined);
        expect(response.waitList).toBe(undefined);
        expect(response.blockList).toBe(undefined);
        expect(response.selectedEvent).toBe(undefined);
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
    debug.bpService.subscribeObserver(observer);
    debug.stepTrace.push(new DebugStep(undefined, undefined, ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e'));
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
    debug.stepTrace.push(new DebugStep(undefined, undefined, ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e'));
    debug.eventTrace.push('e');

    debug.stepBack();

    expect(debug.stepTrace.length).toBe(1);
    expect(debug.eventTrace.length).toBe(1);
  });

  it('stepBack', () => {
    debug.stepTrace.push(new DebugStep(undefined, undefined, ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e'));
    debug.eventTrace.push('e');
    debug.stepTrace.push(new DebugStep(undefined, undefined, undefined,
      undefined, undefined, undefined, undefined));
    debug.eventTrace.push('');

    debug.stepBack();

    const debugStep = debug.stepTrace[debug.stepTrace.length - 1]; // last one

    expect(debugStep.type).toEqual('step');
    expect(debugStep.bpss).toBe(undefined);
    expect(debugStep.variables).toEqual(undefined);
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

    do { debug.stepTrace.push(new DebugStep(undefined, undefined, ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e'));
      debug.eventTrace.push('e');
    } while (counter++ < 3);

    debug.stepBackToIndex(-1);

    expect(debug.stepTrace.length).toBe(4);
    expect(debug.eventTrace.length).toBe(4);
  });

  it('StepNumberEqualTo0', () => {
    let counter = 0;

    do { debug.stepTrace.push(new DebugStep(undefined, undefined, ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e'));
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

    do { debug.stepTrace.push(new DebugStep(undefined, undefined, ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e'));
      debug.eventTrace.push('e');
    } while (counter++ < 3);

    debug.stepBackToIndex(debug.stepTrace.length + 1);

    expect(debug.stepTrace.length).toBe(4);
    expect(debug.eventTrace.length).toBe(4);
  });

  it('StepNumberEqualToLength', () => {
    let counter = 0;

    do { debug.stepTrace.push(new DebugStep(undefined, undefined, ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e'));
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
    debug.stepTrace.push(new DebugStep(undefined, undefined, ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e'));
    debug.eventTrace.push('e');

    debug.stepBackToIndex(1);

    expect(debug.stepTrace.length).toBe(1);
    expect(debug.eventTrace.length).toBe(1);
  });

  it('stepBack', () => {
    debug.stepTrace.push(new DebugStep(undefined, undefined, ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e'));
    debug.eventTrace.push('e');

    debug.stepTrace.push(new DebugStep(undefined, undefined, ['aa', 'bb'],
      ['cc', 'dd'], ['ee', 'ff'], ['gg', 'hh'], 'ee'));
    debug.eventTrace.push('e');

    let counter = 0;

    do {
      debug.stepTrace.push(new DebugStep(undefined, undefined, ['av', 'bv'],
        ['cv', 'dv'], ['ev', 'fv'], ['gv', 'hv'], 'e'));
      debug.eventTrace.push('ev');
    } while (counter++ < 3);

    debug.stepTrace.push(new DebugStep(undefined, undefined, undefined,
      undefined, undefined, undefined, undefined));
    debug.eventTrace.push('');

    debug.stepBackToIndex(2);

    let debugStep = debug.stepTrace[debug.stepTrace.length - 1]; // last one

    expect(debugStep.type).toEqual('step');
    expect(debugStep.bpss).toBe(undefined);
    expect(debugStep.variables).toEqual(undefined);
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
    expect(debugStep.bpss).toBe(undefined);
    expect(debugStep.variables).toEqual(undefined);
    expect(debugStep.reqList).toEqual(['a', 'b']);
    expect(debugStep.selectableEvents).toEqual(['c', 'd']);
    expect(debugStep.waitList).toEqual(['e', 'f']);
    expect(debugStep.blockList).toEqual(['g', 'h']);
    expect(debugStep.selectedEvent).toBe('e');
    expect(debug.stepTrace.length).toBe(1);
    expect(debug.eventTrace.length).toBe(1);
  });
});


describe('postStep', () => {
  let debug: Debugger;

  beforeEach(() => {
    debug = new Debugger(new BpService('wss://echo.websocket.org/'));
  });

  it('cannotCallAgainToStep', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const debugStep = new DebugStep(undefined, undefined, undefined, undefined,
      undefined, undefined, undefined);
    const response = {type: 'step', bpss: debugStep.bpss, vars: undefined, vals: undefined, reqList: debugStep.reqList,
      selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList, blockList: debugStep.blockList,
      selectedEvent: debugStep.selectedEvent};
    debug.postStep(response);

    expect(debug.stdout).toBe('\nThe Program was Ended');
    expect(debug.programEnded).toBeTruthy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength);
  });

  it('callSomeTimesToPostStepWhileCannotDoAnyMore', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const debugStep = new DebugStep(undefined, undefined, undefined, undefined,
      undefined, undefined, undefined);
    const response = {type: 'step', bpss: debugStep.bpss, vars: undefined, vals: undefined, reqList: debugStep.reqList,
      selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList, blockList: debugStep.blockList,
      selectedEvent: debugStep.selectedEvent};

    let counter = 0;
    do { debug.postStep(response); } while (counter++ < 3);

    expect(debug.stdout).toBe('\nThe Program was Ended');
    expect(debug.programEnded).toBeTruthy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength);
  });

  it('regPostStep', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const debugStep = new DebugStep(undefined, undefined, ['a', 'b'], ['c', 'd'],
      ['e', 'f'], ['g', 'h'], 'e');
    const response = {type: 'step', bpss: debugStep.bpss, vars: undefined, vals: undefined, reqList: debugStep.reqList,
      selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList, blockList: debugStep.blockList,
      selectedEvent: debugStep.selectedEvent};

    debug.postStep(response);

    expect(debug.stdout).toBe('\n' + response.selectedEvent);
    expect(debug.programEnded).toBeFalsy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength + 1);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength + 1);
  });

  it('someRegPostStep', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const debugStep = new DebugStep(undefined, undefined, ['a', 'b'], ['c', 'd'],
      ['e', 'f'], ['g', 'h'], 'e');
    const response = {type: 'step', bpss: debugStep.bpss, vars: undefined, vals: undefined, reqList: debugStep.reqList,
      selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList, blockList: debugStep.blockList,
      selectedEvent: debugStep.selectedEvent};

    let counter = 0;
    do { debug.postStep(response); } while (counter++ < 3);

    expect(debug.stdout).toBe('\n' + response.selectedEvent + '\n' + response.selectedEvent +
      '\n' + response.selectedEvent + '\n' + response.selectedEvent);
    expect(debug.programEnded).toBeFalsy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength + 4);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength + 4);
  });

  it('someRegPostStepAndThenFinish', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const debugStep1 = new DebugStep(undefined, undefined, ['a', 'b'], ['c', 'd'],
      ['e', 'f'], ['g', 'h'], 'e');
    const response1 = {type: 'step', bpss: debugStep1.bpss, vars: undefined, vals: undefined, reqList: debugStep1.reqList,
      selectableEvents: debugStep1.selectableEvents, waitList: debugStep1.waitList, blockList: debugStep1.blockList,
      selectedEvent: debugStep1.selectedEvent};

    let counter = 0;
    do { debug.postStep(response1); } while (counter++ < 3);

    const debugStep2 = new DebugStep(undefined, undefined, undefined, undefined,
      undefined, undefined, undefined);

    const response2 = {type: 'step', bpss: debugStep2.bpss, vars: undefined, vals: undefined, reqList: debugStep2.reqList,
      selectableEvents: debugStep2.selectableEvents, waitList: debugStep2.waitList, blockList: debugStep2.blockList,
      selectedEvent: debugStep2.selectedEvent};

    debug.postStep(response2);

    expect(debug.stdout).toBe('\n' + response1.selectedEvent + '\n' + response1.selectedEvent +
      '\n' + response1.selectedEvent + '\n' + response1.selectedEvent + '\n' + 'The Program was Ended');
    expect(debug.programEnded).toBeTruthy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength + 4);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength + 4);
  });

  it('tryingSomeEventsAfterProgramWasEnded', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const debugStep1 = new DebugStep(undefined, undefined, undefined, undefined,
      undefined, undefined, undefined);
    const response1 = {type: 'step', bpss: debugStep1.bpss, vars: undefined, vals: undefined, reqList: debugStep1.reqList,
      selectableEvents: debugStep1.selectableEvents, waitList: debugStep1.waitList, blockList: debugStep1.blockList,
      selectedEvent: debugStep1.selectedEvent};

    debug.postStep(response1);

    const debugStep2 = new DebugStep(undefined, undefined, ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e');

    const response2 = {type: 'step', bpss: debugStep2.bpss, vars: undefined, vals: undefined, reqList: debugStep2.reqList,
      selectableEvents: debugStep2.selectableEvents, waitList: debugStep2.waitList, blockList: debugStep2.blockList,
      selectedEvent: debugStep2.selectedEvent};

    debug.postStep(response2);

    expect(debug.stdout).toBe('\n' + 'The Program was Ended');
    expect(debug.programEnded).toBeTruthy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength);
  });

  it('someRegPostStepAndThenSomeFinish', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const debugStep1 = new DebugStep(undefined, undefined, ['a', 'b'], ['c', 'd'],
      ['e', 'f'], ['g', 'h'], 'e');
    const response1 = {type: 'step', bpss: debugStep1.bpss, vars: undefined, vals: undefined, reqList: debugStep1.reqList,
      selectableEvents: debugStep1.selectableEvents, waitList: debugStep1.waitList, blockList: debugStep1.blockList,
      selectedEvent: debugStep1.selectedEvent};

    let counter = 0;
    do { debug.postStep(response1); } while (counter++ < 3);

    const debugStep2 = new DebugStep(undefined, undefined, undefined, undefined,
      undefined, undefined, undefined);

    const response2 = {type: 'step', bpss: debugStep2.bpss, vars: undefined, vals: undefined, reqList: debugStep2.reqList,
      selectableEvents: debugStep2.selectableEvents, waitList: debugStep2.waitList, blockList: debugStep2.blockList,
      selectedEvent: debugStep2.selectedEvent};

    counter = 0;
    do { debug.postStep(response2); } while (counter++ < 3);

    expect(debug.stdout).toBe('\n' + response1.selectedEvent + '\n' + response1.selectedEvent +
      '\n' + response1.selectedEvent + '\n' + response1.selectedEvent + '\n' + 'The Program was Ended');
    expect(debug.programEnded).toBeTruthy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength + 4);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength + 4);
  });

  it('postStepWithoutAnyEvent', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const debugStep = new DebugStep(undefined, undefined, ['a', 'b'], ['c', 'd'],
      ['e', 'f'], ['g', 'h'], undefined);
    const response = {type: 'step', bpss: debugStep.bpss, vars: undefined, vals: undefined, reqList: debugStep.reqList,
      selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList, blockList: debugStep.blockList,
      selectedEvent: debugStep.selectedEvent};

    debug.postStep(response);

    expect(debug.stdout).toBe('');
    expect(debug.programEnded).toBeFalsy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength + 1);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength + 1);
  });

  it('somePostStepWithoutAnyEvent', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const debugStep = new DebugStep(undefined, undefined, ['a', 'b'], ['c', 'd'],
      ['e', 'f'], ['g', 'h'], undefined);
    const response = {type: 'step', bpss: debugStep.bpss, vars: undefined, vals: undefined, reqList: debugStep.reqList,
      selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList, blockList: debugStep.blockList,
      selectedEvent: debugStep.selectedEvent};

    let counter = 0;
    do { debug.postStep(response); } while (counter++ < 3);

    expect(debug.stdout).toBe('');
    expect(debug.programEnded).toBeFalsy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength + 4);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength + 4);
  });

  it('somePostStepWithoutAnyEventCombineWithSomeRegEvents', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const debugStep = new DebugStep(undefined, undefined, ['a', 'b'], ['c', 'd'],
      ['e', 'f'], ['g', 'h'], undefined);
    const response1 = {type: 'step', bpss: debugStep.bpss, vars: undefined, vals: undefined, reqList: debugStep.reqList,
      selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList, blockList: debugStep.blockList,
      selectedEvent: debugStep.selectedEvent};
    const response2 = {type: 'step', bpss: debugStep.bpss, vars: undefined, vals: undefined, reqList: debugStep.reqList,
      selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList, blockList: debugStep.blockList,
      selectedEvent: 'e'};

    let counter = 0;
    do {
      debug.postStep(response1);
      debug.postStep(response2);
    } while (counter++ < 3);

    expect(debug.stdout).toBe('\n' + response2.selectedEvent + '\n' + response2.selectedEvent +
      '\n' + response2.selectedEvent + '\n' + response2.selectedEvent);
    expect(debug.programEnded).toBeFalsy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength + 8);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength + 8);
  });
});
