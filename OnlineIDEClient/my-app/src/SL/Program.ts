import {init} from '../BL/Program';
import {run} from '../BL/Runner';

export function initSL(code) {
  return init(code);
}

export function runSL() {
  return run();
}

