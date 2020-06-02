

export class BreakPoint {

  private readonly _line: number;

  constructor(line: number) {
    this._line = line;
  }

  get line(): number {
    return this._line;
  }
}
