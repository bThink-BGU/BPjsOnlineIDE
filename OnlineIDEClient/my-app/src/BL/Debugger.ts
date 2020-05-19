import {BpService} from '../CL/BpService';
import {DebugStep} from '../CL/DebugStep';
import {BreakPoint} from './BreakPoint';
import {translateStatement} from "@angular/compiler-cli/src/ngtsc/translator";

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
    this._programEnded = false;
  }

  addBreakPoint(line) {
    this._breakPoints.push(new BreakPoint(line));
  }

  postStep(response) {
    if (this._programEnded) // The program ended
      return;
    if (this.isFinished(response)) { // The program finished
      this._stdout += '\n' + 'The Program Ended';
      this._programEnded = true;
    } else {
      this._stepTrace.push(new DebugStep(response.bpss, this.toGVarsMap(response), this.toLVarsMap(response),
        response.reqList, response.selectableEvents, response.waitList, response.blockList, response.selectedEvent));
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
      return new DebugStep(undefined, new Map<object, object>(),
        new Map<string, Map<object, object>>(), [], [], [],
        [], '');
    }
  }

  private isFinished(response: any) {
    return response.bpss === undefined && response.bThreadDebugData === undefined &&
      response.globalVariables === undefined && response.reqList === undefined &&
      response.selectableEvents === undefined && response.waitList === undefined &&
      response.blockList === undefined && response.selectedEvent === undefined;
  }

  private toGVarsMap(response: any) {
    if (response.globalVars === undefined || response.globalVals === undefined)
      return undefined;
    const gVariables = new Map();
    for (let i = 0; i < response.globalVars.length; i++) {
      gVariables.set(response.globalVars[i], response.globalVals[i]);
    }
    return gVariables;
  }

  private toLVarsMap(response: any) {
    if (response.bThreadNames === undefined || response.localVars === undefined || response.localVals === undefined)
      return undefined;
    const lVariables = new Map();
    const tmpLVariables = new Map();
    for (let i = 0; i < response.bThreadNames.length; i++) {
      for (let j = 0; j < response.localVars[i].length; j++){
        tmpLVariables.set(response.localVars[i][j], response.localVals[i][j]);
      }
      lVariables.set(response.bThreadNames[i], tmpLVariables);
    }
    return lVariables;
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
