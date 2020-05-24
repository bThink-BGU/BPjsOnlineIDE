
export class BThreadInfo {

  private _bThreadName: string;
  private _firstLinePC: number;
  private _localShift: number;
  private _localVariables: Map<object, object>;


  constructor(bThreadName: string, firstLinePC: number, localShift: number, localVariables: Map<object, object>) {
    this._bThreadName = bThreadName;
    this._firstLinePC = firstLinePC;
    this._localShift = localShift;
    this._localVariables = localVariables;
  }


  get bThreadName(): string {
    return this._bThreadName;
  }

  get firstLinePC(): number {
    return this._firstLinePC;
  }

  get localShift(): number {
    return this._localShift;
  }

  get localVariables(): Map<object, object> {
    return this._localVariables;
  }
}
