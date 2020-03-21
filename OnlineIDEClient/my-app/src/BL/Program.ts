import {initCL} from '../CL/Program';


export const program = {
  code: '',
  breakPoints: [] // breakPoints' list
};

export function init(code) {
  program.code = code;
  initCL.func(code);
}
