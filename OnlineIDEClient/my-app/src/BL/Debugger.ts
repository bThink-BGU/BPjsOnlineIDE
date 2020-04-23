import {stepCL} from '../CL/BpService';
import {DebugStep} from '../CL/DebugStep';
import {BreakPoint} from './BreakPoint';

export class Debugger {
  private _stepTrace: DebugStep[];
  private _eventTrace: string[];
  private _breakPoints: BreakPoint[];
  private _stdout: string;

  constructor() {
    this.initDebugger();
  }

  initDebugger() {
    this._stepTrace = []; // debugSteps' list
    this._eventTrace = [];
    this._breakPoints = []; // breakPoints' list
    this._stdout = '';
  }

  get stdout(): string {
    return this._stdout;
  }

  get eventTrace(): string[] {
    return this._eventTrace;
  }

  step() {
    const traceLength = this._stepTrace.length;
    const debugStep = traceLength === 0 ? new DebugStep(null,null,null,
      null,null,null,null,null) : this._stepTrace[traceLength - 1];
    stepCL(debugStep);
  }

  stepBack() {
   this.stepBackToIndex(this._stepTrace.length - 1);
  }

  stepBackToIndex(stepNumber: number) {
    // Check the cases: i) length = 0, ii) stepNumber < 0, iii) this._stepTrace.length - stepNumber < 0
    this._stepTrace.splice(stepNumber, this._stepTrace.length - stepNumber);
  }



  addBreakPoint(line) {
    this._breakPoints.push(new BreakPoint(line));
  }

  postStep(sharedService, response) {
    if(response.selectedEvent === 'finish') { // The program was ended
      this._stdout += '\n' + 'The Program was Ended';
    } else {
      this._stepTrace.push(new DebugStep(response.bpss, response.bThreadDebugData, response.globalVariables,
        response.reqList, response.selectableEvents, response.waitList, response.blockList, response.selectedEvent));
      if (!(this._stepTrace.length === 1)) {
        this._eventTrace.push(response.selectedEvent);
        this._stdout += '\n' + response.selectedEvent;
      }
    }
  }

  getLastStep() {
    if(!(this._stepTrace.length === 0))
      return this._stepTrace[this._stepTrace.length - 1];
    else
      return new DebugStep(null,null,null, [],[],
        [],[],'');
  }

}

