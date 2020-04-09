import {stepCL} from '../CL/BpService';
import {DebugStep} from '../CL/DebugStep';
import {BreakPoint} from './BreakPoint';

export class Debugger {
  public readonly stepTrace: DebugStep[];
  private breakPoints: BreakPoint[];

  constructor() {
    this.stepTrace = []; // debugSteps' list
    this.breakPoints = []; // breakPoints' list
  }

  step() {
    const traceLength = this.stepTrace.length;
    const debugStep = traceLength === 0 ? new DebugStep(null,null,null,
      null,null,null,null,null) : this.stepTrace[traceLength - 1];
    stepCL(debugStep);
  }

  addBreakPoint(line) {
    this.breakPoints.push(new BreakPoint(line));
  }

  postStep(sharedService, response) {
    this.stepTrace.push(new DebugStep(response.bpss, response.bThreadDebugData, response.globalVariables,
      response.reqList, response.selectableEvents, response.waitList, response.blockList, response.selectedEvent));
    sharedService.sharedOutput += '\n' +
      'req: ' + response.reqList + '\n\nselectable: ' + response.selectableEvents +
    '\n\nwait: ' + response.waitList + '\n\nblock: ' + response.blockList +
    '\n\nselected: ' + response.selectedEvent;
  }

}

