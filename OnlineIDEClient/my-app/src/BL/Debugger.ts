import {stepCL} from '../CL/BpService';
import {DebugStep} from '../CL/DebugStep';
import {BreakPoint} from './BreakPoint';

export class Debugger {
  private stepTrace: DebugStep[];
  private breakPoints: BreakPoint[];

  constructor() {
    this.stepTrace = [];
    this.breakPoints = []; // breakPoints' list
  }

  step() {
    const traceLength = this.stepTrace.length;
    const debugStep = traceLength === 0 ? null : this.stepTrace[traceLength - 1];
    stepCL(debugStep);
  }

  addBreakPoint(line) {
    this.breakPoints.push(new BreakPoint(line));
  }

  postStep(sharedService, response) {
    this.stepTrace.push(new DebugStep(response.continuation, response.bpStack, response.reqList, response.waitList,
      response.blockList, response.selectedEvent));
    sharedService.sharedOutput += '\n' + response.selectedEvent;
  }

}

