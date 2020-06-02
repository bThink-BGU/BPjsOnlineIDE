

export class BreakPoint {

  private _line: Number;

  constructor(line: Number) {
    this._line = line;
  }

  get line(): Number {
    return this._line;
  }
}
