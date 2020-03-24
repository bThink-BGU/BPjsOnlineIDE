import {initCL} from '../CL/Program';
import {WebSocketService} from '../CL/Connection';
import {run, postRun} from './Runner';


export const Program = {
  code: ''
};

export function subscribeOutputStream(outputStreamClass) {
  const responseHandlers = {init : run, run : postRun};
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
  code = code;
  initCL.func(code);
}


