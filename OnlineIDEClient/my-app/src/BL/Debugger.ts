import {nextStepCL} from '../CL/Debugger';
import {DebugStep1} from './DebugStep';
import {BreakPoint} from './BreakPoint';

function Debugger() {
  this.contTrace = []; // states' list
  this.eventTrace = []; // BpEvents' list
  this.stepTrace = [];
  this.breakPoints = []; // breakPoints' list
}

export function nextStep() {
  const traceLength = this.contTrace.length;
  const cont = traceLength === 0 ? null : this.contTrace[traceLength - 1];
  const s = nextStepCL(cont);
  this.contTrace.push(s.cont);
  this.eventTrace.push(s.event);
  const currStep = new DebugStep1(s.reqList, s.waitList, s.blockList, s.bpStack);
  this.stepTrace.push(currStep);
  // function output ????
}

export function addBreakPoint(line) {
  this.breakPoints.push(new BreakPoint(line));
}

export function postStep(outputStreamClass, response) {

  // The fields of response are: type, stack, request, wait, block, selectedEvent.

  // Only for checking
  outputStreamClass.output += '\n' + response.selectedEvent;
}
