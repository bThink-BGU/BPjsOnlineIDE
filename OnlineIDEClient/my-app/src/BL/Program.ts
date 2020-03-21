import {initCL} from '../CL/Program';
import {Observable, Observer} from "rxjs";
import {WebSocketService} from "../CL/Connection";

export const program = {
  code: '',
  breakPoints: [] // breakPoints' list
};

export function init(code) {
  program.code = code;
  initCL.func(code);
}
