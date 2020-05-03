import {Runner} from '../../BL/Runner';
import {BpService} from '../../CL/BpService';

describe('run', () => {
  let runner: Runner;

  beforeEach(() => {
    runner = new Runner(new BpService('wss://echo.websocket.org/'));
  });

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

  it('stderrCase', () => {
    runner.postRun({type: 'error', message: 'test'});

    expect(runner.isError).toBeTruthy();
    expect(runner.stdout).toBe('test');
  });

  it('stderrCaseAfterSomeEvents', () => {
    runner.setStdout('testOK');
    runner.setIsError(false);
    runner.postRun({type: 'error', message: 'testERROR'});

    expect(runner.isError).toBeTruthy();
    expect(runner.stdout).toBe('testERROR');
  });

  it('stdoutCase', () => {
    runner.setStdout('');
    runner.setIsError(false);
    runner.postRun({type: 'run', message: 'testOK'});

    expect(runner.isError).toBeFalsy();
    expect(runner.stdout).toBe('testOK\n');
  });

  it('stdoutCaseAfterSomeEvents', () => {
    runner.setStdout('testOK');
    runner.setIsError(false);
    runner.postRun({type: 'run', message: 'testOK'});

    expect(runner.isError).toBeFalsy();
    expect(runner.stdout).toBe('testOKtestOK\n');
  });

  it('errorAfterSomeEventsWorks', () => {
    let counter = 0;
    do { runner.postRun({type: 'run', message: 'testOK'}); }
    while (counter++ < 3);
    runner.postRun({type: 'error', message: 'testERROR'});

    expect(runner.isError).toBeTruthy();
    expect(runner.stdout).toBe('testERROR');
  });

  it('allEventsWorks', () => {
    let counter = 0;
    do { runner.postRun({type: 'run', message: 'testOK'}); }
    while (counter++ < 3);

    expect(runner.isError).toBeFalsy();
    expect(runner.stdout).toBe('testOK\ntestOK\ntestOK\ntestOK\n');
  });
});
