import {runCL} from '../CL/Runner';

export const runner = {
  isError: false,
  stdout: '',
  stderr: '',
};

export function run() {
  return new Promise((resolve, reject) => {
    runCL.func().then((codeOutput) => {
      runner.stdout = codeOutput.toString();
      runner.isError = false;
      resolve(runner.stdout);
    }, (errorMessage) => {
      runner.stderr = errorMessage.toString();
      runner.isError = true;
      reject(runner.stderr);
    });
  });

}



