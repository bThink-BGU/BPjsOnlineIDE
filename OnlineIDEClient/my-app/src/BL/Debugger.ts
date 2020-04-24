import {stepCL} from '../CL/BpService';
import {DebugStep} from '../CL/DebugStep';
import {BreakPoint} from './BreakPoint';

export class Debugger {
  private _stepTrace: DebugStep[];
  private _eventTrace: string[];
  private _breakPoints: BreakPoint[];
  private _stdout: string;
  private _programEnded: boolean;

  constructor() {
    this.initDebugger();
  }

  initDebugger() {
    this._stepTrace = []; // debugSteps' list
    this._eventTrace = [];
    this._breakPoints = []; // breakPoints' list
    this._stdout = '';
    this._programEnded = false;
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
    const traceLength = this._stepTrace.length;
    if(traceLength > 1)
      this.stepBackToIndex(traceLength - 1);
  }

  stepBackToIndex(stepNumber: number) {
    // Check the cases: i) length = 0, ii) stepNumber < 0, iii) this._stepTrace.length - stepNumber < 0
    this._stepTrace.splice(stepNumber, this._stepTrace.length - stepNumber);
    this._eventTrace.splice(stepNumber, this._eventTrace.length - stepNumber);
    this._stdout = '';
    for(let i = 0; i < this._eventTrace.length; i++){
      if(this._eventTrace[i] !== '')
        this._stdout += '\n' + this._eventTrace[i];
    }
  }

  addBreakPoint(line) {
    this._breakPoints.push(new BreakPoint(line));
  }

  postStep(sharedService, response) {
    if(this.isFinished(response)) { // The program was ended
      this._stdout += this._programEnded ? '' : '\n' + 'The Program was Ended';
      this._programEnded = true;
    } else {
      this._stepTrace.push(new DebugStep(response.bpss, response.bThreadDebugData, response.globalVariables,
        response.reqList, response.selectableEvents, response.waitList, response.blockList, response.selectedEvent));
      if(response.selectedEvent !== undefined) {
      this._eventTrace.push(response.selectedEvent);
      this._stdout += '\n' + response.selectedEvent;
      } else {
        this._eventTrace.push('');
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

  private isFinished(response: any) {
    return response.bpss === undefined && response.bThreadDebugData === undefined &&
      response.globalVariables === undefined && response.reqList === undefined &&
      response.selectableEvents === undefined && response.waitList === undefined &&
      response.blockList === undefined && response.selectedEvent === undefined;
  }
}

