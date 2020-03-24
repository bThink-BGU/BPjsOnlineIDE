export function State() {
  this.cont = '';
  this.event = '';
  this.reqList = []; // BpEvents' list
  this.waitList = []; // BpEvents' list
  this.blockList = []; // BpEvents' list
  this.bpStack = {}; // map of string (var) with value
}

export function State1(cont, event, reqList, waitList, blockList, bpStack) {
  this.cont = cont;
  this.event = event;
  this.reqList = reqList; // BpEvents' list
  this.waitList = waitList; // BpEvents' list
  this.blockList = blockList; // BpEvents' list
  this.bpStack = bpStack; // map of string (var) with value
}

// TODO
export function fromJSon(json) {
  return json;
}

// TODO
export function toJson() {
  return;
}
