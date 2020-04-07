import {init, program} from '../../../../../../Desktop/BPjsOnlineIDE - backup/my-app/src/BL/Program';
import {runCL} from '../../../../../../Desktop/BPjsOnlineIDE - backup/my-app/src/CL/Runner';
import {run, runner} from '../../../../../../Desktop/BPjsOnlineIDE - backup/my-app/src/BL/Runner';


describe('initTest', () => {
  it('send code', () => {
    const code = 'my_code';
    init(code);
    expect(program.code).toEqual(code);
  });
});

describe('runTest', () => {
  beforeEach(() => {
    runner.isError = false;
    runner.stdout = '';
    runner.stderr = '';
  })
  it('output', () => {
    runCL.func =  successCLStub;
    run().then((param) => {
      expect(runner.isError).toEqual(false);
      expect(runner.stdout).toEqual('success!');
      expect(runner.stderr).toEqual('');
    }, (param) => {});
  });
  it('error', () => {
    runCL.func =  errorCLStub;
    run().then((param) => {}, (param) => {
      expect(runner.isError).toEqual(true);
      expect(runner.stdout).toEqual('');
      expect(runner.stderr).toEqual('error!');
    });
  });
});


function successCLStub() {
  return new Promise((response, error) => response('success!'));
}

function errorCLStub() {
  return new Promise((response, error) => error('error!'));
}
