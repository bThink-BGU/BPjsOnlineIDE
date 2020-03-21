import {WebSocketService} from "./Connection";

export const runCL = {
  func: run
};

function run() {
  WebSocketService.send_data('', 'THE RUN COMMAND');
}


