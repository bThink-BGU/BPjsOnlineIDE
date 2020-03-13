import {runCL} from '../../../../../../Desktop/BPjsOnlineIDE - backup/my-app/src/CL/Runner';
import {initCL} from '../../../../../../Desktop/BPjsOnlineIDE - backup/my-app/src/CL/Program';
import {runSL, initSL} from '../../../../../../Desktop/BPjsOnlineIDE - backup/my-app/src/SL/Program';


describe('initTest', () => {
  it('send code', () => {
    initCL.func = initCLStub;
    const code = 'my_code';
    const res = initSL(code);
    res.then((param) => {
      expect(param).toEqual(code);
    }, (param) => {});
  });
});

describe('runTest', () => {
  it('output', () => {
    runCL.func = successCLStub;
    const res = runSL();
    res.then((param) => {
      expect(param).toEqual('success!');
    }, (param) => {});
  });
  it('error', () => {
    runCL.func =  errorCLStub;
    const res = runSL();
    res.then((param) => {
      expect(param).toEqual('error!');
    }, (param) => {});
  });
});


function successCLStub() {
  return new Promise((response, error) => response('success!'));
}

function errorCLStub() {
  return new Promise((response, error) => error('error!'));
}

function initCLStub(code) {
  return new Promise((response, error) => response(code));
}
