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
    next: (response) => {
      if(response.type === 'init'){
        run();
      }
      else if (response.type === 'run'){
        output_stream_class.output += '\n' + response.message;
      }

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



