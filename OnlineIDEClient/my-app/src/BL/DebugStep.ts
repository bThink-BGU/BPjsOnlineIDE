

export class DebugStep {

  private reqList: string[];
  private waitList: string[];
  private blockList: string[];
  private bpStack: any;

  constructor(reqList: string[], waitList: string[], blockList: string[], bpStack: any) {
    this.reqList = reqList; // BpEvents' list
    this.waitList = waitList; // BpEvents' list
    this.blockList = blockList; // BpEvents' list
    this.bpStack = bpStack; // map of string (var) with value
  }

}


