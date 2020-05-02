import {Runner} from './Runner';
import {Debugger} from './Debugger';
import {BpService} from '../CL/BpService';

export class Program {

  private readonly _bpService: BpService;
  private readonly _runner: Runner;
  private readonly _debugger: Debugger;
  private _code: string;

  constructor(url: string) {
    this._bpService = new BpService(url);
    this._runner = new Runner(this._bpService);
    this._debugger = new Debugger(this._bpService);
    this._code = '';
  }

  subscribeOutputStream(sharedService) {
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
            this._runner.postRun(response);
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

    this._bpService.subscribeObserver(observer);
  }

  init(type, code) {
    this._code = code;
    this._bpService.initCL(type, code);
  }

  addExternalEvent(bEvent) {
    this._bpService.addExternalEventCL(bEvent);
  }

  get debugger(): Debugger {
    return this._debugger;
  }

  get runner(): Runner {
    return this._runner;
  }

  get code(): string {
    return this._code;
  }

  get bpService(): BpService {
    return this._bpService;
  }
}


