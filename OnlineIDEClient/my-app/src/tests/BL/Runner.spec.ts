import {Runner} from '../../BL/Runner';
import {BpService} from '../../CL/BpService';

describe('run', () => {
  let runner: Runner;

  beforeEach(() => {
    runner = new Runner(new BpService('wss://echo.websocket.org/'));
  });

  // 3.1
  it('run', done => {
    const observer = {
      next: () => {
        expect(runner.isError).toBeFalsy();
        expect(runner.stdout).toBe('');
        done();
      },
      error: () => {
        fail();
        done();
      }
    };
    runner.bpService.subscribeObserver(observer);
    runner.setIsError(true);
    runner.setStdout('stdout');
    runner.run();
  });
});

describe('postRun', () => {
  let runner: Runner;

  beforeEach(() => {
    runner = new Runner(new BpService('wss://echo.websocket.org/'));
  });

  // 3.2
  it('stderrCase', () => {
    runner.postRun({type: 'error', message: 'test'});

    expect(runner.isError).toBeTruthy();
    expect(runner.stdout).toBe('>\ttest');
  });

  // 3.3
  it('stderrCaseAfterSomeEvents', () => {
    runner.setStdout('testOK');
    runner.setIsError(false);
    runner.postRun({type: 'error', message: 'testERROR'});

    expect(runner.isError).toBeTruthy();
    expect(runner.stdout).toBe('>\ttestERROR');
  });

  // 3.4
  it('stdoutCase', () => {
    runner.setStdout('');
    runner.setIsError(false);
    runner.postRun({type: 'run', message: 'testOK'});

    expect(runner.isError).toBeFalsy();
    expect(runner.stdout).toBe('>\ttestOK\n');
  });

  // 3.5
  it('stdoutCaseAfterSomeEvents', () => {
    runner.setStdout('>\ttestOK');
    runner.setIsError(false);
    runner.postRun({type: 'run', message: 'testOK'});

    expect(runner.isError).toBeFalsy();
    expect(runner.stdout).toBe('>\ttestOK>\ttestOK\n');
  });

  // 3.6
  it('errorAfterSomeEventsWorks', () => {
    let counter = 0;
    do { runner.postRun({type: 'run', message: 'testOK'}); }
    while (counter++ < 3);
    runner.postRun({type: 'error', message: 'testERROR'});

    expect(runner.isError).toBeTruthy();
    expect(runner.stdout).toBe('>\ttestERROR');
  });

  // 3.7
  it('allEventsWorks', () => {
    let counter = 0;
    do { runner.postRun({type: 'run', message: 'testOK'}); }
    while (counter++ < 3);

    expect(runner.isError).toBeFalsy();
    expect(runner.stdout).toBe('>\ttestOK\n>\ttestOK\n>\ttestOK\n>\ttestOK\n');
  });
});

describe('stop', () => {
  let runner: Runner;

  beforeEach(() => {
    runner = new Runner(new BpService('wss://echo.websocket.org/'));
  });

  // 3.8
  it('stop', done => {
    const observer = {
      next: () => {
        expect(runner.stop).toBeTruthy();
        done();
      },
      error: () => {
        fail();
        done();
      }
    };
    runner.bpService.subscribeObserver(observer);
    runner.stopRun();
  });
});
