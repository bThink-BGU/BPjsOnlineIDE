
export class BThreadInfo {

  private _bThreadName: string;
  private _firstLinePC: number;
  private _localShift: number;
  private _localVariables: Map<object, object>;
  private _localVariablesString: Map<string, string>;
  private _isAdvanced: boolean;

  constructor(bThreadName: string, firstLinePC: number, localShift: number, localVariables: Map<object, object>,
              lastSync: number) {
    this._bThreadName = bThreadName;
    this._firstLinePC = firstLinePC;
    this._localShift = localShift;
    this._localVariables = localVariables;

    this.toStringLocalVariables();

    this._isAdvanced = lastSync === this.getNextSyncLineNumber();
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

  get localVariables(): Map<any, any> {
    return this._localVariables;
  }

  get isAdvanced(): boolean {
    return this._isAdvanced;
  }

  get localVariablesString(): Map<string, string> {
    return this._localVariablesString;
  }

  // TODO - This function needs to return the current line of this thread.
  //  Right now it returns the line that the bThread is created instead of the current line.
  getNextSyncLineNumber() {
    return this._firstLinePC;
  }

  toStringLocalVariables() {
    if(this._localVariables === undefined)
      this._localVariablesString = undefined;
    else {
      this._localVariablesString = new Map();
      for (let key of this._localVariables.keys())
        this._localVariablesString.set(JSON.stringify(key), JSON.stringify(this._localVariables.get(key)));
    }
  }
}
