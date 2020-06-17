import {BThreadInfo} from "./BThreadInfo";


export class DebugStep {

  private readonly _type: string;
  private readonly _bpss: any[];
  private readonly _globalVariables: Map<object, object>;
  private _globalVariablesString: Map<string, string>;
  private readonly _bThreads: BThreadInfo[];
  private readonly _reqList: string[];
  private readonly _selectableEvents: string[];
  private readonly _waitList: string[];
  private readonly _blockList: string[];
  private readonly _selectedEvent: string;
  private readonly _line: number;

  constructor(bpss: any[], gVariables: Map<object, object>, bThreads: BThreadInfo[],
              reqList: string[], selectableEvents: string[], waitList: string[], blockList: string[],
              selectedEvent: string, line: number, functions = []) {
    this._type = 'step';
    this._bpss = bpss;
    this._globalVariables = gVariables;

    this.toStringGlobalVariables(functions);

    this._bThreads = bThreads;
    this._reqList = reqList; // BpEvents' list
    this._selectableEvents = selectableEvents;
    this._waitList = waitList; // BpEvents' list
    this._blockList = blockList; // BpEvents' list
    this._selectedEvent = selectedEvent;
    this._line = line;
  }

  get type(): string {
    return this._type;
  }

  get bpss(): any[] {
    return this._bpss;
  }

  get bThreads(): BThreadInfo[] {
    return this._bThreads;
  }

  get reqList(): string[] {
    return this._reqList;
  }

  get selectableEvents(): string[] {
    return this._selectableEvents;
  }

  get waitList(): string[] {
    return this._waitList;
  }

  get blockList(): string[] {
    return this._blockList;
  }

  get selectedEvent(): string {
    return this._selectedEvent;
  }

  get globalVariables(): Map<any, any> {
    return this._globalVariables;
  }

  get globalVariablesString(): Map<string, string> {
    return this._globalVariablesString;
  }

  toStringGlobalVariables(functions) {
    if (this._globalVariables === undefined)
      this._globalVariablesString = undefined;
    else {
      this._globalVariablesString = new Map();
      for (let key of this._globalVariables.keys()){
        if (!functions.includes(key))
          this._globalVariablesString.set(JSON.stringify(key), JSON.stringify(this._globalVariables.get(key)));
      }
    }
  }

  get line(): number {
    return this._line;
  }
}


