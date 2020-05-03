import {BpService} from '../CL/BpService';
import {DebugStep} from '../CL/DebugStep';
import {BreakPoint} from './BreakPoint';

export class Debugger {
  private _stepTrace: DebugStep[];
  private _eventTrace: string[];
  private _breakPoints: BreakPoint[];
  private _stdout: string;
  private _programEnded: boolean;
  private readonly _bpService: BpService;

  constructor(bpService: BpService) {
    this.initDebugger();
    this._bpService = bpService;
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
    const debugStep = traceLength === 0 ? new DebugStep(undefined, undefined, undefined,
      undefined, undefined, undefined, undefined) :
      this._stepTrace[traceLength - 1];
    this._bpService.stepCL(debugStep);
  }

  stepBack() {
    const traceLength = this._stepTrace.length;
    if (traceLength > 1) {
      this.stepBackToIndex(traceLength - 1);
    }
  }

  stepBackToIndex(stepNumber: number) {
    // Check the cases: i) length = 0, ii) stepNumber < 0, iii) this._stepTrace.length - stepNumber < 0
    if (stepNumber <= 0)
      return;
    this._stepTrace.splice(stepNumber, this._stepTrace.length - stepNumber);
    this._eventTrace.splice(stepNumber, this._eventTrace.length - stepNumber);
    this._stdout = '';
    for (let i = 0; i < this._eventTrace.length; i++) {
      if (this._eventTrace[i] !== '') {
        this._stdout += '\n' + this._eventTrace[i];
      }
    }
  }

  addBreakPoint(line) {
    this._breakPoints.push(new BreakPoint(line));
  }

  postStep(response) {
    if (this._programEnded) // The program was ended
      return;
    else if (this.isFinished(response)) { // The program now finished
      this._stdout += '\n' + 'The Program was Ended';
      this._programEnded = true;
    } else {
      this._stepTrace.push(new DebugStep(response.bpss, this.toVarsMap(response), response.reqList,
        response.selectableEvents, response.waitList, response.blockList, response.selectedEvent));
      if (response.selectedEvent !== undefined) {
        this._eventTrace.push(response.selectedEvent);
        this._stdout += '\n' + response.selectedEvent;
      } else {
        this._eventTrace.push('');
      }
    }
  }

  getLastStep() {
    if (!(this._stepTrace.length === 0)) {
      return this._stepTrace[this._stepTrace.length - 1];
    }
    else {
      return new DebugStep(null, null, [], [], [], [],
        '');
    }
  }

  private isFinished(response: any) {
    return response.bpss === undefined && response.bThreadDebugData === undefined &&
      response.globalVariables === undefined && response.reqList === undefined &&
      response.selectableEvents === undefined && response.waitList === undefined &&
      response.blockList === undefined && response.selectedEvent === undefined;
  }

  private toVarsMap(response: any) {
    if (response.vars === undefined || response.vals === undefined)
      return undefined;
    const variables = new Map();
    for (let i = 0; i < response.vars.length; i++) {
      variables.set(response.vars[i], response.vals[i]);
    }
    return variables;
  }

  get stepTrace(): DebugStep[] {
    return this._stepTrace;
  }

  get breakPoints(): BreakPoint[] {
    return this._breakPoints;
  }

  get programEnded(): boolean {
    return this._programEnded;
  }

  get bpService(): BpService {
    return this._bpService;
  }

  setStepTrace(l: DebugStep[]) {
    this._stepTrace = l;
  }

  setEventTrace(l: string[]) {
    this._eventTrace = l;
  }

}
