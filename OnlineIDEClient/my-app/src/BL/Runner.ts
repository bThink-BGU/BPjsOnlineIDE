import {BpService} from '../CL/BpService';

export class Runner {

  private _isError: boolean;
  private _stdout: string;
  private readonly _bpService: BpService;
  private _stop: boolean;

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

  run() {
    this.initRun();
    this._bpService.runCL();
  }

  stop() {
    this._stop = true;
    this._bpService.stopCL();
  }

  private initRun() {
    this._isError = false;
    this._stdout = '';
    this._stop = false;
  }

  postRun(response) {
    if (this._stop) {
      if (!this._stdout.includes('>\tThe Program Was Halted'))
        this._stdout += '>\tThe Program Was Halted';
    } else if (response.type === 'error') {
      this._isError = true;
      this._stdout = '>\t' + response.message; // Clean stdout because an exception was thrown
    } else {
      this._stdout += '>\t' + response.message + '\n';
    }
  }

  get bpService(): BpService {
    return this._bpService;
  }

  setIsError(value: boolean) {
    this._isError = value;
  }

  setStdout(value: string) {
    this._stdout = value;
  }
}





