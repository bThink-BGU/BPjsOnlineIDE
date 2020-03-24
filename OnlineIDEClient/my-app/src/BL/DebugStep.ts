

export function DebugStep() {
  this.reqList = []; // BpEvents' list
  this.waitList = []; // BpEvents' list
  this.blockList = []; // BpEvents' list
  this.bpStack = []; // map of string (var) with value
}

export function DebugStep1(reqList, waitList, blockList, bpStack) {
  this.reqList = reqList; // BpEvents' list
  this.waitList = waitList; // BpEvents' list
  this.blockList = blockList; // BpEvents' list
  this.bpStack = bpStack; // map of string (var) with value
}


