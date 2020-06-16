import {BpService} from '../CL/BpService';
import {DebugStep} from '../CL/DebugStep';
import {BreakPoint} from './BreakPoint';
import {BThreadInfo} from '../CL/BThreadInfo';
import {Subject} from 'rxjs';
import {fakeAsync} from '@angular/core/testing';

export class Debugger {
  private _stepTrace: DebugStep[];
  private _eventTrace: string[];
  private _breakPoints: BreakPoint[];
  private _stdout: string;
  private _programEnded: boolean;
  private _functions: string[];
  private readonly _bpService: BpService;
  private bthreadSubject: Subject<{}>;

  constructor(bpService: BpService, code: string) {
    this.initDebugger();
    this._bpService = bpService;
    this.bthreadSubject = new Subject<{}>();
    this.findAllFunctions(code);
  }

  subscribeCodeEditor(observer) {
    this.bthreadSubject.subscribe(observer);
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
    const debugStep = traceLength === 0 ? new DebugStep(undefined, undefined, [],
      undefined, undefined, undefined, undefined, undefined,
      undefined) : this._stepTrace[traceLength - 1];
    this._bpService.stepCL(debugStep);
  }

  postStep(response) {
    if (this._programEnded) { // The program ended
      return;
    }
    if (this.isFinished(response)) { // The program finished
      if (response.selectedEvent === undefined) {
        this._stdout += '\n' + 'The Program Ended';
        this._programEnded = true;
      } else if (response.selectedEvent === 'timeout') {
        this._stdout += '\n' + 'Timeout Occurred';
        this._programEnded = true;
      } else { // Finished because a bug occur
        this._stdout = response.selectedEvent;
        this._programEnded = true;
      }
      this.bthreadSubject.next([]);
    } else {
      const debugStep = this.buildDebugStep(response);
      this._stepTrace.push(debugStep);
      if (response.selectedEvent !== undefined) {
        this._eventTrace.push(response.selectedEvent);
        this._stdout += '\n' + response.selectedEvent;
      } else {
        this._eventTrace.push('');
      }

      this.bthreadSubject.next(debugStep.bThreads);

    }
  }

  private buildDebugStep(response): DebugStep {
    const bThreadsResponse = response.bThreads;
    const bThreads = [];
    for (let i = 0; i < bThreadsResponse.length; i++) {
      const bThreadName = bThreadsResponse[i].bThreadName;
      const bThreadInfo = new BThreadInfo(bThreadName, bThreadsResponse[i].firstLinePC, bThreadsResponse[i].localShift,
        this.toVarsMap(bThreadsResponse[i].localVars, bThreadsResponse[i].localVals),
        this.getLastSyncOfLastStep(bThreadName));
      bThreads.push(bThreadInfo);
    }
    return new DebugStep(response.bpss, this.toVarsMap(response.globalVars, response.globalVals), bThreads,
      response.reqList, response.selectableEvents, response.waitList, response.blockList, response.selectedEvent,
      this.calcLineOfStep(bThreads));
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

    this.bthreadSubject.next(this._stepTrace[this._stepTrace.length - 1].bThreads);

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

  removeBreakPoint(line: number) {
    const ind = this.getIndexOfBreakPoint(line);
    this._breakPoints.splice(ind, ind === -1 ? 0 : 1);
  }

  private getIndexOfBreakPoint(line) {
    for (let i = 0; i < this._breakPoints.length; i++) {
      if (this._breakPoints[i].line === line) {
        return i;
      }
    }
    return -1;
  }

  getLastStep() {
    if (!(this._stepTrace.length === 0)) {
      return this._stepTrace[this._stepTrace.length - 1];
    } else {
      return new DebugStep(undefined, new Map<object, object>(),
        [], [], [], [],
        [], '', -1);
    }
  }

  private isFinished(response: any) {
    return response.bpss === undefined && response.globalVariables === undefined &&
      response.reqList === undefined && response.selectableEvents === undefined &&
      response.waitList === undefined && response.blockList === undefined;
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

  moveToTheFirstLine() { // Move to the first line with breakpoint
    if (this._breakPoints.length === 0) {
      this.step();
    } else {
      this.stepToBreakPoint();
    }
  }

  stepToBreakPoint() {
    while (!this._programEnded) {
      this.step();
      if (this.getIndexOfBreakPoint(this.getLastStep().line) > -1) {
        break;
      }
    }
  }

  stepBackToBreakPoint() {
    while (this._stepTrace.length > 1) {
      this.stepBack();
      if (this.getIndexOfBreakPoint(this.getLastStep().line) > -1) {
        break;
      }
    }
  }

  private calcLineOfStep(currStepBThreads: BThreadInfo[]) {
    const nextLines = [];
    const currLines = [];
    this.getLastStep().bThreads.forEach(function(bt) {
      nextLines.push(bt.getNextSyncLineNumber());
    });
    currStepBThreads.forEach(function(bt) {
      currLines.push(bt.getNextSyncLineNumber());
    });
    for (const line of currLines) {
      if (!nextLines.includes(line)) { // The line already chosen
        return line;
    }
      }
    return -1;
  }

  private getLastSyncOfLastStep(bThreadName: string) {
    this.getLastStep().bThreads.forEach(function(b) { if (b.bThreadName === bThreadName) {
      return b.getNextSyncLineNumber(); } });
    return -1;
  }

  private findAllFunctions(code: string) {
    let str = code;
    const i = 0;
    let inString = false;
    let inComment = false;
    while (i < str.length) {
      const quoteInd = this.getNextQuoteInd(str);
      const lineCommentInd = str.indexOf('//');
      const openCommentInd = str.indexOf('/*');
      const closeCommentInd = str.indexOf('*/');
      const functionInd = str.indexOf('function');

      if (this.isSmallest(functionInd, [quoteInd, lineCommentInd, openCommentInd, closeCommentInd]) &&
        !inString && !inComment) { // Function not in string or comment
        str = str.substring(this.addToFunctions(str, functionInd), str.length);
      } else if (this.isSmallest(openCommentInd, [quoteInd, lineCommentInd, closeCommentInd]) &&
        !inString) { // The next is /* and not in string
        inComment = true;
        str = str.substring(openCommentInd, str.length);
      } else if (this.isSmallest(closeCommentInd, [quoteInd, lineCommentInd, openCommentInd]) &&
        inComment && !inString) { // The next is */ and not in string and not in string and in comment that open wth /*
        inComment = false;
        str = str.substring(closeCommentInd, str.length);
      } else if (this.isSmallest(lineCommentInd, [quoteInd, closeCommentInd, openCommentInd]) &&
        !inComment && !inString) { // The next is // and not in comment or string
        str = str.substring(lineCommentInd, str.length);
        const newLine = str.indexOf('\n');
        if (newLine > 0) { str = str.substring(newLine + 2, str.length); } else { str = ''; }
      } else if (this.isSmallest(quoteInd, [closeCommentInd, lineCommentInd, openCommentInd]) &&
        !inComment && inString) { // The next is ' or '' and in string and not in comment
        inString = false;
        str = str.substring(quoteInd, str.length);
      } else if (this.isSmallest(quoteInd, [closeCommentInd, lineCommentInd, openCommentInd]) &&
        !inComment && !inString) { // The next is ' or '' and not in string and not in comment
        inString = true;
        str = str.substring(quoteInd, str.length);
      } else {
        str = str.substring([functionInd, quoteInd, lineCommentInd, openCommentInd, closeCommentInd].sort()[0], str.length);
      }
    }
  }

  private addToFunctions(code, functionInd) {
    let tmpStr = code.substring(functionInd + 9, code.length);
    const lastInd = this.getIndOfFirst(tmpStr, ' ', '(');
    tmpStr = tmpStr.substring(0, lastInd);
    this._functions.push(tmpStr);
    return functionInd + 9 + lastInd;
  }

  private isSmallest(smallest, others) {
    if (smallest === -1) {
      return false;
    }
    for (const other of others) {
      if (smallest > other) {
        return false;
      }
    }
    return true;
  }


  private getIndOfFirst(str, c1, c2) {
    const ind1 = str.indexOf(c1);
    const ind2 = str.indexOf(c2);
    return ind1 === -1 ? ind2 : ind2 === -1 ? ind1 : Math.min(ind1, ind2);
  }

  private getNextQuoteInd(code: string) {
    return this.getIndOfFirst(code, '\'', '\"');
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
  set programEnded(value: boolean) {
    this._programEnded = value;
  }
}
