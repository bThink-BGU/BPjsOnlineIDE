import {runCL} from '../CL/Runner';
import {Observable} from "rxjs";
import {WebSocketService} from "../CL/Connection";

export const runner = {
  isError: false,
  stdout: '',
  stderr: '',
};


export function subscribe_output_stream(output_stream_class){

  let observer = {
    next: (output) => {


      output_stream_class.output += '\n' + output.type;
    },
    error: (error) => {
      output_stream_class.output = error;
    }
  };

  WebSocketService.get_observable().subscribe(observer);
}

export function run() {
  runCL.func();
}



