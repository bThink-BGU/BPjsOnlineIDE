import {runCL} from '../CL/BpService';

export class Runner {

  private isError: boolean;
  private stdout: string;
  private stderr: string;

  constructor() {
    this.isError = false;
    this.stdout = '';
    this.stderr = '';
  }

  run() {
    runCL();
  }

  postRun(sharedService, response) {
    this.stdout = response.message;
    sharedService.sharedOutput += '\n' + response.message;
  }

}





