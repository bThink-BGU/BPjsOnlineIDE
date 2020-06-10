import {BpService} from '../../CL/BpService';
import {Debugger} from '../../BL/Debugger';
import {DebugStep} from '../../CL/DebugStep';
import {variable} from '@angular/compiler/src/output/output_ast';
import {BThreadInfo} from '../../CL/BThreadInfo';
import {Program} from '../../BL/Program';
import {BreakPoint} from '../../BL/BreakPoint';

describe('step', () => {
  let debug: Debugger;

  beforeEach(() => {
    debug = new Debugger(new BpService('wss://echo.websocket.org/'));
  });

  // 4.1
  it('stepTraceIsEmpty', done => {
    const observer = {
      next: (response) => {
        expect(response.type).toBe('step');
        expect(response.bpss).toBe(undefined);
        expect(response.globalVariables).toBe(undefined);
        expect(response.bThreads.length).toEqual(0);
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

  // 4.2
  it('stepTraceNotEmpty', done => {
    const observer = {
      next: (response) => {
        expect(response.type).toEqual('step');
        expect(response.bpss).toBe(undefined);
        expect(response.globalVariables).toEqual(undefined);
        expect(response.bThreads.length).toEqual(0);
        expect(response.reqList).toEqual(['a', 'b']);
        expect(response.selectableEvents).toEqual(['c', 'd']);
        expect(response.waitList).toEqual(['e', 'f']);
        expect(response.blockList).toEqual(['g', 'h']);
        expect(response.selectedEvent).toBe(  'e');
        done();
      },
      error: () => {
        fail();
        done();
      }
    };
    debug.bpService.subscribeObserver(observer);
    debug.stepTrace.push(new DebugStep(undefined, undefined, [], ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e', 1));
    debug.step();
  });
});

describe('stepBack', () => {
  let debug: Debugger;

  beforeEach(() => {
    debug = new Debugger(new BpService('wss://echo.websocket.org/'));
  });

  // 4.3
  it('cantDoStepBack1', () => {
    debug.stepBack();
    expect(debug.stepTrace.length).toBe(0);
    expect(debug.eventTrace.length).toBe(0);
  });

  // 4.4
  it('cantDoStepBack2', () => {
    debug.stepTrace.push(new DebugStep(undefined, undefined, [], ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e', 1));
    debug.eventTrace.push('e');

    debug.stepBack();

    expect(debug.stepTrace.length).toBe(1);
    expect(debug.eventTrace.length).toBe(1);
  });

  // 4.5
  it('stepBack', () => {
    debug.stepTrace.push(new DebugStep(undefined, undefined, [], ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e', 1));
    debug.eventTrace.push('e');
    debug.stepTrace.push(new DebugStep(undefined, undefined, [], undefined,
      undefined, undefined, undefined, undefined, undefined));
    debug.eventTrace.push('');

    debug.stepBack();

    const debugStep = debug.stepTrace[debug.stepTrace.length - 1]; // last one

    expect(debugStep.type).toEqual('step');
    expect(debugStep.bpss).toBe(undefined);
    // expect(debugStep.variables).toEqual(undefined); TODO
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

  // 4.6
  it('negativeStepNumber', () => {
    let counter = 0;

    do {
      debug.stepTrace.push(new DebugStep(undefined, undefined, [], ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e', 1));
      debug.eventTrace.push('e');
    } while (counter++ < 3);

    debug.stepBackToIndex(-1);

    expect(debug.stepTrace.length).toBe(4);
    expect(debug.eventTrace.length).toBe(4);
  });

  // 4.7
  it('StepNumberEqualTo0', () => {
    let counter = 0;

    do {
      debug.stepTrace.push(new DebugStep(undefined, undefined, [], ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e', 1));
      debug.eventTrace.push('e');
    } while (counter++ < 3);

    debug.stepBackToIndex(0);

    expect(debug.stepTrace.length).toBe(4);
    expect(debug.eventTrace.length).toBe(4);
  });

  // 4.8
  it('StepNumberBiggerThenLength', () => {
    let counter = 0;

    debug.setStepTrace([]);
    debug.setEventTrace([]);

    do {
      debug.stepTrace.push(new DebugStep(undefined, undefined, [], ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e', 1));
      debug.eventTrace.push('e');
    } while (counter++ < 3);

    debug.stepBackToIndex(debug.stepTrace.length + 1);

    expect(debug.stepTrace.length).toBe(4);
    expect(debug.eventTrace.length).toBe(4);
  });

  // 4.9
  it('StepNumberEqualToLength', () => {
    let counter = 0;

    do {
      debug.stepTrace.push(new DebugStep(undefined, undefined, [], ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e', 1));
      debug.eventTrace.push('e');
    } while (counter++ < 3);

    debug.stepBackToIndex(debug.stepTrace.length);

    expect(debug.stepTrace.length).toBe(4);
    expect(debug.eventTrace.length).toBe(4);
  });

  // 4.10
  it('stepBack', () => {
    debug.stepTrace.push(new DebugStep(undefined, undefined, [], ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e', 1));
    debug.eventTrace.push('e');

    debug.stepTrace.push(new DebugStep(undefined, undefined, [], ['aa', 'bb'],
      ['cc', 'dd'], ['ee', 'ff'], ['gg', 'hh'], 'ee', 1));
    debug.eventTrace.push('e');

    let counter = 0;

    do {
      debug.stepTrace.push(new DebugStep(undefined, undefined, [], ['av', 'bv'],
        ['cv', 'dv'], ['ev', 'fv'], ['gv', 'hv'], 'e', 1));
      debug.eventTrace.push('ev');
    } while (counter++ < 3);

    debug.stepTrace.push(new DebugStep(undefined, undefined, [], undefined,
      undefined, undefined, undefined, undefined, undefined));
    debug.eventTrace.push('');

    debug.stepBackToIndex(2);

    let debugStep = debug.stepTrace[debug.stepTrace.length - 1]; // last one

    expect(debugStep.type).toEqual('step');
    expect(debugStep.bpss).toBe(undefined);
    // expect(debugStep.variables).toEqual(undefined);
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
    // expect(debugStep.variables).toEqual(undefined); TODO
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

  // 4.11
  it('cannotCallAgainToStep', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const debugStep = new DebugStep(undefined, undefined, [], undefined, undefined,
      undefined, undefined, undefined, undefined);
    const response = {type: 'step', bpss: debugStep.bpss, globalVars: undefined, globalVals: undefined,
      reqList: debugStep.reqList, selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList,
      blockList: debugStep.blockList, selectedEvent: debugStep.selectedEvent};
    debug.postStep(response);

    expect(debug.stdout).toBe('\nThe Program Ended');
    expect(debug.programEnded).toBeTruthy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength);
  });

  // 4.12
  it('callSomeTimesToPostStepWhileCannotDoAnyMore', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const debugStep = new DebugStep(undefined, undefined, [], undefined, undefined,
      undefined, undefined, undefined, undefined);
    const response = {type: 'step', bpss: debugStep.bpss, globalVars: undefined, globalVals: undefined,
      reqList: debugStep.reqList, selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList,
      blockList: debugStep.blockList, selectedEvent: debugStep.selectedEvent};

    let counter = 0;
    do { debug.postStep(response); } while (counter++ < 3);

    expect(debug.stdout).toBe('\nThe Program Ended');
    expect(debug.programEnded).toBeTruthy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength);
  });
//
  // 4.13
  it('regPostStep', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const bThreads = [];
    for (let i = 0; i < 3; i ++) {
      bThreads.push(new BThreadInfo(i + '', i, i + 2, undefined, i - 1));
    }

    const debugStep = new DebugStep(undefined, undefined, bThreads, ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e', 1);
    const response = {type: 'step', bpss: debugStep.bpss, globalVars: undefined, globalVals: undefined, bThreads: [],
      reqList: debugStep.reqList, selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList,
      blockList: debugStep.blockList, selectedEvent: debugStep.selectedEvent};

    debug.postStep(response);

    expect(debug.stdout).toBe('\n' + response.selectedEvent);
    expect(debug.programEnded).toBeFalsy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength + 1);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength + 1);
  });
//
  // 4.14
  it('someRegPostStep', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const bThreads = [];
    for (let i = 0; i < 3; i ++) {
      bThreads.push(new BThreadInfo(i + '', i, i + 2, undefined, i - 1));
    }

    const debugStep = new DebugStep(undefined, undefined, bThreads, ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e', 1);
    const response = {type: 'step', bpss: debugStep.bpss, globalVars: undefined, globalVals: undefined, bThreads: [],
      reqList: debugStep.reqList, selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList,
      blockList: debugStep.blockList, selectedEvent: debugStep.selectedEvent};

    let counter = 0;
    do { debug.postStep(response); } while (counter++ < 3);

    expect(debug.stdout).toBe('\n' + response.selectedEvent + '\n' + response.selectedEvent +
      '\n' + response.selectedEvent + '\n' + response.selectedEvent);
    expect(debug.programEnded).toBeFalsy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength + 4);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength + 4);
  });

  // 4.15
  it('someRegPostStepAndThenFinish', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const bThreads = [];
    for (let i = 0; i < 3; i ++) {
      bThreads.push(new BThreadInfo(i + '', i, i + 2, undefined, i - 1));
    }


    const debugStep1 = new DebugStep(undefined, undefined, bThreads, ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e', 1);
    const response1 = {type: 'step', bpss: debugStep1.bpss, globalVars: undefined, globalVals: undefined, bThreads: [],
      reqList: debugStep1.reqList, selectableEvents: debugStep1.selectableEvents, waitList: debugStep1.waitList,
      blockList: debugStep1.blockList, selectedEvent: debugStep1.selectedEvent};

    let counter = 0;
    do { debug.postStep(response1); } while (counter++ < 3);

    const debugStep2 = new DebugStep(undefined, undefined, [], undefined,
      undefined, undefined, undefined, undefined, undefined);

    const response2 = {type: 'step', bpss: debugStep2.bpss, globalVars: undefined, globalVals: undefined, bThreads: [],
      reqList: debugStep2.reqList, selectableEvents: debugStep2.selectableEvents, waitList: debugStep2.waitList,
      blockList: debugStep2.blockList, selectedEvent: debugStep2.selectedEvent};

    debug.postStep(response2);

    expect(debug.stdout).toBe('\n' + response1.selectedEvent + '\n' + response1.selectedEvent +
      '\n' + response1.selectedEvent + '\n' + response1.selectedEvent + '\n' + 'The Program Ended');
    expect(debug.programEnded).toBeTruthy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength + 4);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength + 4);
  });

  // 4.16
  it('tryingSomeEventsAfterProgramWasEnded', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const debugStep1 = new DebugStep(undefined, undefined, [], undefined,
      undefined, undefined, undefined, undefined, undefined);
    const response1 = {type: 'step', bpss: debugStep1.bpss, globalVars: undefined, globalVals: undefined, bThreads: [],
      reqList: debugStep1.reqList, selectableEvents: debugStep1.selectableEvents, waitList: debugStep1.waitList,
      blockList: debugStep1.blockList, selectedEvent: debugStep1.selectedEvent};

    debug.postStep(response1);

    const bThreads = [];
    for (let i = 0; i < 3; i ++) {
      bThreads.push(new BThreadInfo(i + '', i, i + 2, undefined, i - 1));
    }

    const debugStep2 = new DebugStep(undefined, undefined, bThreads, ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e', 1);

    const response2 = {type: 'step', bpss: debugStep2.bpss, globalVars: undefined, globalVals: undefined, bThreads: [],
      reqList: debugStep2.reqList, selectableEvents: debugStep2.selectableEvents, waitList: debugStep2.waitList,
      blockList: debugStep2.blockList, selectedEvent: debugStep2.selectedEvent};

    debug.postStep(response2);

    expect(debug.stdout).toBe('\n' + 'The Program Ended');
    expect(debug.programEnded).toBeTruthy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength);
  });

  // 4.17
  it('someRegPostStepAndThenSomeFinish', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const bThreads = [];
    for (let i = 0; i < 3; i ++) {
      bThreads.push(new BThreadInfo(i + '', i, i + 2, undefined, i - 1));
    }

    const debugStep1 = new DebugStep(undefined, undefined, [], ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], 'e', 1);
    const response1 = {type: 'step', bpss: debugStep1.bpss, globalVars: undefined, globalVals: undefined,
      bThreads, reqList: debugStep1.reqList, selectableEvents: debugStep1.selectableEvents,
      waitList: debugStep1.waitList, blockList: debugStep1.blockList, selectedEvent: debugStep1.selectedEvent};

    let counter = 0;
    do { debug.postStep(response1); } while (counter++ < 3);

    const debugStep2 = new DebugStep(undefined, undefined, [], undefined,
      undefined, undefined, undefined, undefined, undefined);

    const response2 = {type: 'step', bpss: debugStep2.bpss, globalVars: undefined, globalVals: undefined, bThreads,
      reqList: debugStep2.reqList, selectableEvents: debugStep2.selectableEvents, waitList: debugStep2.waitList,
      blockList: debugStep2.blockList, selectedEvent: debugStep2.selectedEvent};

    counter = 0;
    do { debug.postStep(response2); } while (counter++ < 3);

    expect(debug.stdout).toBe('\n' + response1.selectedEvent + '\n' + response1.selectedEvent +
      '\n' + response1.selectedEvent + '\n' + response1.selectedEvent + '\n' + 'The Program Ended');
    expect(debug.programEnded).toBeTruthy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength + 4);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength + 4);
  });

  // 4.18
  it('postStepWithoutAnyEvent', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const debugStep = new DebugStep(undefined, undefined, [], ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], undefined, 1);
    const response = {type: 'step', bpss: debugStep.bpss, globalVars: undefined, globalVals: undefined, bThreads: [],
      reqList: debugStep.reqList, selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList,
      blockList: debugStep.blockList, selectedEvent: debugStep.selectedEvent};

    debug.postStep(response);

    expect(debug.stdout).toBe('');
    expect(debug.programEnded).toBeFalsy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength + 1);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength + 1);
  });

  // 4.19
  it('somePostStepWithoutAnyEvent', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const debugStep = new DebugStep(undefined, undefined, [], ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], undefined, 1);
    const response = {type: 'step', bpss: debugStep.bpss, globalVars: undefined, globalVals: undefined, bThreads: [],
      reqList: debugStep.reqList, selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList,
      blockList: debugStep.blockList, selectedEvent: debugStep.selectedEvent};

    let counter = 0;
    do { debug.postStep(response); } while (counter++ < 3);

    expect(debug.stdout).toBe('');
    expect(debug.programEnded).toBeFalsy();
    expect(debug.stepTrace.length).toBe(beforeStepTraceLength + 4);
    expect(debug.eventTrace.length).toBe(beforeEventTraceLength + 4);
  });

  // 4.20
  it('somePostStepWithoutAnyEventCombineWithSomeRegEvents', () => {
    const beforeStepTraceLength = debug.stepTrace.length;
    const beforeEventTraceLength = debug.eventTrace.length;

    const debugStep = new DebugStep(undefined, undefined, [], ['a', 'b'],
      ['c', 'd'], ['e', 'f'], ['g', 'h'], undefined, 1);
    const response1 = {type: 'step', bpss: debugStep.bpss, globalVars: undefined, globalVals: undefined, bThreads: [],
      reqList: debugStep.reqList, selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList,
      blockList: debugStep.blockList, selectedEvent: debugStep.selectedEvent};
    const response2 = {type: 'step', bpss: debugStep.bpss, globalVars: undefined, globalVals: undefined, bThreads: [],
      reqList: debugStep.reqList, selectableEvents: debugStep.selectableEvents, waitList: debugStep.waitList,
      blockList: debugStep.blockList, selectedEvent: 'e'};

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

describe('breakPoints', () => {
  let debug: Debugger;

  beforeEach(() => {
    debug = new Debugger(new BpService('wss://echo.websocket.org/'));
  });

  // 4.21
  it('addBreakPoint', () => {
    const breakPointsLength = debug.breakPoints.length;
    debug.addBreakPoint(1);
    expect(debug.breakPoints.length).toBe(breakPointsLength + 1);
    expect(debug.breakPoints[0].line).toBe(1);
  });

  // 4.22
  it('removeExistingBreakPoint', () => {
    debug.breakPoints.push(new BreakPoint(1));
    const breakPointsLength = debug.breakPoints.length;
    debug.removeBreakPoint(1);
    expect(debug.breakPoints.length).toBe(breakPointsLength - 1);
  });

  // 4.23
  it('removeNotExistingBreakPoint', () => {
    debug.breakPoints.push(new BreakPoint(1));
    const breakPointsLength = debug.breakPoints.length;
    debug.removeBreakPoint(2);
    expect(debug.breakPoints.length).toBe(1);
    expect(debug.breakPoints[0].line).toBe(1);
  });
});

describe('stepToBreakPoint', () => {
  let debug: Debugger;

  beforeEach(() => {
    debug = new Debugger(new BpService('wss://echo.websocket.org/'));

    spyOn(debug, 'step').and.callFake(function() {
      const bThreads = [];
      bThreads.push(new BThreadInfo('first', 1, 2, undefined,
        3));
      bThreads.push(new BThreadInfo('second', 4, 5, undefined,
        6));
      debug.stepTrace.push(new DebugStep([], undefined, bThreads, ['a'],
        [], ['b', 'c'], ['d', 'e'], 'e', 1));
    });
  });

  // 4.24
  it('stepTraceWhenTheLastStepDoesNotHaveALineNumberOfBreakPoint', () => {
    const bThreads = [];
    bThreads.push(new BThreadInfo('first', 1, 2, undefined,
      3));
    bThreads.push(new BThreadInfo('second', 4, 5, undefined,
      6));

    debug.breakPoints.push(new BreakPoint(1));
    debug.stepToBreakPoint();

    const lastStep = debug.getLastStep();

    expect(lastStep.bpss).toEqual([]);
    expect(lastStep.bThreads.length).toBe(2);
    expect(lastStep.bThreads[0].bThreadName).toBe('first');
    expect(lastStep.bThreads[0].firstLinePC).toBe(1);
    expect(lastStep.bThreads[0].localShift).toBe(2);
    expect(lastStep.bThreads[1].bThreadName).toBe('second');
    expect(lastStep.bThreads[1].firstLinePC).toBe(4);
    expect(lastStep.bThreads[1].localShift).toBe(5);
    expect(lastStep.reqList.length).toBe(1);
    expect(lastStep.waitList.length).toBe(2);
    expect(lastStep.blockList.length).toBe(2);
    expect(lastStep.selectableEvents.length).toBe(0);
    expect(lastStep.selectedEvent).toBe('e');
    expect(lastStep.line).toBe(1);
  });

  // 4.25
  it('stepTraceWhenTheLastStepHasALineOfBreakPoint', () => {
    debug.stepTrace.push(new DebugStep([], undefined, [], ['1', '4'],
      ['1'], ['2'], ['3'], 'e2', 2));

    debug.breakPoints.push(new BreakPoint(1));
    debug.stepToBreakPoint();

    const lastStep = debug.getLastStep();

    expect(lastStep.bpss).toEqual([]);
    expect(lastStep.bThreads.length).toBe(2);
    expect(lastStep.bThreads[0].bThreadName).toBe('first');
    expect(lastStep.bThreads[0].firstLinePC).toBe(1);
    expect(lastStep.bThreads[0].localShift).toBe(2);
    expect(lastStep.bThreads[1].bThreadName).toBe('second');
    expect(lastStep.bThreads[1].firstLinePC).toBe(4);
    expect(lastStep.bThreads[1].localShift).toBe(5);
    expect(lastStep.reqList.length).toBe(1);
    expect(lastStep.waitList.length).toBe(2);
    expect(lastStep.blockList.length).toBe(2);
    expect(lastStep.selectableEvents.length).toBe(0);
    expect(lastStep.selectedEvent).toBe('e');
    expect(lastStep.line).toBe(1);
  });

  // 4.26
  it('theProgramIsEnded', () => {
    debug.stepTrace.push(new DebugStep([], undefined, [], ['1', '4'],
      ['1'], ['2'], ['3'], 'e2', 2));

    debug.programEnded = true;

    debug.breakPoints.push(new BreakPoint(5));
    debug.stepToBreakPoint();

    const lastStep = debug.getLastStep();

    expect(lastStep.bpss).toEqual([]);
    expect(lastStep.bThreads.length).toBe(0);
    expect(lastStep.reqList.length).toBe(2);
    expect(lastStep.waitList.length).toBe(1);
    expect(lastStep.blockList.length).toBe(1);
    expect(lastStep.selectableEvents.length).toBe(1);
    expect(lastStep.selectedEvent).toBe('e2');
    expect(lastStep.line).toBe(2);
  });
});

describe('stepBackToBreakPoint', () => {
  let debug: Debugger;

  beforeEach(() => {
    debug = new Debugger(new BpService('wss://echo.websocket.org/'));
  });

  // 4.27
  it('stepBackUntilBreakPoint', () => {
    const bThreads = [];
    bThreads.push(new BThreadInfo('first', 1, 2, undefined,
      3));
    bThreads.push(new BThreadInfo('second', 4, 5, undefined,
      6));

    for (let i = 2; i < 5; i ++)
      debug.stepTrace.push(new DebugStep([], undefined, [], ['a', 'b'],
        ['c'], ['ee', '4'], ['3', '5', '6'], 'e' + i, i));

    debug.stepTrace.push(new DebugStep([], undefined, bThreads, ['1', '4'],
      [], ['2'], ['3'], 'e', 1));

    for (let i = 2; i < 5; i ++)
      debug.stepTrace.push(new DebugStep([], undefined, [], ['a', 'b'],
        ['c'], ['ee', '4'], ['3', '5', '6'], 'e' + i, i));

    debug.breakPoints.push(new BreakPoint(1));
    debug.stepBackToBreakPoint();

    const lastStep = debug.getLastStep();

    expect(lastStep.bpss).toEqual([]);
    expect(lastStep.bThreads.length).toBe(2);
    expect(lastStep.bThreads[0].bThreadName).toBe('first');
    expect(lastStep.bThreads[0].firstLinePC).toBe(1);
    expect(lastStep.bThreads[0].localShift).toBe(2);
    expect(lastStep.bThreads[1].bThreadName).toBe('second');
    expect(lastStep.bThreads[1].firstLinePC).toBe(4);
    expect(lastStep.bThreads[1].localShift).toBe(5);
    expect(lastStep.reqList.length).toBe(2);
    expect(lastStep.waitList.length).toBe(1);
    expect(lastStep.blockList.length).toBe(1);
    expect(lastStep.selectableEvents.length).toBe(0);
    expect(lastStep.selectedEvent).toBe('e');
    expect(lastStep.line).toBe(1);
  });

  // 4.28
  it('stepBackUntilTheFirst', () => {
    const bThreads = [];
    bThreads.push(new BThreadInfo('first', 1, 2, undefined,
      3));
    bThreads.push(new BThreadInfo('second', 4, 5, undefined,
      6));

    debug.stepTrace.push(new DebugStep([], undefined, bThreads, ['1', '4'],
      [], ['2'], ['3'], 'e', 1));

    for (let i = 2; i < 5; i ++)
      debug.stepTrace.push(new DebugStep([], undefined, [], ['a', 'b'],
        ['c'], ['ee', '4'], ['3', '5', '6'], 'e' + i, i));

    debug.stepBackToBreakPoint();

    const lastStep = debug.getLastStep();

    expect(lastStep.bpss).toEqual([]);
    expect(lastStep.bThreads.length).toBe(2);
    expect(lastStep.bThreads[0].bThreadName).toBe('first');
    expect(lastStep.bThreads[0].firstLinePC).toBe(1);
    expect(lastStep.bThreads[0].localShift).toBe(2);
    expect(lastStep.bThreads[1].bThreadName).toBe('second');
    expect(lastStep.bThreads[1].firstLinePC).toBe(4);
    expect(lastStep.bThreads[1].localShift).toBe(5);
    expect(lastStep.reqList.length).toBe(2);
    expect(lastStep.waitList.length).toBe(1);
    expect(lastStep.blockList.length).toBe(1);
    expect(lastStep.selectableEvents.length).toBe(0);
    expect(lastStep.selectedEvent).toBe('e');
    expect(lastStep.line).toBe(1);
  });
});



