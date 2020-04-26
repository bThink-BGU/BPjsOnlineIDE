

export class DebugStep {

  private readonly _type: string;
  private readonly _bpss: any[];
  private readonly _variables: Map<object, object>;
  // private readonly _bThreadDebugData: any[];
  // private readonly _globalVariables: Map<string, string>;
  private readonly _reqList: string[];
  private readonly _selectableEvents: string[];
  private readonly _waitList: string[];
  private readonly _blockList: string[];
  private readonly _selectedEvent: string;

  constructor(bpss: any[], variables: Map<object, object>, reqList: string[],
              selectableEvents: string[], waitList: string[], blockList: string[], selectedEvent: string) {
    this._type = 'step';
    this._bpss = bpss;
    // this._bThreadDebugData = bThreadDebugData;
    this._variables = variables; // map of string (var) with value
    this._reqList = reqList; // BpEvents' list
    this._selectableEvents = selectableEvents;
    this._waitList = waitList; // BpEvents' list
    this._blockList = blockList; // BpEvents' list
    this._selectedEvent = selectedEvent;
  }


  get type(): string {
    return this._type;
  }

  get bpss(): any[] {
    return this._bpss;
  }

  // get bThreadDebugData(): any[] {
  //   return this._bThreadDebugData;
  // }
  //
  // get globalVariables(): any[] {
  //   return this._globalVariables;
  // }

  get variables(): Map<object, object> {
    return this._variables;
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
}


