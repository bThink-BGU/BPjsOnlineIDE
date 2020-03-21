import {WebSocketService} from "./Connection";

export const initCL = {
  func: init
};

function init(code) {
    WebSocketService.send_data('init', code);
}

