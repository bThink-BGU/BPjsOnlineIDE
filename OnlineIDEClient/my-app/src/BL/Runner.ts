import {runCL} from '../CL/BpService';

export class Runner {

  private isError: boolean;
  private stdout: string;
  private stderr: string;

  constructor() {
    this.initRun();
  }

  run() {
    this.initRun();
    runCL();
  }

  private initRun() {
    this.isError = false;
    this.stdout = '';
    this.stderr = '';
  }

  postRun(sharedService, response) {
    if (response.type === 'error') {
      this.isError = true;
      this.stderr = response.message;
      this.stdout = ''; // Clean stdout because an exception was thrown
    } else {
      this.stdout += response.message;
    }

    // Need to change
    sharedService.sharedOutput += '\n' + response.message;
  }
}





