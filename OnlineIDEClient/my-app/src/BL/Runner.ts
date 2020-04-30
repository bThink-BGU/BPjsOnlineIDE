import {BpService} from '../CL/BpService';

export class Runner {

  private _isError: boolean;
  private _stdout: string;
  private _stderr: string;
  private _bpService: BpService;

  constructor(bpService: BpService) {
    this.initRun();
    this._bpService = bpService;
  }

  get isError(): boolean {
    return this._isError;
  }

  get stdout(): string {
    return this._stdout;
  }

  get stderr(): string {
    return this._stderr;
  }

  run() {
    this.initRun();
    this._bpService.runCL();
  }

  private initRun() {
    this._isError = false;
    this._stdout = '';
  }

  postRun(sharedService, response) {
    if (response.type === 'error') {
      this._isError = true;
      this._stdout = response.message; // Clean stdout because an exception was thrown
    } else {
      this._stdout +=  response.message + '\n';
    }
  }
}





