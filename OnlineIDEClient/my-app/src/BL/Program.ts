import {initCL, addExternalEventCL} from '../CL/BpService'
import {WebSocketService} from '../CL/Connection';
import {Runner} from './Runner';
import {Debugger} from './Debugger';


export class Program {

  private runner: Runner;
  private debugger: Debugger;
  private code: string;

  constructor() {
    this.runner = new Runner();
    this.debugger = new Debugger();
    this.code = '';
  }

  subscribeOutputStream(outputStreamClass) {
    const responseHandlers = {init: this.runner.run, run: this.runner.postRun, nextStep: this.debugger.postStep};
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

  init(code) {
    this.code = code;
    initCL(code);
  }

  addExternalEvent(bEvent) {
    addExternalEventCL(bEvent);
  }
}


