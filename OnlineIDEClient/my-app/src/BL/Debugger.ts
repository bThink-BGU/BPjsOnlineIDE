import {stepCL} from '../CL/Debugger';

const bpDebugger = {
  contTrace: [], // states' list
  eventTrace: [], // BpEvents' list
};



// TODO
function step() { // What to do with the event trace???
  // const st = stepCL(getLastElement(bpDebugger.contTrace));
  // debuggr.contTrace.push(st.cont);
  // return st;
}

function getLastElement(l) {
  return l[l.length - 1];
}
