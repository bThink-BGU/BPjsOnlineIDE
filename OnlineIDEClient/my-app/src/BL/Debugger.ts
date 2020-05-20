import {BpService} from '../CL/BpService';
import {DebugStep} from '../CL/DebugStep';
import {BreakPoint} from './BreakPoint';
import {BThreadInfo} from '../CL/BThreadInfo';

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
      undefined, undefined, undefined, undefined, undefined) :
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
    if (stepNumber <= 0) {
      return;
    }
    this._stepTrace.splice(stepNumber, this._stepTrace.length - stepNumber);
    this._eventTrace.splice(stepNumber, this._eventTrace.length - stepNumber);
    this._stdout = '';
    for (let i = 0; i < this._eventTrace.length; i++) {
      if (this._eventTrace[i] !== '') {
        this._stdout += '\n' + this._eventTrace[i];
      }
    }
    this._programEnded = false;
  }

  addBreakPoint(line) {
    this._breakPoints.push(new BreakPoint(line));
  }

  postStep(response) {
    if (this._programEnded) { // The program ended
      return;
    }
    if (this.isFinished(response)) { // The program finished
      this._stdout += '\n' + 'The Program Ended';
      this._programEnded = true;
    } else {
      this._stepTrace.push(this.buildDebugStep(response));
      if (response.selectedEvent !== undefined) {
        this._eventTrace.push(response.selectedEvent);
        this._stdout += '\n' + response.selectedEvent;
      } else {
        this._eventTrace.push('');
      }
    }
  }

  private buildDebugStep(response) {
    const bThreadsResponse = response.bThreads;
    const bThreads = [];
    for (let i = 0; i < bThreadsResponse.length; i++) {
      const bThreadInfo = new BThreadInfo(bThreadsResponse[i].bThreadName, bThreadsResponse[i].firstLinePC,
        bThreadsResponse[i].localShift, this.toVarsMap(bThreadsResponse[i].localVars, bThreadsResponse[i].localVals));
      bThreads.push(bThreadInfo);
    }
    return new DebugStep(response.bpss, this.toVarsMap(response.globalVars, response.globalVals), bThreads,
      response.reqList, response.selectableEvents, response.waitList, response.blockList, response.selectedEvent);
  }

  getLastStep() {
    if (!(this._stepTrace.length === 0)) {
      return this._stepTrace[this._stepTrace.length - 1];
    } else {
      return new DebugStep(undefined, new Map<object, object>(),
        [], [], [], [],
        [], '');
    }
  }

  private isFinished(response: any) {
    return response.bpss === undefined && response.bThreadDebugData === undefined &&
      response.globalVariables === undefined && response.reqList === undefined &&
      response.selectableEvents === undefined && response.waitList === undefined &&
      response.blockList === undefined && response.selectedEvent === undefined;
  }

  private toVarsMap(vars, vals) {
    if (vars === undefined || vals === undefined) {
      return undefined;
    }
    const variables = new Map();
    for (let i = 0; i < vars.length; i++) {
      variables.set(vars[i], vals[i]);
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
