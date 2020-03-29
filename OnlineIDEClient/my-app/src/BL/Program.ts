import {initCL} from '../CL/Program';
import {WebSocketService} from '../CL/Connection';
import {run, postRun} from './Runner';
import {postStep} from './Debugger';


export const Program = {
  code: ''
};

export function subscribeOutputStream(outputStreamClass) {
  const responseHandlers = {init: run, run: postRun, nextStep: postStep};
  const observer = {
    next: (response) => {
      responseHandlers[response.type](outputStreamClass, response);
    },
    error: (error) => {
      outputStreamClass.output = error;
    }
  };
  WebSocketService.getObservable().subscribe(observer);
}

export function init(code) {
  Program.code = code;
  initCL.func(code);
}


