

export class DebugStep {

  private readonly _type: string;
  private readonly _continuation: any[];
  private readonly _bpStack: any;
  private readonly _reqList: string[];
  private readonly _waitList: string[];
  private readonly _blockList: string[];
  private readonly _selectedEvent: string;

  constructor(continuation: any[], bpStack: any, reqList: string[], waitList: string[], blockList: string[],
              selectedEvent: string) {
    this._type = 'step';
    this._continuation = continuation;
    this._bpStack = bpStack; // map of string (var) with value
    this._reqList = reqList; // BpEvents' list
    this._waitList = waitList; // BpEvents' list
    this._blockList = blockList; // BpEvents' list
    this._selectedEvent = selectedEvent;
  }

  get type(): string {
    return this._type;
  }

  get continuation(): any[] {
    return this._continuation;
  }

  get bpStack(): any {
    return this._bpStack;
  }

  get reqList(): string[] {
    return this._reqList;
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


