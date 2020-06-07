
export class BThreadInfo {


  private _bThreadName: string;
  private _firstLinePC: number;
  private _localShift: number;
  private _localVariables: Map<object, object>;
  private _isAdvanced: boolean;

  constructor(bThreadName: string, firstLinePC: number, localShift: number, localVariables: Map<object, object>,
              lastSync: number) {
    this._bThreadName = bThreadName;
    this._firstLinePC = firstLinePC;
    this._localShift = localShift;
    this._localVariables = localVariables;
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

  getNextSyncLineNumber() {
    // const currCode = this.getLineOfFirstLinePC(code);
    // return this._firstLinePC + this.getLineOfLocalShift(currCode) + 1;
    return this._firstLinePC + 1;
  }


  // private getLineOfFirstLinePC(code: string) {
  //   let counter = 0;
  //   let currCode = code;
  //   let endOfLineIndex = -1;
  //   while (counter++ < this._firstLinePC) {
  //     endOfLineIndex = currCode.search('\n');
  //     currCode = currCode.substr(endOfLineIndex + 1);
  //   }
  //   return currCode;
  // }
  //
  // private getLineOfLocalShift(code: string) {
  //   let lineNumber = 0;
  //   let counter = 0;
  //   let currCode = code;
  //   let endOfLineIndex = -1;
  //   let line = '';
  //   while (lineNumber < this._localShift) {
  //     endOfLineIndex = currCode.search('\n');
  //     line =  currCode.substr(0, endOfLineIndex);
  //     currCode = currCode.substr(endOfLineIndex + 1);
  //     counter++;
  //     if (line.length === 0 || (line[0] === '/' && line[1] === '/'))
  //       continue;
  //     lineNumber++;
  //   }
  //     return counter;
  // }
}
