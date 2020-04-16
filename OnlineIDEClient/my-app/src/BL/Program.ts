import {initCL, addExternalEventCL, stepCL} from '../CL/BpService';
import {WebSocketService} from '../CL/Connection';
import {Runner} from './Runner';
import {Debugger} from './Debugger';


export class Program {

  private _runner: Runner;
  private _debugger: Debugger;
  private code: string;

  constructor() {
    this._runner = new Runner();
    this._debugger = new Debugger();
    this.code = '';
  }

  subscribeOutputStream(sharedService) {
    // const responseHandlers = {init: this.debugger.step /*this.runner.run*/, run: this.runner.postRun,
    //   step: this.debugger.postStep};
    const observer = {
      next: (response) => {
        switch (response.type) {
          case 'initRun': {
            this._runner.run();
            break;
          }
          case 'initStep': {
            // nothing
            break;
          }
          case 'run':
          case 'error': {
            this._runner.postRun(sharedService, response);
            break;
          }
          case 'step': {
            this._debugger.postStep(sharedService, response);
            break;
          }
        }
        // responseHandlers[response.type](sharedService, response);
      },
      error: (error) => {
        sharedService.sharedOutput = error;
      }
    };
    WebSocketService.getObservable().subscribe(observer);
  }

  init(type, code) {
    this.code = code;
    initCL(type, code);
  }

  addExternalEvent(bEvent) {
    addExternalEventCL(bEvent);
  }


  get debugger(): Debugger {
    return this._debugger;
  }

  get runner(): Runner{
    return this._runner;
  }
}


