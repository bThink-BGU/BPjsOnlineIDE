import {runCL} from '../CL/Runner';

export function Runner() {
  this.isError = false;
  this.stdout = '';
  this.stderr = '';
}

export function run() {
  runCL.func();
}

export function postRun(outputStreamClass, response) {
  this.stdout = response.message;
  outputStreamClass.output += '\n' + response.message;
}



