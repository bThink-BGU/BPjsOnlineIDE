import {nextStepCL} from '../CL/BpService';
import {DebugStep} from './DebugStep';
import {BreakPoint} from './BreakPoint';

export class Debugger {
  private contTrace: any[];
  private eventTrace: string[];
  private stepTrace: DebugStep[];
  private breakPoints: BreakPoint[];

  constructor() {
    this.contTrace = []; // states' list
    this.eventTrace = []; // BpEvents' list
    this.stepTrace = [];
    this.breakPoints = []; // breakPoints' list
  }

  nextStep() {
    const traceLength = this.contTrace.length;
    const cont = traceLength === 0 ? null : this.contTrace[traceLength - 1];
    const s = nextStepCL(cont);
    this.contTrace.push(s.cont);
    this.eventTrace.push(s.event);
    const currStep = new DebugStep(s.reqList, s.waitList, s.blockList, s.bpStack);
    this.stepTrace.push(currStep);
    // function output ????
  }

  addBreakPoint(line) {
    this.breakPoints.push(new BreakPoint(line));
  }

  postStep(outputStreamClass, response) {

    // The fields of response are: type, stack, request, wait, block, selectedEvent.

    // Only for checking
    outputStreamClass.output += '\n' + response.selectedEvent;
  }

}

